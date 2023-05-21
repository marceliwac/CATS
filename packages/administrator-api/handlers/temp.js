const { lambda } = require('@wls/middleware');
const { StayAssignment } = require('@wls/models');
const { UserService } = require('@wls/user-service');

module.exports.temp = lambda(
  {
    validators: {},
  },
  [
    {
      purpose: 'temp',
      async operation({ shared }) {
        const userService = new UserService({
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          region: process.env.REGION,
        });

        const participants = await userService.getUsersByGroup('participants');

        const stayAssignments = await StayAssignment.query()
          .where({
            isLabelled: true,
          })
          .withGraphFetched('labels');

        // eslint-disable-next-line no-param-reassign
        shared.body = {
          participants,
          stayAssignments,
        };
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);
