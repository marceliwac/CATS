const { lambda, yup } = require('@wls/middleware');
const { StayAssignment, Label } = require('@wls/models');

module.exports.post = lambda(
  {
    group: 'participants',
    validators: {
      path: yup.object().shape({
        stayAssignmentId: yup.customValidators.guid(),
      }),
      body: yup.array().of(
        yup.object().shape({
          startTime: yup.date().required(),
          endTime: yup.date().required(),
          additionalData: yup.object().shape({
            confidence: yup.number(),
          }),
        })
      ),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          startTime: yup.date(),
          endTime: yup.date(),
          additionalData: yup.object().shape({
            confidence: yup.number(),
          }),
        })
      ),
    },
  },
  [
    {
      purpose: 'submit labels',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;
        const { stayAssignmentId } = event.pathParameters;

        const stayAssignment = await StayAssignment.query().findOne({
          id: stayAssignmentId,
          cognitoId: userId,
        });

        if (!stayAssignment) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        const labels = event.body.map((label) => {
          const labelObject = {
            startTime: label.startTime.toISOString(),
            endTime: label.endTime.toISOString(),
            stayAssignmentId,
          };
          if (typeof label.additionalData === 'object') {
            labelObject.additionalDataJson = JSON.stringify(
              label.additionalData
            );
          }
          return labelObject;
        });

        if (stayAssignment.isLabelled) {
          await Label.query().where({ stayAssignmentId }).delete();
        } else {
          await StayAssignment.query()
            .findById(stayAssignmentId)
            .patch({ isLabelled: true });
        }

        await Label.query().insert(labels);

        const labelsToReturn = (
          await Label.query().where({ stayAssignmentId })
        ).map((label) => {
          const labelObject = { ...label };
          if (label.additionalDataJson) {
            labelObject.additionalData = JSON.parse(label.additionalDataJson);
          }
          return labelObject;
        });

        // eslint-disable-next-line no-param-reassign
        shared.body = labelsToReturn;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);
