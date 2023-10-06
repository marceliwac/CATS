const BaseModel = require('./BaseModel');

module.exports = class RulesetLabel extends BaseModel {
  static get tableName() {
    return 'ruleset_labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['stayId', 'rulesetId', 'startTime', 'endTime'],
      properties: {
        stayId: { type: 'integer' },
        rulesetId: { type: 'string', format: 'uuid' },
        startTime: { type: 'string', format: 'date-time' },
        endTime: { type: 'string', format: 'date-time' },
        metadataJson: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    const Ruleset = require('./Ruleset');

    return {
      ruleset: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Ruleset,
        join: {
          from: 'ruleset_labels.ruleset_id',
          to: 'rulesets.id',
        },
      },
    };
  }
};
