type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete'

type Url = string

type CreateRequestsCreatorOptions<M = Methods> = {
  method: M
  url: Url
}

type CreateFunction = <
  Response = unknown,
  Query = undefined,
  Params = undefined,
  Body = undefined,
  M = Methods
>(
  options: CreateFunctionOptions<Query, Params, Body, M>
) => Promise<Response>

type CreateFunctionOptions<
  Query = undefined,
  Params = undefined,
  Body = undefined,
  M = Methods
> = {
  method: M
  query: Query
  params: Params
  body: Body
  url: Url
}

type RequiredOptionsType<Params, Query, Body> = [
  Params,
  Query,
  Body
][number] extends {}
  ? undefined
  : {} & (Params extends undefined ? {} : { params: Params }) &
      (Query extends undefined ? {} : { query: Query }) &
      (Body extends undefined ? {} : { body: Body })

type OptionsType<Params, Query, Body, Options> = RequiredOptionsType<
  Params,
  Query,
  Body
> extends undefined
  ? [Options]
  : [RequiredOptionsType<Params, Query, Body> & Options]

export default function createRequestsCreator<
  Options extends object = {},
  M = Methods
>(create: CreateFunction) {
  return <
    Response = unknown,
    Query = undefined,
    Params = undefined,
    Body = undefined
  >({
    method,
    url,
  }: CreateRequestsCreatorOptions<M>) => {
    return (
      ...args: OptionsType<Params, Query, Body, Options>
    ): Promise<Response> => {
      const options = args[0] || {}
      const query = 'query' in options ? options.query : {}
      const params = 'params' in options ? options.params : {}
      const body = 'body' in options ? options.body : {}

      let requestUrl = url.endsWith('/') ? url : `${url}/`

      if (typeof params === 'object') {
        for (const key in params) {
          requestUrl = requestUrl.replace(`/:${key}/`, `/${params[key]}/`)
        }
      }

      return create({
        method,
        query,
        body,
        params,
        url: requestUrl,
      })
    }
  }
}

const createFetchRequest = createRequestsCreator<{}, 'get'>(
  ({ body, query, url, method }) => {
    return (async () => {
      try {
        let requestUrl = url

        if (typeof query === 'object') {
          requestUrl += '?' + new URLSearchParams(query as any).toString()
        }

        const response = await fetch(requestUrl, {
          method: (method as string).toUpperCase(),
          body: body as BodyInit,
        })

        if (response.ok) {
          const json = await response.json()
          return json
        }

        throw response.json()
      } catch (error) {
        throw error
      }
    })()
  }
)

const f = createFetchRequest<
  { data: any },
  { page: number },
  undefined,
  { title: string }
>({
  url: '',
  method: 'get',
})
f({ query: { page: 1 }, body: { title: '1' } }).then((res) => res.data)
