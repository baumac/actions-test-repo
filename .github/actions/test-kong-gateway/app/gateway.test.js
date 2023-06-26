const axios = require('axios')
const https = require("https");

const assertions = require(process.env.ASSERTIONS_FILE_PATH)

test.each(assertions)('responds as expected', async (assertion) => {

    const res = await axios({
        method: assertion.method,
        url: new URL(assertion.gateway_url).toString(),
        headers: {...assertion.headers},
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    })

    validate(res.data, assertion.expect)
});

function validate(response, expected) {
    console.log(response)
    expect(response.headers.host).toEqual(expected.upstream_host)
    expect(response.method).toEqual(expected.upstream_method)
    expect(response.path).toEqual(expected.upstream_path)
    expect(response.protocol).toEqual(expected.upstream_protocol)
}


