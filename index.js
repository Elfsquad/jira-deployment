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
} catch (error) {
  core.setFailed(error.message);
}
