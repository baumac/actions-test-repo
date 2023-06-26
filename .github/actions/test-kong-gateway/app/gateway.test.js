const axios = require('axios')

const BASE_GATEWAY_URL = "http://127.0.0.1:8000"

const assertions = require(process.env.ASSERTIONS_FILE_PATH)

test.each(assertions)('responds as expected', async (assertion) => {

    const res = await axios({
        method: assertion.method,
        url: new URL(assertion.path, BASE_GATEWAY_URL).toString(),
        maxRedirects: 0,
        headers: {...assertion.headers},
    })

    validate(res.data, assertion.expect)
});

function validate(response, expected) {
    console.log(response)
    expect(response.headers.host).toEqual(expected.upstream_host)
    expect(response.method).toEqual(expected.upstream_method)
    expect(response.path).toEqual(expected.upstream_path)

}


