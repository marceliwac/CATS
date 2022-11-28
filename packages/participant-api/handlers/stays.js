const { lambda, yup } = require('@wls/middleware');
const { StayAssignment, Label } = require('@wls/models');
const { Row, RawQuery } = require('@wls/models-mimic');

module.exports.list = lambda(
  {
    group: 'participants',
    validators: {
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
      purpose: 'list assigned stays',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        const stayAssignments = await StayAssignment.query().where({
          cognitoId: userId,
        });
        console.log(stayAssignments);

        // eslint-disable-next-line no-param-reassign
        shared.body = stayAssignments;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.get = lambda(
  {
    group: 'participants',
    validators: {
      path: yup.object().shape({
        stayAssignmentId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        includeLabels: yup.bool(),
        includeStayDetails: yup.bool(),
        includeStayData: yup.bool(),
      }),
      response: yup.object().shape({
        id: yup.string(),
        isLabelled: yup.bool(),
        stayId: yup.number(),
        labels: yup.array().of(
          yup.object().shape({
            id: yup.customValidators.guid(),
            startTime: yup.date(),
            endTime: yup.date(),
            additionalData: yup.object().nullable(true),
          })
        ),
        details: yup.object().shape({
          age: yup.number(),
          race: yup.string(),
          gender: yup.string(),
          admissionTime: yup.date(),
          dischargeTime: yup.date(),
          deathTime: yup.date().nullable(true),
          lengthOfStayHospital: yup.number(),
          lengthOfStayIcu: yup.number(),
          seqHospital: yup.number().integer(),
          seqIcu: yup.number().integer(),
        }),
        data: yup.array(),
      }),
    },
  },
  [
    {
      purpose: 'get assigned stay',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        const stayAssignment = await StayAssignment.query().findById(
          event.pathParameters.stayAssignmentId
        );
        const knex = Row.knex();

        const { stayId } = stayAssignment;

        if (event.queryStringParameters) {
          if (event.queryStringParameters.includeLabels) {
            const labels = await Label.query().where({
              stayId,
              cognitoId: userId,
            });
            if (labels) {
              stayAssignment.labels = labels.map((label) => ({
                ...label,
                additionalData: label.additionalDataJson
                  ? JSON.parse(label.additionalDataJson)
                  : null,
              }));
            }
          }
          if (event.queryStringParameters.includeStayDetails) {
            const details = await RawQuery.stayDetails(knex, stayId);
            console.log({ details });
            if (details) {
              stayAssignment.details = details;
            }
          }
          if (event.queryStringParameters.includeStayData) {
            const data = await RawQuery.stayData(knex, stayId);
            console.log({ data });
            if (data) {
              stayAssignment.data = data;
            }
          }
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = stayAssignment;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);
