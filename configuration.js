// Memory size required to reserve 1 entire vCPU on Lambda
const SINGLE_CORE_MAX_CPU_MEM_SIZE = 1769;

const AVAILABLE_STAGES = ['development', 'staging', 'production'];

const config = {
  // Application name used for the invitation email
  applicationName: 'CATS',

  // Region of the deployment, has to match .gitlab-ci.yml region
  region: 'eu-west-1',

  // Region for the certificate deployment (currently only us-east-1 is supported for the cloudfront
  certificateRegion: 'us-east-1',

  // Prefix for the name of the stack
  stackNamePrefix: 'cats',

  // Domain name that will serve as a base for deployments
  baseDomain: 'cats.xxxxxxxxx.com',

  // SES domain name for email sending configuration (needs to be manually created)
  sesDomain: 'cats.xxxxxxxxx.com',

  // ID for the hosted zone containing the base domain (needs to be manually created)
  hostedZoneId: 'xxxxxxxxxxxxxxxxxxxxx',

  // Name of the hosted zone (needs dot at the end, needs to be manually created)
  hostedZoneName: 'cats.xxxxxxxxx.com.',

  // API domain prefix
  apiPrefix: 'api',

  // ID of the User Pool (with the region qualifier) (needs to be manually updated)
  userPoolId: 'eu-west-1_xxxxxxxxx', // TODO Automate this by moving it to AWS SSM

  // ID of the User Pool Client for the website (needs to be manually updated)
  userPoolClientWebsiteId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // TODO Automate this by moving it to AWS SSM

  // ARN of the step function that processes the ruleset (needs to be plugged in after creating the stack)
  rulesetProcessorStateMachineArn: 'arn:aws:states:eu-west-1:xxxxxxxxxxxx:stateMachine:RulesetProcessor', // TODO Automate this by moving it to AWS SSM

  // ARN of the identity for cognito emails (needs to be manually created)
  cognitoSourceArn: 'arn:aws:ses:us-east-1:xxxxxxxxxxxx:identity/cats.xxxxxxxxx.com',

};

const serviceNames = {
  administratorApi: `${config.stackNamePrefix}-administrator-api`,
  participantApi: `${config.stackNamePrefix}-participant-api`,
  infrastructure: `${config.stackNamePrefix}-infrastructure`,
  prerequisites: `${config.stackNamePrefix}-prerequisites`,
  certificate: `${config.stackNamePrefix}-certificate`,
  cognitoTrigger: `${config.stackNamePrefix}-cognito-trigger`,
  website: `${config.stackNamePrefix}-website`,
  migrations: `${config.stackNamePrefix}-migrations`,
  notifications: `${config.stackNamePrefix}-notifications`,
  rulesetProcessor: `${config.stackNamePrefix}-ruleset-processor`,
};

function validateStage(stage) {
  if (!stage || !AVAILABLE_STAGES.includes(stage)) {
    throw new Error(
      `Stage cannot be empty and has to be one of: ${AVAILABLE_STAGES}!`
    );
  }
}

function getDatabaseSecretNames(stage) {
  return {
    application: `DatabaseSecret-${config.stackNamePrefix}-${stage}`,
    mimic: `MimicDatabaseSecret-${config.stackNamePrefix}-${stage}`,
  };
}

function getDomains(stage) {
  let prefix = '';
  if (stage !== 'production') {
    if (stage && stage !== '') {
      prefix = `${stage}.`;
    }
  }
  return {
    website: `${prefix}${config.baseDomain}`,
    api: `${prefix}${config.apiPrefix}.${config.baseDomain}`,
  };
}

