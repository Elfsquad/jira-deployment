const core = require('@actions/core');
const github = require('@actions/github');
import fetch from 'node-fetch';

import { getAccessToken } from './auth';

const context = github.context;

const getDefaultPipelineDisplayName = () =>  context.workflow;

const getPipelineId = () => `${context.payload.repository.url}-context.workflow`;

const getDefaultPipelineUrl = () => `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;

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

const getDefaultDisplayName = () => context.action;

const getDeploymentSequenceNumber = () => context.runId;

const getUpdateSequenceNumber = () => parseInt(new Date().getTime() / 1000)

const getUrl = () => getDefaultPipelineUrl();

const getLastUpdated = () => new Date().toISOString();

const getDefaultDescription = () => '';

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

const getAccessToken = async (clientId, clientSecret) => {
  const body = {
    audience: 'api.atlassian.com',
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  };
  const bodyAsJson = JSON.stringify(body);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: bodyAsJson
  };
  
  const response = await fetch('https://api.atlassian.com/oauth/token', options);
  const data = response.json();
  return data.access_token;
}

(async function () {
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

    const accessToken = getAccessToken(clientId, clientSecret);

    const deployment = {
      schemaVersion: "1.0",
      deploymentSequenceNumber: deploymentSequenceNumber,
      updateSequenceNumber: updateSequenceNumber,
      displayName: displayName,
      issueKeys: [],
      url: url,
      description: description,
      lastUpdated: lastUpdated,
      state: state,
      pipeline: pipeline,
      environment: environment
    }

    const body = { deployments: [deployment] };
    const bodyAsJson = JSON.stringify(body);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`
      },
      body: bodyAsJson
    };
    const response = await fetch(`https://api.atlassian.com/jira/deployments/0.1/cloud/${cloudId}/bulk`, options);
    const responseData = await response.json();

    if (response.rejectedDeployments && response.rejectedDeployments.length > 0) {
      const rejectedDeployment = response.rejectedDeployments[0];
      const errors = rejectedDeployment.errors.map(e => e.message).join(', ');
      core.setFailed(errors);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();

