# About
CATS is a cloud-native time-series data annotation platform for clinical settings.
It provides a complete end-to-end solution for annotating time-series data in a tabular format,
together with the user and data-management utilities.

# Installation
AWS account credentials are required to install the platform. The infrastructure is primarily 
written in a collection of an IaC (infrastructure-as-code) files called `serverless.yml`, which use
Serverless Framework as a backend.
The initial deployment requires several manual setup steps to be taken throughout the installation
process.

The primary source of configuration is stored in `configuration.js` file, and further stack-specific
configuration is distributed throughout the `serverless.yml` files.
Additionally, this project supports different stages, allowing for multiple instance of the platform
to run independently.
The stages can be specified using the `STAGE` environment variable, which is used in the deployment
scripts in the `package.json` files throughout the project when calling serverless backend.

### AWS Resource Setup

The below steps should be followed when deploying the platform; any commands should be ran from the
`src/` directory of the project.

1. Create an AWS account and store the credentials to your profile in the `~/.aws/credentials` file.
2. Set up an AWS SES domain that can be used to send the account-management-related emails.
3. Set up an AWS Route53 hosted zone for your domain.
4. Populate the `src/configuraiton.js` file with the domain identifiers obtained from the previous
steps. The fields that need to be populated at this stage are listed below.

```js
  // Domain name that will serve as a base for deployments
  baseDomain: '',

  // SES domain name for email sending configuration
  // (needs to be manually created)
  sesDomain: '',

  // ID for the hosted zone containing the base domain
  // (needs to be manually created)
  hostedZoneId: '',

  // Name of the hosted zone
  // (needs dot at the end, needs to be manually created)
  hostedZoneName: '',

  // ARN of the identity for cognito emails
  // (needs to be manually created)
  cognitoSourceArn: '',
```

### Infrastructure Deployment

The infrastructure can be deployed following the installation of required dependencies and following
the steps outlined below.
It's critical to preserve the deployment order of different stacks to ensure that the inter-stack
dependencies are provided when needed.
The order of deployment follows the below list:

1. Prerequisites and Certificate
2. Infrastructure
3. Migrations, Cognito-Trigger and Ruleset-Processor
4. Participant-API, Administrator-API and Website

In addition to the correct order, some stack require additional configuration prior to the
deployment.
This configuration is provided via `src/configuration.js` at the stage of deployment.
The script for deploying the platform is presented below:

0. Depending on the requirements of your deployment, you may wish to investigate the code and ensure
that the access to any additional databases used in your use case are facilitated. Initially, 
support is provided for a Postgres installation of a MIMIC-IV database with concepts tables 
included, which requires independent deployment. Once deployed, the database connection needs to be
passed via the `src/secrets.js` file, as per `secrets-example.js`.


1. Install the project dependencies:
```shell
# Install the packages
yarn install

# Bootstrap the inter-package dependencies
lerna bootstrap 
```

2. Deploy the prerequisites and certificate stacks:
```shell
lerna run deploy --scope=@cats/prerequisites --scope=@cats/certificate
```

3. Deploy the infrastructure stack:
```shell
lerna run deploy --scope=@cats/infrastructure
```

4. Update the `src/configuration.js` with the cognito user pool and client id details.
The properties that need to be updated are listed below:

```js
  // ID of the User Pool (with the region qualifier)
  // (needs to be manually updated)
  userPoolId: '',

  // ID of the User Pool Client for the website
    // (needs to be manually updated)
  userPoolClientWebsiteId: '',
```

5. Deploy the migrations, cognito-trigger and ruleset-processor stacks
```shell
lerna run deploy --scope=@cats/migrations  --scope=@cats/cognito-trigger  --scope=@cats/ruleset-processor
```

6. Update the `src/configuration.js` with the step functions state machine ARN.
   The property that need to be updated are listed below:

```js
  // ARN of the step function that processes the ruleset
  // (needs to be plugged in after creating the stack)
  rulesetProcessorStateMachineArn: '',
```

7. Deploy the participant API, Administrator API and website stacks
```shell
lerna run deploy --scope=@cats/participant-api  --scope=@cats/administrator-api  --scope=@cats/website
```

8. Once deployed, the initial administrator user needs to be created and the database migrations 
need to be run. This needs to be handled manually via the AWS Console.
