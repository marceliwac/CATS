const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  UserNotFoundException,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const log = require('@wls/log');
const {
  GROUPS,
  WHITELISTED_ATTRIBUTES,
  COGNITO_DISABLE_USER_QUOTA,
  COGNITO_ENABLE_USER_QUOTA,
} = require('./constants');

async function rateLimited(array, ratePerS, asyncProcessingFunction) {
  function splitIntoChunks(a, r) {
    const chunks = [];
    for (let i = 0; i * r < a.length; i += 1) {
      chunks.push(a.slice(i * r, (i + 1) * r));
    }
    return chunks;
  }

  function wait() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function itemRunner(chunk, f) {
    await Promise.all(chunk.map((item) => f(item)));
    await wait();
  }

  async function processTasks(chunks, f) {
    for (let i = 0; i < chunks.length; i += 1) {
      log.debug(`Processing chunk [${i + 1}/${chunks.length}]`);
      // eslint-disable-next-line no-await-in-loop
      await itemRunner(chunks[i], f);
    }
  }

  log.debug(
    `Executing rate limited job, estimated minimum time: ${
      splitIntoChunks(array, ratePerS).length
    }s`
  );

  const cs = splitIntoChunks(array, ratePerS);
  return processTasks(cs, asyncProcessingFunction);
}

function validateGroupName(groupName) {
  if (!GROUPS.includes(groupName)) {
    throw new Error(
      `Invalid group specified! Group has to be one of: [${GROUPS.join(', ')}].`
    );
  }
}

function formatUser(userObject) {
  const user = {
    id: userObject.Username,
    status: userObject.UserStatus,
    isEnabled: userObject.Enabled,
    createdAt: userObject.UserCreateDate,
    updatedAt: userObject.UserLastModifiedDate,
  };

  if (userObject.Attributes) {
    userObject.Attributes.forEach((attribute) => {
      if (Object.keys(WHITELISTED_ATTRIBUTES).includes(attribute.Name)) {
        user[WHITELISTED_ATTRIBUTES[attribute.Name]] = attribute.Value;
      }
    });
  } else if (userObject.UserAttributes) {
    userObject.UserAttributes.forEach((attribute) => {
      if (Object.keys(WHITELISTED_ATTRIBUTES).includes(attribute.Name)) {
        user[WHITELISTED_ATTRIBUTES[attribute.Name]] = attribute.Value;
      }
    });
  }

  return user;
}

module.exports = class UserService {
  constructor({ userPoolId, region }) {
    this.userPoolId = userPoolId;
    this.client = new CognitoIdentityProviderClient({
      region,
    });
  }

  async createUser(email, attributes, group) {
    const formattedAttributes = Object.keys(attributes).map((key) => ({
      Name: key,
      Value: attributes[key],
    }));
    const username = email.toLowerCase();
    formattedAttributes.push({ Name: 'email_verified', Value: 'true' });
    formattedAttributes.push({ Name: 'email', Value: username });
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      UserAttributes: formattedAttributes,
      Username: username,
      ClientMetadata: { group },
    });
    const createUserResponse = await this.client.send(createUserCommand);
    const user = formatUser(createUserResponse.User);

    const addUserToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: group,
    });
    await this.client.send(addUserToGroupCommand);

    return user;
  }

  async addUserToGroup(email, group) {
    const addUserToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: email,
      GroupName: group,
    });
    await this.client.send(addUserToGroupCommand);
  }

  async getUserByEmailIfExists(email, includeGroups) {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
      Filter: `email="${email.toLowerCase()}"`,
    });
    const response = await this.client.send(command);
    const users = response.Users.map((user) => formatUser(user));
    if (users.length === 0) {
      return null;
    }
    if (users.length !== 1) {
      throw new Error(
        'Invalid application state! More than one user with the same email address exists.'
      );
    }
    const user = users[0];

    if (includeGroups) {
      user.groups = await this.getGroupsForUser(user.id);
    }

    return user;
  }

  async getUsers(includeGroups) {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
    });
    const response = await this.client.send(command);

    const users = response.Users.map((user) => formatUser(user));

    // Query groups instead for more efficient requests (one per group instead of one per user;
    // with small number of groups this is more viable).
    if (includeGroups) {
      const userIdGroups = {};
      for (let i = 0; i < GROUPS.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const usersInGroup = await this.getUsersByGroup(GROUPS[i]);
        usersInGroup.forEach((user) => {
          if (Object.prototype.hasOwnProperty.call(userIdGroups, user.id)) {
            userIdGroups.push(GROUPS[i]);
          } else {
            userIdGroups[user.id] = [GROUPS[i]];
          }
        });
      }
      // Map the user.groups to group names they belong to or an empty array if none were assigned
      users.map((user) => ({ ...user, groups: userIdGroups[user.id] || [] }));
    }

    return users;
  }

  async getUser(username, includeGroups) {
    const userCommand = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    let user;
    try {
      user = await this.client.send(userCommand);
      user = formatUser(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return null;
      }
      throw error;
    }

    if (includeGroups) {
      user.groups = await this.getGroupsForUser(username);
    }

    return user;
  }

  async getUsersByGroup(groupName) {
    validateGroupName(groupName);

    const command = new ListUsersInGroupCommand({
      UserPoolId: this.userPoolId,
      GroupName: groupName,
    });

    const result = await this.client.send(command);
    return result.Users ? result.Users.map((user) => formatUser(user)) : [];
  }

  async getGroupsForUser(username) {
    const groupsCommand = new AdminListGroupsForUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    const response = await this.client.send(groupsCommand);

    return response.Groups
      ? response.Groups.map((group) => group.GroupName)
      : [];
  }

  async disableUsers(usernames) {
    const disableUserFunction = (username) => {
      const command = new AdminDisableUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      return this.client.send(command);
    };

    await rateLimited(
      usernames,
      COGNITO_DISABLE_USER_QUOTA,
      disableUserFunction
    );
  }

  async enableUsers(usernames) {
    const enableUserFunction = (username) => {
      const command = new AdminEnableUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      return this.client.send(command);
    };

    await rateLimited(usernames, COGNITO_ENABLE_USER_QUOTA, enableUserFunction);
  }
};
