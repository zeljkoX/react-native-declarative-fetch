/**
 * QueryProvider
 *
 * @flow
 */

import React from 'react';
import { QueryProvider as QueryProviderContext } from './Context';

type State = {
  endpoints: Object<String>,
  defaultMethod: String,
  defaultHeaders: Object<any>,
  onError: Function,
  getBaseUrl: Function
};

type Props = {
  endpoints: Object<String>,
  defaultMethod: ?String,
  defaultHeaders: ?Object<String>,
  onError: Function
};
//(endpoint: ?String) => this.getEndpoint(endpoint)
export default class QueryProvider extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    if (!props.endpoints || !props.endpoints.default) {
      throw new Error('Endpoint mapping is not defined.');
    }

    this.state = {
      endpoints: this.props.endpoints,
      defaultMethod: props.defaultMethod || 'GET',
      defaultHeaders: props.defaultHeaders || {},
      onError: e => this.onError(e),
      getEndpoint: (endpoint: ?String): String => this.getEndpoint(endpoint)
    };
  }

  getEndpoint = (endpoint: ?String): String => {
    if (!endpoint || !this.state.endpoints[endpoint]) {
      return this.state.endpoints['default'];
    }
    return this.state.endpoints[endpoint];
  };

  onError = e => {
    this.props.onError && this.props.onError(e);
  };

  render() {
    return <QueryProviderContext value={this.state}>{this.props.children}</QueryProviderContext>;
  }
}
