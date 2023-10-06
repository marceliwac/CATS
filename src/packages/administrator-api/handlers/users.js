const { lambda, yup } = require('@cats/middleware');
const { StayAssignment } = require('@cats/models');
const { UserService } = require('@cats/user-service');

module.exports.listAdministrators = lambda(
  {
    group: 'administrators',
    validators: {
      query: yup.object().shape({
        includeLabelCount: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          givenName: yup.string(),
          familyName: yup.string(),
          email: yup.string(),
          isEmailVerified: yup.bool(),
          status: yup.string(),
          isEnabled: yup.bool(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list users in group administrators',
      async operation({ shared }) {
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });

        // eslint-disable-next-line no-param-reassign
        shared.body = await userService.getUsersByGroup('administrators');

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.listParticipants = lambda(
  {
    group: 'administrators',
    validators: {
      query: yup.object().shape({
        includeStayAssignmentCount: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          givenName: yup.string(),
          familyName: yup.string(),
          email: yup.string(),
          stayAssignmentCount: yup.number().integer(),
          labelledStayCount: yup.number().integer(),
          status: yup.string(),
          isEnabled: yup.bool(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list users in group participants',
      async operation({ event, shared }) {
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });
        let users = await userService.getUsersByGroup('participants');

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeStayAssignmentCount
        ) {
          const stayAssignments = await StayAssignment.query().whereIn(
            'cognitoId',
            users.map((user) => user.id)
          );
          users = users.map((user) => {
            const matchingStayAssignments = stayAssignments.filter(
              (stayAssignment) => stayAssignment.cognitoId === user.id
            );

            return {
              ...user,
              stayAssignmentCount: matchingStayAssignments.length,
              labelledStayCount: matchingStayAssignments.filter(
                (stayAssignment) => stayAssignment.isLabelled
              ).length,
            };
          });
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = users;

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.getParticipant = lambda(
  {
    group: 'administrators',
    validators: {
      query: yup.object().shape({}),
      response: yup.object().shape({
        user: yup.object().shape({
          id: yup.customValidators.guid(),
          givenName: yup.string(),
          familyName: yup.string(),
          email: yup.string(),
          stayAssignmentCount: yup.number().integer(),
          labelledStayCount: yup.number().integer(),
          status: yup.string(),
          isEnabled: yup.bool(),
        }),
        stayAssignments: yup.array().of(
          yup.object().shape({
            stayId: yup.number().integer(),
            isLabelled: yup.bool(),
          })
        ),
      }),
    },
  },
  [
    {
      purpose: 'list users in group participants',
      async operation({ event, shared }) {
        const { userId } = event.pathParameters;
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });
        const user = await userService.getUser(userId);

        const stayAssignments = await StayAssignment.query().where({
          cognitoId: userId,
        });

        // eslint-disable-next-line no-param-reassign
        shared.body = { user, stayAssignments };

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.post = lambda(
  {
    group: 'administrators',
    validators: {
      body: yup
        .object()
        .noUnknown()
        .shape({
          userEmail: yup.string().required(),
          firstName: yup.string().required(),
          lastName: yup.string().required(),
          group: yup
            .string()
            .oneOf(['administrators', 'participants'])
            .required(),
        }),
    },
  },
  [
    {
      purpose: 'create user',
      async operation({ event, shared }) {
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });

        let user = await userService.getUserByEmailIfExists(
          event.body.userEmail,
          true
        );

        if (user) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 409;
          // eslint-disable-next-line no-param-reassign
          shared.body = {
            message: `User with specified email address is already present in the application.`,
          };
          return;
        }

        const userAttributes = {
          given_name: event.body.firstName,
          family_name: event.body.lastName,
        };
        user = await userService.createUser(
          event.body.userEmail,
          userAttributes,
          event.body.group
        );

        // eslint-disable-next-line no-param-reassign
        shared.body = user;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);

module.exports.batchUpdateUsers = lambda(
  {
    group: 'administrators',
    validators: {
      body: yup
        .object()
        .noUnknown()
        .shape({
          userIds: yup.array().of(yup.string()).required(),
          operation: yup.string().oneOf(['enable', 'disable']).required(),
        }),
    },
  },
  [
    {
      purpose: 'batch-update users',
      async operation({ event, shared }) {
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });

        if (event.body.operation === 'enable') {
          await userService.enableUsers(event.body.userIds);
        } else if (event.body.operation === 'disable') {
          await userService.disableUsers(event.body.userIds);
        }

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 204;
      },
    },
  ]
);
