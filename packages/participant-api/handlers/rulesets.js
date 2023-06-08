const { lambda, yup } = require('@wls/middleware');
const { Ruleset } = require('@wls/models');
const RulesetProcessorService = require('@wls/ruleset-processor-service');
const { RawQuery, Row } = require('@wls/models-mimic');

const RulesetNodeModel = yup.object().shape({
  attributes: yup.object().shape({
    id: yup.string().required(),
    nodeType: yup.mixed().oneOf(Object.values(Ruleset.RULESET_NODE_TYPE)),
    operation: yup
      .string()
      .required()
      .when('nodeType', {
        is: Ruleset.RULESET_NODE_TYPE.RULE,
        then: (schema) => schema.oneOf(Ruleset.RULE_OPERATIONS),
      })
      .when('nodeType', {
        is: Ruleset.RULESET_NODE_TYPE.RELATION,
        then: (schema) => schema.oneOf(Ruleset.RELATION_OPERATIONS),
      }),
    parameter: yup.string().when('nodeType', {
      is: Ruleset.RULESET_NODE_TYPE.RULE,
      then: (schema) => schema.required(),
    }),
    value: yup.string().when('nodeType', {
      is: Ruleset.RULESET_NODE_TYPE.RULE,
      then: (schema) => schema.nullable(true).required(),
    }),
  }),
  children: yup
    .array()
    .when('nodeType', {
      is: Ruleset.RULESET_NODE_TYPE.RELATION,
      then: (schema) => schema.oneOf(RulesetNodeModel).required(),
    })
    .optional(true)
    .nullable(true),
});

const RulesetModel = RulesetNodeModel;

const ParsedRulesetRule = yup.object().shape({
  id: yup.string().required(),
  operation: yup.string().oneOf(Ruleset.RULE_OPERATIONS),
  parameter: yup.string().required(),
  value: yup.lazy((value) => {
    if (typeof value === 'string') {
      return yup.string().nullable(true).required();
    }
    if (value === null) {
      return yup.mixed().nullable(true);
    }
    return yup.number().required();
  }),
});

const ParsedRulesetRelation = yup.object().shape({
  id: yup.string().required(),
  operation: yup.mixed().oneOf(Ruleset.RELATION_OPERATIONS),
  dependencies: yup.array().of(yup.string()).required(),
});

const ParsedRulesetModel = yup.object().shape({
  root: yup.string().required(),
  rules: yup.array().of(ParsedRulesetRule),
  relations: yup.array().of(ParsedRulesetRelation),
});

const StatisticsAggregateRangeData = yup.array().of(
  yup.object().shape({
    index: yup.number().integer(),
    stayId: yup.number().integer(),
    value: yup.number(),
  })
);

const StatisticsAggregate = yup.object().shape({
  min: yup.number(),
  minOut: yup.number(),
  q1: yup.number(),
  median: yup.number(),
  avg: yup.number(),
  q3: yup.number(),
  maxOut: yup.number(),
  max: yup.number(),
  lowerInterval: StatisticsAggregateRangeData,
  upperInterval: StatisticsAggregateRangeData,
  histogram: yup.array().of(yup.array().of(yup.number())),
});

const StatisticsModelTotal = yup.object().shape({
  rowCount: yup.number().integer().required(),
  labelledRowCount: yup.number().integer().required(),
  labelCount: yup.number().integer().required(),
  minLabelDuration: yup.number().required(),
  maxLabelDuration: yup.number().required(),
  totalDuration: yup.number().required(),
  totalLabelDuration: yup.number().required(),
  avgLabelDuration: yup.number().required(),
});

const StatisticsModel = yup.object().shape({
  total: StatisticsModelTotal,
  minLabelDuration: StatisticsAggregate,
  maxLabelDuration: StatisticsAggregate,
  avgLabelDuration: StatisticsAggregate,
  totalLabelDuration: StatisticsAggregate,
  labelCount: StatisticsAggregate,
  percentageRowsLabelled: StatisticsAggregate,
});

const RulesetLabel = yup.object().shape({
  id: yup.customValidators.guid().required(),
  startTime: yup.date().required(),
  endTime: yup.date().required(),
});

function getRuleRelationCount(ruleset) {
  let ruleCount = ruleset.attributes.nodeType === 'RULE' ? 1 : 0;
  let relationCount = ruleset.attributes.nodeType === 'RELATION' ? 1 : 0;
  if (Array.isArray(ruleset.children)) {
    ruleset.children.forEach((child) => {
      const rulesRelations = getRuleRelationCount(child);
      ruleCount += rulesRelations.ruleCount;
      relationCount += rulesRelations.relationCount;
    });
  }
  return { ruleCount, relationCount };
}