const shared = {
  // Create StackName for all services in given environment
  stackName: (stage) => {
    validateStage(stage);
    const stackNames = {};
    Object.keys(serviceNames).forEach((key) => {
      stackNames[key] = `${serviceNames[key]}-${stage}`;
    });
    return stackNames;
  },

  // Create website domain and API domain based on the base domain and environment prefix supplied.
  domain: (stage) => getDomains(stage),

  database: {
    user: 'postgres',
  },

  cloudformation: (stage) => {
    validateStage(stage);
    return {
      // Cloudfront distribution used as alias for all CF-hosted domains (in Route53),
      // has to be this value
      cloudfrontDistributionHostedZoneId: 'Z2FDTNDATAQYW2',

      // Default database behaviour on stack deletion
      databaseDeletionPolicy: 'Delete',
      hostedZoneId: config.hostedZoneId,
      hostedZoneName: config.hostedZoneName,
      databaseSecretName: getDatabaseSecretNames(stage).application,
      mimicDatabaseSecretName: getDatabaseSecretNames(stage).mimic,
    };
  },

  cloudfront: {
    // Default price class for website's distribution, one of the following:
    // [PriceClass_100 | PriceClass_200 | PriceClass_All]
    priceClass: 'PriceClass_100',
    // Manged cache policy id for "CachingDisabled"
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
    cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
  },

  cognito: (stage) => {
    const includeLocalhost = stage === 'development';
    const callbackUrls = [`https://${shared.domain(stage).website}/callback`];
    const logoutUrls = [`https://${shared.domain(stage).website}/logout`];

    if (includeLocalhost) {
      callbackUrls.push('http://localhost:3000/callback');
      logoutUrls.push('http://localhost:3000/logout');
    }

    return {
      callbackUrls,
      logoutUrls,
      userPoolName: `${config.stackNamePrefix}-${stage}-user-pool`,
    };
  },

  lambda: {
    memorySize: 256,
    timeout: 15,
    cognitoTrigger: {
      timeout: 5,
      memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE,
    },
    migrations: {
      memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE,
      timeout: 120,
    },
    rulesetProcessor: {
      memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE,
      timeout: 120,
    },
    rulesetProcessorStatistics: {
      memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE * 4,
      timeout: 300,
    },
  },

  lambdaEnvironment: (stage) => {
    validateStage(stage);
    const domains = getDomains(stage);
    return {
      CONSOLE_LOG_LEVEL: 'debug',
      STAGE: stage,
      REGION: config.region,
      COGNITO_USER_POOL_ID: config.userPoolId,
      WEBSITE_URL: `https://${domains.website}`,
      DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).application,
      MIMIC_DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).mimic,
      RULESET_PROCESSOR_STATE_MACHINE_ARN: config.rulesetProcessorStateMachineArn,
    };
  },

  cognitoTriggerLambdaEnvironment: (stage) => {
    validateStage(stage);
    const domains = getDomains(stage);
    return {
      CONSOLE_LOG_LEVEL: 'debug',
      STAGE: stage,
      REGION: config.region,
      APPLICATION_NAME: config.applicationName,
      WEBSITE_URL: `https://${domains.website}`,
      DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).application,
      MIMIC_DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).mimic,
    };
  },

  rulesetProcessorLambdaEnvironment: (stage) => {
    validateStage(stage);
    const domains = getDomains(stage);
    return {
      CONSOLE_LOG_LEVEL: 'debug',
      STAGE: stage,
      REGION: config.region,
      DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).application,
      MIMIC_DATABASE_SECRET_NAME: getDatabaseSecretNames(stage).mimic,
    };
  },

  ses: (stage) => {
    return {
      fromEmailAddress: `${
        stage !== 'production' ? `${stage}-` : ''
      }verification@${config.sesDomain}`,
      replyToEmailAddress: `${
        stage !== 'production' ? `${stage}-` : ''
      }noreply@${config.sesDomain}`,
      sourceArn: config.cognitoSourceArn,
    };
  },

  websiteEnvironment: (stage) => {
    validateStage(stage);
    const domains = getDomains(stage);
    const cognitoConfig = shared.cognito(stage);
    const callbackUrl = cognitoConfig.callbackUrls[0];
    const logoutUrl = cognitoConfig.logoutUrls[0];
    return {
      REACT_APP_API_URL: `https://${domains.api}`,
      REACT_APP_COGNITO_IDP_DOMAIN: `MISSING_DOMAIN.auth.${config.region}.amazoncognito.com`,
      REACT_APP_COGNITO_USER_POOL_REGION: config.region,
      REACT_APP_COGNITO_USER_POOL_ID: config.userPoolId,
      REACT_APP_COGNITO_USER_POOL_CLIENT_ID: config.userPoolClientWebsiteId,
      REACT_APP_COGNITO_REDIRECT_SIGN_IN: callbackUrl,
      REACT_APP_COGNITO_REDIRECT_SIGN_OUT: logoutUrl,
      REACT_APP_COGNITO_AUTH_COOKIE_DOMAIN: domains.website,
      REACT_APP_COGNITO_AUTH_COOKIE_SECURE: stage !== 'development',
      // Optional links to use in the front-end
      REACT_APP_CONSENT_FORM_LINK:
        'https://xxxxxxxxx.com/consent',
      REACT_APP_PARTICIPANT_INFORMATION_SHEET_LINK:
        'https://xxxxxxxxx.com/pis',
    };
  },
};

