const BaseModel = require('./BaseModel');

module.exports = class Label extends BaseModel {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['stayAssignmentId'],
      properties: {
        stayAssignmentId: { type: 'string' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        additionalDataJson: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    const StayAssignment = require('./StayAssignment');

    return {
      stayAssignment: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: StayAssignment,
        join: {
          from: 'labels.stay_assignment_id',
          to: 'stay_assignments.id',
        },
      },
    };
  }
};
