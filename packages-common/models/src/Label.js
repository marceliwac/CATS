const BaseModel = require('./BaseModel');

module.exports = class Label extends BaseModel {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cognitoId', 'stayId'],
      properties: {
        cognitoId: { type: 'string' },
        stayId: { type: 'integer' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        additionalDataJson: { type: 'string' },
      },
    };
  }

  static get relationMapping() {
    const StayAssignment = require('./StayAssignment');

    return {
      stayAssignment: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: StayAssignment,
        join: {
          from: ['labels.cognito_id', 'labels.stay_id'],
          to: ['stay_assignments.cognito_id', 'stay_assignments.stay_id'],
        },
      },
    };
  }
};
