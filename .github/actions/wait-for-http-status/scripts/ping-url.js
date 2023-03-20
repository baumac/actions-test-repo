#!/usr/bin/env node

const parsed = parseAndValidateArgs()
const https = require('https')

setTimeout(() => {
  console.error(
    `ERROR! Provided timeout of ${parsed.timeoutSeconds} seconds reached without receiving an HTTP ${parsed.status} code from ${parsed.url}.`
  )
  process.exit(1)
}, parsed.timeoutSeconds * 1000)

setInterval(async () => {
  const result = await pingUrl(parsed.url)
  if (Number(result.status) === parsed.status) {
    console.log(`Success! Received HTTP ${parsed.status} code from ${parsed.url}`, result.responseBody)
    process.exit(0)
  } else {
    console.log(
      `Received an HTTP ${result.status} code from ${parsed.url}. Trying again in ${parsed.intervalSeconds} seconds`, result.responseBody
    )
  }
}, parsed.intervalSeconds * 1000)

function pingUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, response => {
      let bufferedData = ''
      const status = response.statusCode

      response.on('data', data => {
        bufferedData += data
      })

      response.on('end', () => {
        return resolve({ status, responseBody: tryParseJson(bufferedData) })
      })
    })

    req.on('error', e => {
      return resolve({ status: 500, responseBody: e })
    })

    req.end()
  })
}

function parseAndValidateArgs() {
  const NUM_ARGS = 4
  const args = process.argv?.slice(2)

  if (args?.length !== NUM_ARGS) {
    throw new Error(`Invalid number of arguments. Expecting ${NUM_ARGS}`)
  }

  const [url, rawStatus, rawTimeoutSeconds, rawIntervalSeconds] = args

  try {
    new URL(url)
  } catch(e) {
    console.error(`Invalid "url" argument provided: ${url}`)
    throw e
  }

  const status = parseInt(rawStatus)
  if (status === NaN || typeof status !== 'number' || status.toString().length !== 3 || status < 200 || status > 599) {
    throw new Error(`Invalid "status" argument provided: ${rawStatus}`)
  }

  const timeoutSeconds = parseInt(rawTimeoutSeconds)
  if (timeoutSeconds === NaN || typeof timeoutSeconds !== 'number') {
    throw new Error(`Invalid "timeoutSeconds" argument provided: ${rawTimeoutSeconds}`) 
  }

  const intervalSeconds = parseInt(rawIntervalSeconds)
  if (intervalSeconds === NaN || typeof intervalSeconds !== 'number') {
    throw new Error(`Invalid "intervalSeconds" argument provided: ${rawIntervalSeconds}`) 
  }

  return {
    url,
    status,
    timeoutSeconds,
    intervalSeconds
  }
}

function tryParseJson(str) {
  try {
    return JSON.parse(str)
  } catch(e) {
    console.error('Failed to parse the following into JSON:', str)
  }

  return undefined
}
