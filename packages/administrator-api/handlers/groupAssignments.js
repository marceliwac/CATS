const { lambda, yup } = require('@wls/middleware');
const { v4: uuid } = require('uuid');
const { GroupAssignment, StayAssignment } = require('@wls/models');

module.exports.list = lambda(
  {
    group: 'administrators',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          name: yup.string(),
          addUsersByDefault: yup.bool(),
          cognitoIds: yup.array().of(yup.string()),
          stayIds: yup.array().of(yup.number().integer()),
        })
      ),
    },
  },
  [
    {
      purpose: 'list group assignments',
      async operation({ shared }) {
        const groupAssignments = await GroupAssignment.query();

        const parsedGroupAssignments = groupAssignments.map(
          (groupAssignment) => {
            const parsedGroupAssignment = { ...groupAssignment };
            parsedGroupAssignment.cognitoIds = JSON.parse(
              groupAssignment.cognitoIdsJson
            );
            parsedGroupAssignment.stayIds = JSON.parse(
              groupAssignment.stayIdsJson
            );
            return parsedGroupAssignment;
          }
        );

        // eslint-disable-next-line no-param-reassign
        shared.body = parsedGroupAssignments;
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
        groupAssignmentId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        includeStayAssignments: yup.bool(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
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
      purpose: 'retrieve a group assignment',
      async operation({ event, shared }) {
        const { groupAssignmentId } = event.pathParameters;

        const groupAssignmentQuery =
          GroupAssignment.query().findById(groupAssignmentId);

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeStayAssignments
        ) {
          groupAssignmentQuery.withGraphFetched('stayAssignments');
        }

        const groupAssignment = await groupAssignmentQuery;

        if (!groupAssignment) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        const parsedGroupAssignment = { ...groupAssignment };
        parsedGroupAssignment.cognitoIds = JSON.parse(
          groupAssignment.cognitoIdsJson
        );
        parsedGroupAssignment.stayIds = JSON.parse(groupAssignment.stayIdsJson);

        // eslint-disable-next-line no-param-reassign
        shared.body = parsedGroupAssignment;
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
        addUsersByDefault: yup.bool(),
        cognitoIds: yup.array().of(yup.string()).required(),
        stayIds: yup.array().of(yup.number().integer()).required(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'create group assignment',
      async operation({ event, shared }) {
        const { name, addUsersByDefault } = event.body;

        const groupAssignment =
          await GroupAssignment.query().insertGraphAndFetch({
            name,
            addUsersByDefault,
            cognitoIdsJson: JSON.stringify(event.body.cognitoIds),
            stayIdsJson: JSON.stringify(event.body.stayIds),
            stayAssignments: event.body.cognitoIds
              .map((cognitoId) =>
                event.body.stayIds.map((stayId) => ({
                  cognitoId,
                  stayId,
                }))
              )
              .flat(),
          });

        groupAssignment.cognitoIds = JSON.parse(groupAssignment.cognitoIdsJson);
        groupAssignment.stayIds = JSON.parse(groupAssignment.stayIdsJson);

        // eslint-disable-next-line no-param-reassign
        shared.body = groupAssignment;
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
      path: yup.object().shape({
        groupAssignmentId: yup.customValidators.guid(),
      }),
      body: yup.object().shape({
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        cognitoIds: yup.array().of(yup.string()),
        stayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'update group assignment',
      async operation({ event, shared }) {
        const { groupAssignmentId } = event.pathParameters;

        const group = await GroupAssignment.query().findById(groupAssignmentId);

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
            .where({ groupAssignmentId: group.id })
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
                groupAssignmentId,
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
        if (event.body.addUsersByDefault) {
          updateObject.addUsersByDefault = event.body.addUsersByDefault;
        }
        if (event.body.cognitoIds) {
          updateObject.cognitoIdsJson = JSON.stringify(event.body.cognitoIds);
        }
        if (event.body.stayIds) {
          updateObject.stayIdsJson = JSON.stringify(event.body.stayIds);
        }
        const updatedGroup = await GroupAssignment.query().patchAndFetchById(
          groupAssignmentId,
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
        groupAssignmentId: yup.customValidators.guid(),
      }),
    },
  },
  [
    {
      purpose: 'delete group assignment',
      async operation({ event, shared }) {
        const { groupAssignmentId } = event.pathParameters;

        // check if group exists
        const group = await GroupAssignment.query().findById(groupAssignmentId);

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }
        await StayAssignment.transaction(async (trx) => {
          await StayAssignment.query(trx).where({ groupAssignmentId }).delete();
          await GroupAssignment.query(trx).findById(groupAssignmentId).delete();
        });

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 204;
      },
    },
  ]
);
