const { lambda, yup } = require('@cats/middleware');
const { StayAssignment } = require('@cats/models');
const { Row, RawQuery } = require('@cats/models-mimic');

module.exports.list = lambda(
  {
    group: 'participants',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          stayId: yup.number().integer(),
          order: yup.number().integer(),
          isLabelled: yup.bool(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list stay assignments',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        const stayAssignments = await StayAssignment.query().where({
          cognitoId: userId,
        });

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
            additionalData: yup.object().shape({
              confidence: yup.number(),
              parameters: yup.array().of(
                yup.object().shape({
                  name: yup.string(),
                  label: yup.string(),
                  value: yup.string(),
                })
              ),
            }),
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
        parameters: yup.array().of(
          yup.object().shape({
            key: yup.string(),
            label: yup.string(),
          })
        ),
      }),
    },
  },
  [
    {
      purpose: 'get stay assignment',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        const stayAssignmentQuery = StayAssignment.query().findOne({
          id: event.pathParameters.stayAssignmentId,
          cognitoId: userId,
        });

        const knex = Row.knex();

        if (event.queryStringParameters) {
          if (event.queryStringParameters.includeLabels) {
            stayAssignmentQuery.withGraphFetched('labels');
          }
        }

        const stayAssignment = await stayAssignmentQuery;

        if (!stayAssignment) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        if (stayAssignment.labels) {
          stayAssignment.labels = stayAssignment.labels.map((label) => ({
            ...label,
            additionalData: label.additionalDataJson
              ? JSON.parse(label.additionalDataJson)
              : null,
          }));
        }

        if (event.queryStringParameters) {
          if (event.queryStringParameters.includeStayDetails) {
            const details = await RawQuery.stayDetails(
              knex,
              stayAssignment.stayId
            );
            if (details) {
              stayAssignment.details = details;
            }
          }
          if (event.queryStringParameters.includeStayData) {
            const data = await RawQuery.stayDataV3(knex, stayAssignment.stayId);
            if (data) {
              stayAssignment.data = data;
            }
            stayAssignment.parameters = Row.PARAMETERS;
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
