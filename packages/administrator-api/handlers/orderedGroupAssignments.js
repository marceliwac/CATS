const { lambda, yup } = require('@wls/middleware');
const { OrderedGroupAssignment, StayAssignment } = require('@wls/models');
const { Row, RawQuery } = require('@wls/models-mimic');

function getWeightedStays(stays, distinctStayAssignments) {
  const distinctStayAssignmentStayIds = Array.from(
    new Set(
      distinctStayAssignments.map((stayAssignment) => stayAssignment.stayId)
    )
  );
  const distinctStayAssignmentCounts = {};
  distinctStayAssignmentStayIds.forEach((stayId) => {
    distinctStayAssignmentCounts[stayId] = distinctStayAssignments.filter(
      (stayAssignment) => stayAssignment.stayId === stayId
    ).length;
  });
  return stays.map((stay) => ({
    ...stay,
    count: distinctStayAssignmentCounts[stay.stayId] || 0,
  }));
}

function shuffleArray(array) {
  const shuffled = array.slice();
  let currentIndex = shuffled.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

function alternateBetweenArrays(arrays) {
  const max = Math.max(...arrays.map((array) => array.length));
  let currentArray;
  let currentIndex;
  const result = [];
  for (let i = 0; i < max * arrays.length; i += 1) {
    currentIndex = Math.floor(i / arrays.length);
    currentArray = arrays[i % arrays.length];
    if (currentIndex < currentArray.length) {
      result.push(currentArray[currentIndex]);
    }
  }
  return result;
}

async function getStayIdsToChooseFrom(totalNumberNeeded) {
  const mimicKnex = Row.knex();
  const stays = await RawQuery.stays(mimicKnex);
  const distinctStayAssignments = await StayAssignment.query()
    .distinct('stayId', 'cognitoId')
    .select('stayId', 'cognitoId');
  const weightedStays = getWeightedStays(stays, distinctStayAssignments)
    .sort((a, b) => {
      if (a.count < b.count) {
        return -1;
      }
      if (a.count > b.count) {
        return 1;
      }
      return 0;
    })
    .map((stay) => stay.stayId)
    .slice(0, totalNumberNeeded);
  return shuffleArray(weightedStays);
}

module.exports.list = lambda(
  {
    group: 'administrators',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          name: yup.string(),
          addUsersByDefault: yup.bool(),
          individualStayCount: yup.number().integer(),
          sharedStayCount: yup.number().integer(),
          cognitoIds: yup.array().of(yup.string()),
          sharedStayIds: yup.array().of(yup.number().integer()),
        })
      ),
    },
  },
  [
    {
      purpose: 'list ordered group assignments',
      async operation({ shared }) {
        const groupAssignments = await OrderedGroupAssignment.query();

        const parsedGroupAssignments = groupAssignments.map(
          (groupAssignment) => {
            const parsedGroupAssignment = { ...groupAssignment };
            parsedGroupAssignment.cognitoIds = JSON.parse(
              groupAssignment.cognitoIdsJson
            );
            parsedGroupAssignment.sharedStayIds = JSON.parse(
              groupAssignment.sharedStayIdsJson
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
        orderedGroupAssignmentId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        includeStayAssignments: yup.bool(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        individualStayCount: yup.number().integer(),
        sharedStayCount: yup.number().integer(),
        cognitoIds: yup.array().of(yup.string()),
        sharedStayIds: yup.array().of(yup.number().integer()),
        stayAssignments: yup.array().of(
          yup.object().shape({
            id: yup.customValidators.guid(),
            stayId: yup.number().integer(),
            cognitoId: yup.string(),
            order: yup.number().integer(),
          })
        ),
      }),
    },
  },
  [
    {
      purpose: 'retrieve ordered group assignment',
      async operation({ event, shared }) {
        const { orderedGroupAssignmentId } = event.pathParameters;

        const orderedGroupAssignmentQuery =
          OrderedGroupAssignment.query().findById(orderedGroupAssignmentId);

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeStayAssignments
        ) {
          orderedGroupAssignmentQuery.withGraphFetched('stayAssignments');
        }

        const orderedGroupAssignment = await orderedGroupAssignmentQuery;

        if (!orderedGroupAssignment) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }
        const parsedOrderedGroupAssignment = { ...orderedGroupAssignment };
        parsedOrderedGroupAssignment.cognitoIds = JSON.parse(
          orderedGroupAssignment.cognitoIdsJson
        );
        parsedOrderedGroupAssignment.sharedStayIds = JSON.parse(
          orderedGroupAssignment.sharedStayIdsJson
        );

        // eslint-disable-next-line no-param-reassign
        shared.body = parsedOrderedGroupAssignment;
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
        individualStayCount: yup.number().integer().required(),
        sharedStayCount: yup.number().integer().required(),
        cognitoIds: yup.array().of(yup.string()).required(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        individualStayCount: yup.number().integer(),
        sharedStayCount: yup.number().integer(),
        cognitoIds: yup.array().of(yup.string()),
        sharedStayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'create ordered group assignment',
      async operation({ event, shared }) {
        const {
          name,
          addUsersByDefault,
          cognitoIds,
          individualStayCount,
          sharedStayCount,
        } = event.body;

        const requiredNumberOfStays =
          sharedStayCount + individualStayCount * cognitoIds.length;
        const stayIdsToChooseFrom = await getStayIdsToChooseFrom(
          requiredNumberOfStays
        );
        const sharedStayIds = stayIdsToChooseFrom.slice(0, sharedStayCount);
        const stayAssignmentsToCreate = cognitoIds
          .map((cognitoId, index) => {
            const startIndex = sharedStayCount + index * individualStayCount;
            const stayIds = alternateBetweenArrays([
              stayIdsToChooseFrom.slice(
                startIndex,
                startIndex + individualStayCount
              ),
              sharedStayIds,
            ]);
            return stayIds.map((stayId, stayIdIndex) => ({
              stayId,
              cognitoId,
              order: stayIdIndex,
            }));
          })
          .flat();

        const newOrderedGroupAssigment =
          await OrderedGroupAssignment.query().insertGraphAndFetch({
            name,
            addUsersByDefault,
            individualStayCount,
            sharedStayCount,
            cognitoIdsJson: JSON.stringify(cognitoIds),
            sharedStayIdsJson: JSON.stringify(sharedStayIds),
            stayAssignments: stayAssignmentsToCreate,
          });

        newOrderedGroupAssigment.cognitoIds = JSON.parse(
          newOrderedGroupAssigment.cognitoIdsJson
        );
        newOrderedGroupAssigment.sharedStayIds = JSON.parse(
          newOrderedGroupAssigment.sharedStayIdsJson
        );

        // eslint-disable-next-line no-param-reassign
        shared.body = newOrderedGroupAssigment;
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
        orderedGroupAssignmentId: yup.customValidators.guid(),
      }),
      body: yup.object().shape({
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        cognitoIds: yup.array().of(yup.string()),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        addUsersByDefault: yup.bool(),
        individualStayCount: yup.number().integer(),
        sharedStayCount: yup.number().integer(),
        cognitoIds: yup.array().of(yup.string()),
        sharedStayIds: yup.array().of(yup.number().integer()),
      }),
    },
  },
  [
    {
      purpose: 'update ordered group assignment',
      async operation({ event, shared }) {
        const { orderedGroupAssignmentId } = event.pathParameters;

        const group = await OrderedGroupAssignment.query().findById(
          orderedGroupAssignmentId
        );

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        const currentCognitoIds = JSON.parse(group.cognitoIdsJson);
        const currentSharedStayIds = JSON.parse(group.sharedStayIdsJson);

        let deleteStayAssignmentCognitoIds = [];
        let newStayAssignmentCognitoIds = [];

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

        if (deleteStayAssignmentCognitoIds.length > 0) {
          await StayAssignment.query()
            .where({ orderedGroupAssignmentId: group.id })
            .andWhere((q) =>
              q.whereIn('cognitoId', deleteStayAssignmentCognitoIds)
            )
            .delete();
        }

        // Create stay assignments for new cognito ids

        if (newStayAssignmentCognitoIds.length > 0) {
          const stayCountNeeded =
            newStayAssignmentCognitoIds.length * group.individualStayCount;
          const stayIdsToChooseFrom = await getStayIdsToChooseFrom(
            stayCountNeeded
          );

          const newStayAssignments = [];

          newStayAssignmentCognitoIds.forEach((cognitoId, index) => {
            const stayIds = alternateBetweenArrays([
              stayIdsToChooseFrom.slice(
                index * group.individualStayCount,
                (index + 1) * group.individualStayCount
              ),
              currentSharedStayIds,
            ]);
            newStayAssignments.push(
              ...stayIds.map((stayId, stayIdIndex) => ({
                stayId,
                cognitoId,
                orderedGroupAssignmentId,
                order: stayIdIndex,
              }))
            );
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
        const updatedGroup =
          await OrderedGroupAssignment.query().patchAndFetchById(
            orderedGroupAssignmentId,
            updateObject
          );

        updatedGroup.cognitoIds = JSON.parse(updatedGroup.cognitoIdsJson);
        updatedGroup.sharedStayIds = JSON.parse(updatedGroup.sharedStayIdsJson);

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
        orderedGroupAssignmentId: yup.customValidators.guid(),
      }),
    },
  },
  [
    {
      purpose: 'delete ordered group assignment',
      async operation({ event, shared }) {
        const { orderedGroupAssignmentId } = event.pathParameters;

        // check if group exists
        const group = await OrderedGroupAssignment.query().findById(
          orderedGroupAssignmentId
        );

        if (!group) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        await StayAssignment.transaction(async (trx) => {
          await StayAssignment.query(trx)
            .where({ orderedGroupAssignmentId })
            .delete();
          await OrderedGroupAssignment.query(trx)
            .findById(orderedGroupAssignmentId)
            .delete();
        });

        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 204;
      },
    },
  ]
);
