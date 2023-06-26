const BaseModel = require('./BaseModel');

const STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

const FINISHED_STATUSES = [STATUS.COMPLETED, STATUS.FAILED];

const RULESET_NODE_TYPE = {
  RULE: 'RULE',
  RELATION: 'RELATION',
};

const RULE_OPERATIONS = [
  '>',
  '<',
  '=',
  '!=',
  'inc',
  'increm',
  'rem',
  'decrem',
  'dec',
];
const RELATION_OPERATIONS = ['AND', 'OR'];

class Ruleset extends BaseModel {
  static get tableName() {
    return 'rulesets';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cognitoId', 'name', 'rulesetJson', 'parsedRulesetJson'],
      properties: {
        cognitoId: { type: 'string' },
        name: { type: 'string' },
        rulesetJson: { type: 'string' },
        parsedExecutionJson: { type: 'string' },
        executionArn: { type: ['string', 'null'] },
        status: { type: 'string', enum: Object.values(STATUS) },
        statisticsJson: { type: ['string', 'null'] },
        isShared: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    const RulesetLabel = require('./RulesetLabel');

    return {
      labels: {
        relation: BaseModel.HasManyRelation,
        modelClass: RulesetLabel,
        join: {
          from: 'rulesets.id',
          to: 'ruleset_labels.ruleset_id',
        },
      },
    };
  }
}

Ruleset.STATUS = STATUS;
Ruleset.FINISHED_STATUSES = FINISHED_STATUSES;
Ruleset.RULE_OPERATIONS = RULE_OPERATIONS;
Ruleset.RELATION_OPERATIONS = RELATION_OPERATIONS;
Ruleset.RULESET_NODE_TYPE = RULESET_NODE_TYPE;

module.exports = Ruleset;