module.exports = {
  serviceNames,
  stage: {
    development: {
      region: config.region,
      certificateRegion: config.certificateRegion,
      stackName: shared.stackName('development'),
      domain: shared.domain('development'),
      database: shared.database,
      cloudformation: shared.cloudformation('development'),
      cloudfront: shared.cloudfront,
      cognito: shared.cognito('development'),
      lambda: shared.lambda,
      lambdaEnvironment: shared.lambdaEnvironment('development'),
      ses: shared.ses('development'),
      websiteEnvironment: shared.websiteEnvironment('development'),
      cognitoTriggerLambdaEnvironment:
        shared.cognitoTriggerLambdaEnvironment('development'),
      rulesetProcessorLambdaEnvironment:
        shared.rulesetProcessorLambdaEnvironment('development'),
    },
    staging: {
      region: config.region,
      certificateRegion: config.certificateRegion,
      stackName: shared.stackName('staging'),
      domain: shared.domain('staging'),
      database: shared.database,
      cloudformation: shared.cloudformation('staging'),
      cloudfront: shared.cloudfront,
      cognito: shared.cognito('staging'),
      lambda: {
        ...shared.lambda,
        memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE,
        timeout: 10,
      },
      lambdaEnvironment: shared.lambdaEnvironment('staging'),
      ses: shared.ses('staging'),
      websiteEnvironment: shared.websiteEnvironment('staging'),
      cognitoTriggerLambdaEnvironment:
        shared.cognitoTriggerLambdaEnvironment('staging'),
      rulesetProcessorLambdaEnvironment:
        shared.rulesetProcessorLambdaEnvironment('staging'),
    },
    production: {
      region: config.region,
      certificateRegion: config.certificateRegion,
      stackName: shared.stackName('production'),
      domain: shared.domain('production'),
      database: shared.database,
      cloudformation: {
        ...shared.cloudformation('production'),
        databaseDeletionPolicy: 'Snapshot',
      },
      cloudfront: {
        ...shared.cloudfront,
        priceClass: 'PriceClass_All',
      },
      cognito: shared.cognito('production'),
      lambda: {
        ...shared.lambda,
        memorySize: SINGLE_CORE_MAX_CPU_MEM_SIZE,
        timeout: 20,
      },
      lambdaEnvironment: {
        ...shared.lambdaEnvironment('production'),
        CONSOLE_LOG_LEVEL: 'info',
      },
      ses: shared.ses('production'),
      websiteEnvironment: shared.websiteEnvironment('production'),
      cognitoTriggerLambdaEnvironment:
        shared.cognitoTriggerLambdaEnvironment('production'),
      rulesetProcessorLambdaEnvironment:
        shared.rulesetProcessorLambdaEnvironment('production'),
    },
  },
};
