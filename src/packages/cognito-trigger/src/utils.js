const log = require('@cats/log');
const {
  destroyConnection,
  bindDatabase,
  OrderedGroupAssignment,
  GroupAssignment,
  StayAssignment,
} = require('@cats/models');
const {
  destroyConnection: destroyMimicConnection,
  bindDatabase: bindMimicDatabase,
  Row,
  RawQuery,
} = require('@cats/models-mimic');

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

function getStayAssignmentsForOrderedGroupAssignment(
  orderedGroupAssignment,
  individualStayIds,
  cognitoId
) {
  const sharedStayIds = JSON.parse(orderedGroupAssignment.sharedStayIdsJson);
  return alternateBetweenArrays([individualStayIds, sharedStayIds]).map(
    (stayId, stayIdIndex) => ({
      stayId,
      cognitoId,
      orderedGroupAssignmentId: orderedGroupAssignment.id,
      order: stayIdIndex,
    })
  );
}

function getStayAssignmentsForGroupAssignment(groupAssignment, cognitoId) {
  const stayIds = JSON.parse(groupAssignment.stayIdsJson);
  return stayIds.map((stayId, stayIdIndex) => ({
    stayId,
    cognitoId,
    groupAssignmentId: groupAssignment.id,
    order: stayIdIndex,
  }));
}

async function getGroupAssignmentsToAddTo(cognitoId) {
  const orderedGroupAssignments = await OrderedGroupAssignment.query().where({
    addUsersByDefault: true,
  });
  const filteredOrderedGroupAssignments = orderedGroupAssignments.filter(
    (orderedGroupAssignment) =>
      !JSON.parse(orderedGroupAssignment.cognitoIdsJson).includes(cognitoId)
  );

  const groupAssignments = await GroupAssignment.query().where({
    addUsersByDefault: true,
  });
  const filteredGroupAssignments = groupAssignments.filter(
    (groupAssignment) =>
      !JSON.parse(groupAssignment.cognitoIdsJson).includes(cognitoId)
  );
  return {
    orderedGroupAssignments: filteredOrderedGroupAssignments,
    groupAssignments: filteredGroupAssignments,
  };
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

async function createNeededResources(cognitoId) {
  await Promise.all([bindDatabase(), bindMimicDatabase()]);

  const { orderedGroupAssignments, groupAssignments } =
    await getGroupAssignmentsToAddTo(cognitoId);
  const totalNumberNeeded = orderedGroupAssignments.reduce(
    (acc, curr) => acc + curr.individualStayCount,
    0
  );
  let stayIdsToChooseFrom = await getStayIdsToChooseFrom(totalNumberNeeded);
  const stayAssignmentsToCreate = [];
  const promises = [];
  log.debug({
    orderedGroupAssignments,
    groupAssignments,
    stayIdsToChooseFrom,
    totalNumberNeeded,
  });

  if (orderedGroupAssignments.length > 0) {
    orderedGroupAssignments.forEach((orderedGroupAssignment) => {
      // Update ordered group assignment
      promises.push(
        OrderedGroupAssignment.query()
          .findById(orderedGroupAssignment.id)
          .patch({
            cognitoIdsJson: JSON.stringify([
              ...JSON.parse(orderedGroupAssignment.cognitoIdsJson),
              cognitoId,
            ]),
          })
      );

      // Create stay assignments
      const individualStayIds = stayIdsToChooseFrom.slice(
        0,
        orderedGroupAssignment.individualStayCount
      );

      stayIdsToChooseFrom = stayIdsToChooseFrom.slice(
        orderedGroupAssignment.individualStayCount,
        stayIdsToChooseFrom.length
      );
      log.debug({ individualStayIds, stayIdsToChooseFrom });

      stayAssignmentsToCreate.push(
        ...getStayAssignmentsForOrderedGroupAssignment(
          orderedGroupAssignment,
          individualStayIds,
          cognitoId
        )
      );
    });
  }

  if (groupAssignments.length > 0) {
    groupAssignments.forEach((groupAssignment) => {
      // Update group assignment
      promises.push(
        GroupAssignment.query()
          .findById(groupAssignment.id)
          .patch({
            cognitoIdsJson: JSON.stringify([
              ...JSON.parse(groupAssignment.cognitoIdsJson),
              cognitoId,
            ]),
          })
      );

      // Create stay assignments
      stayAssignmentsToCreate.push(
        ...getStayAssignmentsForGroupAssignment(groupAssignment, cognitoId)
      );
    });
  }
  log.debug({ stayAssignmentsToCreate });

  if (stayAssignmentsToCreate.length > 0) {
    log.debug(
      `Creating ${stayAssignmentsToCreate.length} stay assignments for the user ${cognitoId}.`
    );
    log.debug(stayAssignmentsToCreate);
    promises.push(StayAssignment.query().insert(stayAssignmentsToCreate));
  }
  if (promises.length > 0) {
    await Promise.all(promises);
  }
  await Promise.all([destroyConnection(), destroyMimicConnection()]);
}

module.exports = { createNeededResources };
