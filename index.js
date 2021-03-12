const AWS = require('aws-sdk')
const exec = require('@actions/exec')
const core = require('@actions/core')
const github = require('@actions/github')

const component = core.getInput('component')
const Bucket = core.getInput('s3Bucket')
const maxCount = Number(core.getInput('maxCount')) || 20

const s3 = new AWS.S3()

async function getGitShas() {
  let output = ''
  await exec.exec('git', ['rev-list', 'HEAD', '--max-count', maxCount], {
    silent: true,
    listeners: {
      stdout: (data) => {
        output += data.toString()
      },
    },
  })

  return output.split('\n').filter((sha) => `${sha}`.trim().length > 0)
}

async function main() {
  const shas = await getGitShas()
  const currentSha = github.context.sha

  // check which image tags exists on s3
  const existing = new Map()
  await Promise.all(
    shas.map(async (sha) => {
      const Key = [sha, component].join('/')
      console.log(`Checking s3://${Bucket}/${Key}`)

      try {
        await s3.headObject({ Bucket, Key }).promise()
        existing.set(sha, Key)
      } catch (error) {
        existing.set(sha, null)
      }
    })
  )

  // Copy existing file
  const existingSha = shas.find((sha) => existing.get(sha))
  if (existingSha !== currentSha) {
    const Key = [currentSha, component].join('/')
    const CopySource = [Bucket, existing.get(existingSha)].join('/')
    console.log(`Copying s3://${CopySource} => s3://${Bucket}/${Key}`)
    await s3.copyObject({ Bucket, CopySource, Key }).promise()
    return Key
  } else {
    console.log('No existing configuration found')
    return null
  }
}

main()
  .then((Key) => {
    core.setOutput('s3Key', Key)
  })
  .catch((error) => {
    console.error(error)
    core.error(error.message)
  })