module.exports.list = lambda(
  {
    group: 'participants',
    validators: {
      query: yup.object().shape({
        includeRuleDefinition: yup.bool(),
        includeRuleRelationCount: yup.bool(),
        includeRulesetStatistics: yup.bool(),
      }),
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          name: yup.string(),
          status: yup.mixed().oneOf(Object.values(Ruleset.STATUS)),
          isShared: yup.bool(),
          ruleCount: yup.number().integer(),
          relationCount: yup.number().integer(),
          ruleset: yup.lazy((value) =>
            value ? RulesetModel : yup.string().nullable()
          ),
          parsedRuleset: yup.lazy((value) =>
            value ? ParsedRulesetModel : yup.string().nullable()
          ),
          statistics: yup.lazy((value) =>
            value ? StatisticsModel : yup.string().nullable()
          ),
        })
      ),
    },
  },
  [
    {
      purpose: 'retrieve rulesets',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        let rulesets = await Ruleset.query()
          .where({
            cognitoId: userId,
          })
          .orWhere({ isShared: true });

        // TODO: Get latest status for each ruleset which has not finished processing.

        rulesets = rulesets.map((ruleset) => ({
          ...ruleset,
          ruleset: JSON.parse(ruleset.rulesetJson),
          parsedRuleset: JSON.parse(ruleset.parsedRulesetJson),
          statistics: ruleset.statisticsJson
            ? JSON.parse(ruleset.statisticsJson)
            : null,
        }));

        if (event.queryStringParameters) {
          if (event.queryStringParameters.includeRuleRelationCount) {
            rulesets = rulesets.map((ruleset) => {
              const { ruleCount, relationCount } = getRuleRelationCount(
                ruleset.ruleset
              );
              return {
                ...ruleset,
                ruleCount,
                relationCount,
              };
            });
          }
          rulesets.forEach((ruleset) => {
            if (!event.queryStringParameters.includeRulesetDefinition) {
              // eslint-disable-next-line no-param-reassign
              delete ruleset.ruleset;
              // eslint-disable-next-line no-param-reassign
              delete ruleset.parsedRuleset;
            }
            if (!event.queryStringParameters.includeRulesetStatistics) {
              // eslint-disable-next-line no-param-reassign
              delete ruleset.statistics;
            }
          });
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = rulesets;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.get = lambda(
  {
    group: 'participants',
    validators: {
      path: yup.object().shape({
        rulesetId: yup.customValidators.guid(),
      }),
      query: yup.object().shape({
        stayId: yup
          .number()
          .integer()
          .when('includeRulesetLabels', {
            is: true,
            then: (schema) => schema.required(),
          })
          .when('includeStayData', {
            is: true,
            then: (schema) => schema.required(),
          }),
        includeRulesetLabels: yup.bool(),
        includeStayData: yup.bool(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        isShared: yup.bool(),
        ruleset: RulesetModel,
        parsedRuleset: ParsedRulesetModel,
        status: yup.mixed().oneOf(Object.values(Ruleset.STATUS)),
        statistics: yup.lazy((value) =>
          value ? StatisticsModel : yup.string().nullable()
        ),
        labels: yup.array().of(RulesetLabel),
        data: yup.array(),
        parameters: yup.array().of(
          yup.object().shape({
            key: yup.string(),
            label: yup.string(),
          })
        ),
      }),
    },
  },
  [
    {
      purpose: 'retrieve ruleset',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;
        const { rulesetId } = event.pathParameters;

        const rulesetQuery = Ruleset.query()
          .findOne({
            id: rulesetId,
          })
          .where({
            cognitoId: userId,
          })
          .orWhere({ isShared: true });

        if (event.queryStringParameters && event.queryStringParameters.stayId) {
          if (event.queryStringParameters.includeRulesetLabels) {
            rulesetQuery
              .withGraphFetched('labels')
              .modifyGraph('labels', (query) =>
                query.where({ stayId: event.queryStringParameters.stayId })
              );
          }
        }

        const ruleset = await rulesetQuery;

        if (!ruleset) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        ruleset.ruleset = JSON.parse(ruleset.rulesetJson);
        ruleset.parsedRuleset = JSON.parse(ruleset.parsedRulesetJson);
        if (ruleset.statisticsJson) {
          ruleset.statistics = JSON.parse(ruleset.statisticsJson);
        }

        if (event.queryStringParameters && event.queryStringParameters.stayId) {
          if (event.queryStringParameters.includeStayData) {
            const knex = Row.knex();
            const data = await RawQuery.stayData(
              knex,
              event.queryStringParameters.stayId
            );
            if (data) {
              ruleset.data = data;
            }
            ruleset.parameters = Row.PARAMETERS;
          }
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = ruleset;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 200;
      },
    },
  ]
);

module.exports.post = lambda(
  {
    group: 'participants',
    validators: {
      body: yup.object().shape({
        name: yup.string().required(),
        ruleset: RulesetModel.required(),
        parsedRuleset: ParsedRulesetModel.required(),
      }),
      response: yup.object().shape({
        id: yup.customValidators.guid(),
        name: yup.string(),
        ruleset: RulesetModel,
        parsedRuleset: ParsedRulesetModel,
        status: yup.mixed().oneOf(Object.values(Ruleset.STATUS)),
        statistics: yup.lazy((value) =>
          value ? StatisticsModel : yup.string().nullable()
        ),
      }),
    },
  },
  [
    {
      purpose: 'create ruleset',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;

        let ruleset = await Ruleset.query().insertAndFetch({
          name: event.body.name,
          cognitoId: userId,
          rulesetJson: JSON.stringify(event.body.ruleset),
          parsedRulesetJson: JSON.stringify(event.body.parsedRuleset),
        });

        const rulesetProcessorService = new RulesetProcessorService({
          stateMachineArn: process.env.RULESET_PROCESSOR_STATE_MACHINE_ARN,
          region: process.env.REGION,
        });

        let newStatus = Ruleset.STATUS.IN_PROGRESS;
        let executionArn = null;
        try {
          executionArn = await rulesetProcessorService.trigger({
            id: ruleset.id,
            ...event.body.parsedRuleset,
          });
        } catch (error) {
          newStatus = Ruleset.STATUS.FAILED;
        }

        ruleset = await Ruleset.query().patchAndFetchById(ruleset.id, {
          status: newStatus,
          executionArn,
        });

        ruleset.ruleset = JSON.parse(ruleset.rulesetJson);
        ruleset.parsedRuleset = JSON.parse(ruleset.parsedRulesetJson);
        if (ruleset.statisticsJson) {
          ruleset.statistics = JSON.parse(ruleset.statisticsJson);
        }

        // eslint-disable-next-line no-param-reassign
        shared.body = ruleset;
        // eslint-disable-next-line no-param-reassign
        shared.statusCode = 201;
      },
    },
  ]
);
