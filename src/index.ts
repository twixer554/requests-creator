type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete'

type Url = string

type ObjectHasKeys<T, NotEmpty, Empty> = T extends {
  [Key in [keyof T] extends [never] ? '' : string]: unknown
}
  ? NotEmpty
  : Empty

type ObjectOnlyRequiredKeys<T> = Pick<
  T,
  {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K
  }[keyof T]
>

type ObjectHasRequiredKeys<T, HasRequired, HasNotRequired> = ObjectHasKeys<
  ObjectOnlyRequiredKeys<T>,
  HasRequired,
  HasNotRequired
>

type RequiredOrNotRequiredOptions<Params, Name extends string> = ObjectHasKeys<
  Params,
  ObjectHasRequiredKeys<Params, { [Key in Name]: Params }, { [Key in Name]?: Params }>,
  {}
>

type CreateRequestsCreatorOptions<M = Methods> = {
  method: M
  url: Url
}

type RequestCreator<Config extends object = {}, M extends string = Methods> = <
  Response = unknown,
  Params = {},
  Query = {},
  Body = {}
>(
  options: CreateFunctionOptions<Params, Query, Body, Config, M>
) => Promise<Response>

type CreateFunctionOptions<Params, Query, Body, Config extends object = {}, M extends string = Methods> = {
  method: M
  params: Params
  query: Query
  body: Body
  url: Url
} & Config

type OptionsType<Params, Query, Body, Options> = RequiredOrNotRequiredOptions<Params, 'params'> &
  RequiredOrNotRequiredOptions<Query, 'query'> &
  RequiredOrNotRequiredOptions<Body, 'body'> &
  Options

type ArgumentsType<Params, Query, Body, Options> = ObjectHasRequiredKeys<
  OptionsType<Params, Query, Body, Options>,
  [OptionsType<Params, Query, Body, Options>],
  [OptionsType<Params, Query, Body, Options>?]
>

export default function createRequestsCreator<Config extends object = {}, M extends string = Methods>(
  creator: RequestCreator<Config, M>
) {
  return <
    Params extends object = {},
    Query extends object = {},
    Body extends object = {},
    Response = unknown
  >({
    method,
    url,
  }: CreateRequestsCreatorOptions<M>) => {
    return (...args: ArgumentsType<Params, Query, Body, Config>): Promise<Response> => {
      const options = args[0] || ({} as Config)
      const query = 'query' in options ? options.query : {}
      const params = 'params' in options ? options.params : {}
      const body = 'body' in options ? options.body : {}

      let requestUrl = url[url.length - 1] === '/' ? url : `${url}/`

      if (typeof params === 'object') {
        for (const key in params) {
          requestUrl = requestUrl.replace(new RegExp(`/:${key}/`, 'g'), `/${params[key]}/`)
        }
      }

      return creator({
        ...options,
        url: requestUrl,
        method,
        query,
        body,
        params,
      })
    }
  }
}
