# Input
- client-id:
  - description: 'The oAuth client id for your Jira installation'
  - required: true
- client-secret:
  - description: 'The oAuth client secret for your Jira installation'
  - required: true
- base-url:
  - description: 'Base url of your Jira instance'
  - required: true
- issue-keys:
  - description: Comma delimited list of issue keys
  - required: true
- display-name:
  - description: 'Display name of the deployment'
  - required: false
- state:
  - description: 'State of the deployment'
  - required: false
  - default: 'successful'
- pipeline-display-name:
  - description: 'Display name of the pipeline'
  - required: false
- pipeline-url: 'Url of the pipeline'
  - description: 'Url of the pipeline'
  - required: false
- environment-id:
  - description: 'Id of the deployment'
  - required: false
  - default: 'production'
- environment-type:
  - description: 'Environment of the deployment'
  - required: false
  - default: 'production'
- environment-display-name:
  - description: 'Display name of the environment'
  - required: false
  - default: 'Production'

