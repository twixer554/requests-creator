# Requests creator

Utility for creating typed and structured requests

## Install

```
npm i requests-creator
```

## Usage

With axios

```
import createRequestsCreator from 'requests-creator'
import axios from 'axios'

const apiInstance = axios.create({
    baseUrl: process.env.API_URL // for example 'https://jsonplaceholder.org/'
})

// #1 Create requests creator function.
const createAxiosRequest = createRequestsCreator(
    ({ url, method, params, query, body, config }) => {
        if (method === 'get' || 'method' === 'delete') {
            return apiInstance[method](url, { ...config, params: query })
        }

        return apiInstance[method](url, body, { ...config, params: query })
    }
)

// #2 Create requests. Url and method will be passed to #1 step.
const getPost = createAxiosRequest({
    url: '/posts/:id',
    method: 'get'
})

// #3 Do requests. Params, query, body and any config props will be passed to #1 step.
// getPost({ params: { id: 1 }, query: { some_query: '2' } }).then((response) => console.log(response))

// This example will make request to 'https://jsonplaceholder.org/posts/1?some_query=2'.
```

## Parameters

createRequestsCreator function takes executor function with options object which contains:

- url: requested url
- method: requested method
- params: dinamycally url params
- query: search url query
- body: request body

createRequestsCreator function returns request creator function which takes options object which contains:

- url: mask url
- method: request method

request creator function returns executor which takes options object which contains:

- params: dinamycally url params for request creator url mask
- query: search url query
- body: request body
- and other config options

## Typescript

This can be used with typescript. Docs in processing
