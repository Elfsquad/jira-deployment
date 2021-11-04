const core = require('@actions/core');
const github = require('@actions/github');

const getDefaultPipelineDisplayName = () => {

}

const getPipelineId = () => {

}

const getDefaultPipelineUrl = () => {

}

const getPipeline = () => ({
  id: getPipelineId(),
  displayName: core.getInput('pipeline-display-name') ?? getDefaultPipelineDisplayName(),
  url: core.getInput('pipeline-url') ?? getDefaultPipelineUrl()
});

const getEnvironment = () => ({
  id: core.getInput('environment-id') ?? core.getInput('environment-type'),
  displayName: core.getInput('environment-display-name'),
  type: core.getInput('environment-type')
})

const getDefaultDisplayName = () => {

}

const getDeploymentSequenceNumber = () => {

}

const getUpdateSequenceNumber = () => {

}

const getUrl = () => {

}

const getLastUpdated = () => {

}

const getDefaultDescription = () => {

}

const validateState = (value) => {
  const allowedValues = [
    'unknown', 'pending', 'in_progress', 'cancelled', 
    'failed', 'rolled_back', 'successful'
  ];
  if (allowedValues.includes(value)) {
    return;
  }
  throw new Error(`'${value}' is not a valid state.`);
}

const validateEnvironment = (value) => {
  if (value.id.length > 255) {
    throw new Error(`The length of the environment id(${value.id.length}) is larger then the max (255).`);
  }

  if (value.displayName.length > 255) {
    throw new Error(`The length of the environment display name(${value.id.length}) is larger then the max (255).`);
  }

  const allowedTypes = [
    'unmapped', 'development', 'testing', 'staging', 'production'
  ];

  if (!allowedTypes.includes(value.type)) {
    throw new Error(`'${value.type}' is not a valid environment type.`);
  }
}

const validatePipeline = (value) => {
  if (value.id.length > 255) {
    throw new Error(`The length of the pipeline id(${value.id.length}) is larger then the max (255).`);
  }

  if (value.displayName.length > 255) {
    throw new Error(`The length of the pipeline display name(${value.id.length}) is larger then the max (255).`);
  }
}

const validateUrl = (value) => {
  if (value.length <= 2000) {
    return;
  }
    throw new Error(`The length of the url (${value.length}) is larger then the max (255).`);
}

const validateDisplayName = (value) => {
  if (value.length <= 255) {
    return;
  }
    throw new Error(`The length of the display name(${value.length}) is larger then the max (255).`);
}

try {
  const pipeline = getPipeline();
  const environment = getEnvironment();
  const displayName = core.getInput('display-name') ?? getDefaultDisplayName();
  const deploymentSequenceNumber = getDeploymentSequenceNumber();
  const updateSequenceNumber = getUpdateSequenceNumber();
  const url = getUrl();
  const lastUpdated = getLastUpdated();
  const description = core.getInput('description') ?? getDefaultDescription();

  const clientId = core.getInput('client-id');
  const clientSecret = core.getInput('client-secret');
  const state = core.getInput('state');

  validateState(state);
  validateEnvironment(environment);
  validatePipeline(pipeline);
  validateUrl(url);
  validateDisplayName(displayName);
} catch (error) {
  core.setFailed(error.message);
}
