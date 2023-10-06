const { lambda, yup } = require('@cats/middleware');
const { PinnedStay } = require('@cats/models');

module.exports.list = lambda(
  {
    group: 'participants',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          stayId: yup.number().integer(),
        })
      ),
    },
  },
  [
    {
      purpose: 'list pinned stays',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        const pinnedStays = await PinnedStay.query().where({
          cognitoId: userId,
        });

        // eslint-disable-next-line no-param-reassign
        shared.body = pinnedStays;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.put = lambda(
  {
    group: 'participants',
    validators: {
      path: yup.object().shape({
        stayId: yup.number().integer(),
      }),
      response: yup.object().shape({
        stayId: yup.number(),
      }),
    },
  },
  [
    {
      purpose: 'get stay assignment',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;
        const { stayId } = event.pathParameters;

        const pinnedStay = await PinnedStay.query().findOne({
          cognitoId: userId,
          stayId,
        });

        // If the object mapping to this stayId and cognitoId exists
        if (pinnedStay) {
          await PinnedStay.query()
            .where({ cognitoId: userId, stayId })
            .hardDelete();
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 204;
          return;

          // If the object mapping to this stayId and cognitoId doesn't exist
        }
        await PinnedStay.query().insertAndFetch({
          cognitoId: userId,
          stayId,
        });
        // eslint-disable-next-line no-param-reassign
        shared.body = { stayId };
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);
