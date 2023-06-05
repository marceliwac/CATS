const { lambda, yup } = require('@wls/middleware');
const { Ruleset } = require('@wls/models');
const { v4: uuid } = require('uuid');
const RulesetProcessorService = require('@wls/ruleset-processor-service');

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
      then: (schema) => schema.required(),
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
      return yup.string().required();
    }
    return yup.number().nullable().required();
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

const StatisticsModel = yup.object().shape({
  total: yup.object().shape({
    rowCount: yup.number().integer().required(),
    labelledRowCount: yup.number().integer().required(),
    labelCount: yup.number().integer().required(),
    minLabelDuration: yup.number().required(),
    maxLabelDuration: yup.number().required(),
    totalLabelDuration: yup.number().required(),
    avgLabelDuration: yup.number().required(),
  }),
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

module.exports.list = lambda(
  {
    group: 'participants',
    validators: {
      response: yup.array().of(
        yup.object().shape({
          id: yup.customValidators.guid(),
          name: yup.string(),
          ruleset: RulesetModel,
          parsedRuleset: ParsedRulesetModel,
          status: yup.mixed().oneOf(Object.values(Ruleset.STATUS)),
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

        let rulesets = await Ruleset.query().where({
          cognitoId: userId,
        });

        // TODO: Get latest status for each ruleset which has not finished processing.

        rulesets = rulesets.map((ruleset) => ({
          ...ruleset,
          ruleset: JSON.parse(ruleset.rulesetJson),
          parsedRuleset: JSON.parse(ruleset.parsedRulesetJson),
          statistics: ruleset.statisticsJson
            ? JSON.parse(ruleset.statisticsJson)
            : null,
        }));

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
          }),
        includeRulesetLabels: yup.bool(),
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
        labels: yup.array().of(RulesetLabel),
      }),
    },
  },
  [
    {
      purpose: 'retrieve ruleset',
      async operation({ event, shared }) {
        const userId = event.requestContext.authorizer.claims.sub;
        const { rulesetId } = event.pathParameters;

        const rulesetQuery = Ruleset.query().findOne({
          id: rulesetId,
          cognitoId: userId,
        });

        if (
          event.queryStringParameters &&
          event.queryStringParameters.includeRulesetLabels &&
          event.queryStringParameters.stayId
        ) {
          rulesetQuery
            .withGraphFetched('labels')
            .modifyGraph('labels', (query) =>
              query.where({ stayId: event.queryStringParameters.stayId })
            );
        }

        const ruleset = await rulesetQuery;

        if (!ruleset) {
          // eslint-disable-next-line no-param-reassign
          shared.statusCode = 404;
          return;
        }

        // TODO: Get latest status for ruleset if it has not finished processing.

        ruleset.ruleset = JSON.parse(ruleset.rulesetJson);
        ruleset.parsedRuleset = JSON.parse(ruleset.parsedRulesetJson);
        if (ruleset.statisticsJson) {
          ruleset.statistics = JSON.parse(ruleset.statisticsJson);
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
