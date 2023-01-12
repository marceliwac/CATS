const BaseModel = require('./BaseModel');

module.exports = class StayAssignment extends BaseModel {
  static get tableName() {
    return 'stay_assignments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cognitoId', 'stayId'],
      properties: {
        cognitoId: { type: 'string' },
        stayId: { type: 'integer' },
        isLabelled: { type: 'boolean' },
        groupAssignmentId: { type: 'string', format: 'uuid' },
        orderedGroupAssignmentId: { type: 'string', format: 'uuid' },
      },
    };
  }

  static get relationMappings() {
    const Label = require('./Label');
    const GroupAssignment = require('./GroupAssignment');
    const OrderedGroupAssignment = require('./OrderedGroupAssignment');

    return {
      labels: {
        relation: BaseModel.HasManyRelation,
        modelClass: Label,
        join: {
          from: 'stay_assignments.id',
          to: 'labels.stay_assignment_id',
        },
      },
      groupAssignment: {
        relation: BaseModel.HasManyRelation,
        modelClass: GroupAssignment,
        join: {
          from: 'stay_assignments.group_assignment_id',
          to: 'group_assignments.id',
        },
      },
      orderedGroupAssignment: {
        relation: BaseModel.HasManyRelation,
        modelClass: OrderedGroupAssignment,
        join: {
          from: 'stay_assignments.ordered_group_assignment_id',
          to: 'ordered_group_assignments.id',
        },
      },
    };
  }
};
