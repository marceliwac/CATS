const participants = Array.from({ length: 6 }, (_, i) => `P${i + 1}`);
const stays = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const minStaysPerParticipant = 5;

const percentageShared = 0.5;
const percentageUnique = 1 - percentageShared;

const countShared = Math.ceil(percentageShared * minStaysPerParticipant);
const countUnique = Math.floor(percentageUnique * minStaysPerParticipant);

console.log({ countShared, countUnique });

const availableStays = [...stays];

const sharedStays = Array.from({ length: countShared }, () =>
  availableStays.pop()
);

const assigned = participants.map((p) => ({
  participant: p,
  stayAssignments: [
    ...sharedStays,
    ...Array.from({ length: countUnique }, () => availableStays.pop()),
  ],
}));

console.log(assigned);
