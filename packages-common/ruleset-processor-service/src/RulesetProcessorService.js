const { SFNClient, StartExecutionCommand } = require('@aws-sdk/client-sfn');

const log = require('@wls/log');

module.exports = class RulesetProcessorService {
  constructor({ stateMachineArn, region }) {
    this.stateMachineArn = stateMachineArn;
    this.client = new SFNClient({
      region,
    });
  }

  async trigger(ruleset) {
    const command = new StartExecutionCommand({
      stateMachineArn: this.stateMachineArn,
      input: JSON.stringify({
        ruleset,
      }),
    });

    try {
      const response = await this.client.send(command);
      log.debug(response);
      return response.executionArn;
    } catch (e) {
      log.error(e);
      throw e;
    }
  }
};
