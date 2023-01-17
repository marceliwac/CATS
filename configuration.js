// Memory size required to reserve 1 entire vCPU on Lambda
const SINGLE_CORE_MAX_CPU_MEM_SIZE = 1769;

const AVAILABLE_STAGES = ['development', 'staging', 'production'];

const config = {
  // Application name used for the invitation email
  applicationName: 'Weaning Labelling Study',

  // Region of the deployment, has to match .gitlab-ci.yml region
  region: 'eu-west-1',

  // Region for the certificate deployment (currently only us-east-1 is supported for the cloudfront
  certificateRegion: 'us-east-1',

  // Prefix for the name of the stack
  stackNamePrefix: 'wls',

  // Database behaviour on stack deletion
  baseDomain: 'wl.marceliwac.com',

  // SES domain name for email sending configuration
  sesDomain: 'wl.marceliwac.com',

  // ID for the hosted zone containing the base domain (needs to be manually created)
  hostedZoneId: 'Z0390489281R7LFG1MW09',

  // Name of the hosted zone
  hostedZoneName: 'wl.marceliwac.com.', // TODO: If this does not work, add the dot at the end.

  // API domain prefix
  apiPrefix: 'api',

  // ID of the User Pool (with the region qualifier) (needs to be manually updated)
  // userPoolId: 'eu-west-1_bUG1eU2gv', // TODO Automate this by moving it to AWS SSM
  userPoolId: 'eu-west-1_u3rCCkiLU', // TODO Automate this by moving it to AWS SSM

  // ID of the User Pool Client for the website (needs to be manually updated)
  // userPoolClientWebsiteId: '1ik2qjs93h0p4g3ni3advb22v9', // TODO Automate this by moving it to AWS SSM
  userPoolClientWebsiteId: '74i6cr0qnp0mf6krt9sn5p8lqo', // TODO Automate this by moving it to AWS SSM

  // ARN of the identity for cognito emails (needs to be manually created)
  cognitoSourceArn:
    'arn:aws:ses:us-east-1:211056341960:identity/wl.marceliwac.com',
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
      REACT_APP_CONSENT_FORM_LINK:
        'https://eu1.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDgXGlU5-PuZC8T00AI02tAUc_OECNxi3Vwbg6VopfXT1fDaXAJkWtKyos6vwAm4VA*',
      REACT_APP_PARTICIPANT_INFORMATION_SHEET_LINK:
        'https://acrobat.adobe.com/link/track?uri=urn:aaid:scds:US:0e2b403f-fbc8-4d4c-972f-7432e1c21a25',
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
        timeout: 10,
      },
      lambdaEnvironment: {
        ...shared.lambdaEnvironment('production'),
        CONSOLE_LOG_LEVEL: 'info',
      },
      ses: shared.ses('production'),
      websiteEnvironment: shared.websiteEnvironment('production'),
      cognitoTriggerLambdaEnvironment:
        shared.cognitoTriggerLambdaEnvironment('production'),
    },
  },
};
