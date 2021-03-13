const core = require('@actions/core')
const github = require('@actions/github')

const branch =
  github.context.ref && github.context.ref.match('refs/heads/')
    ? github.context.ref
        .replace(/^refs\/heads\//, '')
        .replace(/\//, '-')
        .toLowerCase()
    : null

const prNumber = github.context.payload.pull_request?.number

const stackName = prNumber ? `pr-${prNumber}` : branch
core.setOutput('stackName', stackName)
