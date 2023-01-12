const { lambda, yup } = require('@wls/middleware');
const { StayAssignment } = require('@wls/models');

module.exports.list = lambda(
  {
    group: 'administrators',
    validators: {
      query: yup.object().shape({
        includeLabelCount: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          stayId: yup.number().integer(),
          cognitoId: yup.string(),
          order: yup.number().integer(),
          isLabelled: yup.bool(),
          labelCount: yup.number().integer(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list stay assignments',
      async operation({ event, shared }) {
        const stayAssignmentsQuery = StayAssignment.query();

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeLabelCount
        ) {
          stayAssignmentsQuery.withGraphFetched('labels');
        }

        let stayAssignments = await stayAssignmentsQuery;

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeLabelCount
        ) {
          stayAssignments = stayAssignments.map((stayAssignment) => ({
            ...stayAssignment,
            labelCount: stayAssignment.labels.length,
          }));
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = stayAssignments;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.listForUser = lambda(
  {
    group: 'administrators',
    validators: {
      path: yup.object().shape({
        userId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        includeLabelCount: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          stayId: yup.number().integer(),
          order: yup.number().integer(),
          isLabelled: yup.bool(),
          labelCount: yup.number().integer(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list stay assignments for user',
      async operation({ event, shared }) {
        const cognitoId = event.pathParameters.userId;
        const stayAssignmentsQuery = StayAssignment.query().where({
          cognitoId,
        });

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeLabelCount
        ) {
          stayAssignmentsQuery.withGraphFetched('labels');
        }

        let stayAssignments = await stayAssignmentsQuery;

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeLabelCount
        ) {
          stayAssignments = stayAssignments.map((stayAssignment) => ({
            ...stayAssignment,
            labelCount: stayAssignment.labels.length,
          }));
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = stayAssignments;
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
        cognitoId: yup.string().required(),
        stayIds: yup.array().of(yup.number().integer()).required(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          stayId: yup.number().integer(),
          isLabelled: yup.bool(),
        })
      ),
    },
  },
  [
    {
      purpose: 'assign stays',
      async operation({ event, shared }) {
        const { cognitoId, stayIds } = event.body;

        const stayAssignmentIds = (
          await StayAssignment.query().where({ cognitoId }).select('stayId')
        ).map((row) => row.stayId);

        if (stayIds.some((stayId) => stayAssignmentIds.includes(stayId))) {
          // eslint-disable-next-line no-param-reassign
          shared.body = {
            message:
              'Assigning selected stay IDs would result in duplicated stay assignments for this user.',
          };
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 409;
          return;
        }

        const stayAssignments = await StayAssignment.query().insertAndFetch(
          stayIds.map((stayId) => ({
            cognitoId,
            stayId,
          }))
        );

        // eslint-disable-next-line no-param-reassign
        shared.body = stayAssignments;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);

module.exports.delete = lambda(
  {
    group: 'administrators',
    validators: {
      body: yup.object().shape({
        stayAssignmentIds: yup
          .array()
          .of(yup.customValidators.guid())
          .required(),
      }),
    },
  },
  [
    {
      purpose: 'unassignasd stays',
      async operation({ event, shared }) {
        const { stayAssignmentIds } = event.body;

        await StayAssignment.query().findByIds(stayAssignmentIds).delete();

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);
