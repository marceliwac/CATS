const BaseModel = require('./BaseModel');

module.exports = class GroupAssignment extends BaseModel {
  static get tableName() {
    return 'group_assignments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'cognitoIdsJson', 'stayIdsJson'],
      properties: {
        name: { type: 'string' },
        cognitoIdsJson: { type: 'string' },
        stayIdsJson: { type: 'string' },
        addUsersByDefault: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    const StayAssignment = require('./StayAssignment');

    return {
      stayAssignments: {
        relation: BaseModel.HasManyRelation,
        modelClass: StayAssignment,
        join: {
          from: 'group_assignments.id',
          to: 'stay_assignments.group_assignment_id',
        },
      },
    };
  }
};
