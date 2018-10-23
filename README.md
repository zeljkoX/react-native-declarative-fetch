# React Native Declarative Fetch [IN PROGRESS]

Client - Server communication in declarative way.


## Inspiration

Inspired by Apollo GraphQL library.


## Why?

Setting fetch function on every call is tedious. Declarative code adds readability factor.

## Installation

`yarn add react-native-declarative-fetch`

## Quick Start
```javascript

import {QueryProvider, Query} from 'react-native-declarative-fetch'

export default class App extends Component {

  render() {
    return (
      <QueryProvider
        defaultMethod='GET'
        endpoints={{default: 'http://localhost:8081', v1: 'http://localhost:8082'}}
        defaultHeaders={{acceptLanguage: 'en'}}>
        <Query url='test'>{
          ({data, error, loading}) => {
            if (loading) {
              return <Text>Loading</Text>
            }
            if (error) {
              return <Text>Error</Text>
            }
            return <Text>{data}</Text>
          })
        }</Query>
      </QueryProvider>
    )
  }
}
```

## Props

### QueryProvider

QueryProvider takes default configuration which is used by every Query component nested inside QueryProvider.
Should be add to app top level.

key | type | Value | Description
------ | ---- | ------- | ----------------------
endpoints | Object |  | Mapping of used endpoints.
defaultMethod | String | GET | Default Http method.
defaultHeaders | Object | {} | Default Http headers.
onError | Function | () => {} | Default error handler. Invoked on every Query error.


### Query

key | type | Value | Description
------ | ---- | ------- | ----------------------
method | String | GET | If not defined QueryProvider defaultMethod is used.
headers: Object | {} | If not defined QueryProvider defaultHeaders is used.
url | String |  | Required field, url that is added to QueryProvider endpoint.
skip | Boolean | false | Skip fetch in React componentDidMount lifecycle method.
variables | Object | {} | Data to be used with Post request.
onError | Function | () => {} | Callback to be invoked on failed request. Fallback to QueryProvider onError callback.
};

Props passed to children function:

key | type | Value | Description
------ | ---- | ------- | ----------------------
data | Object | | Response value.
error | Boolean | | Flag to indicate query error.
loading | Boolean | | Flag to indicate ongoing request.
fetch | Function | | Conditionally fetch

## TODO

- Add tests
- Refactor code
- Fix grammar

## License

MIT License. © Željko Marković 2018
