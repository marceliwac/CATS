const BaseModel = require('./BaseModel');

module.exports = class OrderedGroupAssignment extends BaseModel {
  static get tableName() {
    return 'ordered_group_assignments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'name',
        'individualStayCount',
        'sharedStayCount',
        'cognitoIdsJson',
      ],
      properties: {
        name: { type: 'string' },
        individualStayCount: { type: 'number' },
        sharedStayCount: { type: 'number' },
        cognitoIdsJson: { type: 'string' },
        sharedStayIdsJson: { type: 'string' },
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
          from: 'ordered_group_assignments.id',
          to: 'stay_assignments.ordered_group_assignment_id',
        },
      },
    };
  }
};
