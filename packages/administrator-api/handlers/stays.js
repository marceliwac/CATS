const { lambda, yup } = require('@wls/middleware');
const { StayAssignment } = require('@wls/models');
const { Row, RawQuery } = require('@wls/models-mimic');

module.exports.list = lambda(
  {
    group: 'administrators',
    validators: {
      query: yup.object().shape({
        includeAssignmentCount: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          stayId: yup.number().integer(),
          assignmentCount: yup.number().integer(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list stays',
      async operation({ event, shared }) {
        const knex = Row.knex();
        let stays = await RawQuery.stays(knex);

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeAssignmentCount
        ) {
          const stayAssignments = await StayAssignment.query().distinct(
            'stayId',
            'cognitoId'
          );

          const stayAssignmentCountDict = {};
          stayAssignments.forEach((stayAssignment) => {
            if (
              typeof stayAssignmentCountDict[stayAssignment.stayId] === 'number'
            ) {
              stayAssignmentCountDict[stayAssignment.stayId] += 1;
            } else {
              stayAssignmentCountDict[stayAssignment.stayId] = 1;
            }
          });

          stays = stays.map((stay) => ({
            ...stay,
            assignmentCount: stayAssignmentCountDict[stay.stayId] || 0,
          }));
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = stays;

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);
