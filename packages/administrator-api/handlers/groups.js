const { lambda, yup } = require('@wls/middleware');
const { Group, StayAssignment } = require('@wls/models');

module.exports.list = lambda(
  {
    group: 'administrators',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          name: yup.string(),
          cognitoIds: yup.array().of(yup.string()),
          stayIds: yup.array().of(yup.number().integer()),
        })
      ),
    },
  },
  [
    {
      purpose: 'list groups',
      async operation({ shared }) {
        let groups = await Group.query();

        groups = groups.map((group) => {
          const newGroup = { ...group };
          newGroup.cognitoIds = JSON.parse(group.cognitoIdsJson);
          newGroup.stayIds = JSON.parse(group.stayIdsJson);
          return newGroup;
        });

        // eslint-disable-next-line no-param-reassign
        shared.body = groups;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.get = lambda(
  {
    group: 'administrators',
    validators: {
      path: yup.object().shape({
        groupId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        includeStayAssignments: yup.bool(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
        stayAssignments: yup.array().of(
          yup.object().shape({
            id: yup.customValidators.guid(),
            stayId: yup.number().integer(),
            cognitoId: yup.string(),
          })
        ),
      }),
    },
  },
  [
    {
      purpose: 'retrieve a group',
      async operation({ event, shared }) {
        const { groupId } = event.pathParameters;

        const group = await Group.query().findById(groupId);

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
        }

        const newGroup = { ...group };
        newGroup.cognitoIds = JSON.parse(group.cognitoIdsJson);
        newGroup.stayIds = JSON.parse(group.stayIdsJson);

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeStayAssignments
        ) {
          const stayAssignments = await StayAssignment.query().where({
            groupId: group.id,
          });
          newGroup.stayAssignments = stayAssignments;
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = newGroup;
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
      body: yup.object().shape({
        name: yup.string().required(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'create group',
      async operation({ event, shared }) {
        const { name } = event.body;

        const newGroup = await Group.query().insertAndFetch({
          name,
          cognitoIdsJson: '[]',
          stayIdsJson: '[]',
        });
        newGroup.cognitoIds = JSON.parse(newGroup.cognitoIdsJson);
        newGroup.stayIds = JSON.parse(newGroup.stayIdsJson);

        // eslint-disable-next-line no-param-reassign
        shared.body = newGroup;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);

module.exports.update = lambda(
  {
    group: 'administrators',
    validators: {
      body: yup.object().shape({
        name: yup.string(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'update group',
      async operation({ event, shared }) {
        const { groupId } = event.pathParameters;

        const group = await Group.query().findById(groupId);

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        group.cognitoIds = JSON.parse(group.cognitoIdsJson);
        group.stayIds = JSON.parse(group.stayIdsJson);

        const currentCognitoIds = group.cognitoIds;
        const currentStayIds = group.stayIds;

        let deleteStayAssignmentCognitoIds = [];
        let deleteStayAssignmentStayIds = [];
        let newStayAssignmentCognitoIds = [];
        let newStayAssignmentStayIds = [];

        if (event.body.cognitoIds) {
          newStayAssignmentCognitoIds = event.body.cognitoIds.filter(
            (id) => !currentCognitoIds.includes(id)
          );
          deleteStayAssignmentCognitoIds = currentCognitoIds.filter(
            (id) => !event.body.cognitoIds.includes(id)
          );
        } else {
          newStayAssignmentCognitoIds = currentCognitoIds;
        }

        if (event.body.stayIds) {
          newStayAssignmentStayIds = event.body.stayIds.filter(
            (id) => !currentStayIds.includes(id)
          );
          deleteStayAssignmentStayIds = currentStayIds.filter(
            (id) => !event.body.stayIds.includes(id)
          );
        } else {
          newStayAssignmentStayIds = currentStayIds;
        }

        if (
          deleteStayAssignmentCognitoIds.length > 0 ||
          deleteStayAssignmentStayIds.length > 0
        ) {
          await StayAssignment.query()
            .where({ groupId: group.id })
            .andWhere((q) =>
              q
                .whereIn('cognitoId', deleteStayAssignmentCognitoIds)
                .orWhereIn('stayId', deleteStayAssignmentStayIds)
            )
            .delete();
        }

        if (
          newStayAssignmentCognitoIds.length > 0 ||
          newStayAssignmentStayIds.length > 0
        ) {
          const desiredStayAssignments = event.body.cognitoIds
            .map((cognitoId) =>
              event.body.stayIds.map((stayId) => ({
                cognitoId,
                stayId,
                groupId,
              }))
            )
            .flat();

          const newStayAssignments = [];

          desiredStayAssignments.forEach((stayAssignment) => {
            if (
              !currentStayIds.includes(stayAssignment.stayId) ||
              !currentCognitoIds.includes(stayAssignment.cognitoId)
            ) {
              newStayAssignments.push(stayAssignment);
            }
          });
          if (newStayAssignments.length > 0) {
            await StayAssignment.query().insert(newStayAssignments);
          }
        }

        const updateObject = {};
        if (event.body.name) {
          updateObject.name = event.body.name;
        }
        if (event.body.cognitoIds) {
          updateObject.cognitoIdsJson = JSON.stringify(event.body.cognitoIds);
        }
        if (event.body.stayIds) {
          updateObject.stayIdsJson = JSON.stringify(event.body.stayIds);
        }
        const updatedGroup = await Group.query().patchAndFetchById(
          groupId,
          updateObject
        );

        updatedGroup.cognitoIds = JSON.parse(updatedGroup.cognitoIdsJson);
        updatedGroup.stayIds = JSON.parse(updatedGroup.stayIdsJson);

        // eslint-disable-next-line no-param-reassign
        shared.body = updatedGroup;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.delete = lambda(
  {
    group: 'administrators',
    validators: {
      path: yup.object().shape({
        groupId: yup.customValidators.guid(),
      }),
    },
  },
  [
    {
      purpose: 'delete group',
      async operation({ event, shared }) {
        const { groupId } = event.pathParameters;

        // check if group exists
        const group = await Group.query().findById(groupId);

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        await Group.query().findById(groupId).delete();

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 204;
      },
    },
  ]
);
