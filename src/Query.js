/**
 * Main Query interface
 *
 * @flow
 */

import React from 'react';
import { Text } from 'react-native';
import { QueryConsumer } from './Context';

type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Props = {
  defaultMethod: String,
  defaultHeaders: String,
  url: String,
  skip: Boolean,
  variables: Object<any>,
  headers: Object<any>,
  onCompleted: Function,
  onError: Function,
  method: METHOD
};

type State = {
  data: ?any,
  error: Boolean,
  loading: Boolean
};

class Query extends React.Component<Props, State> {
  static defaultProps = {
    url: '',
    skip: false,
    variables: {},
    headers: {},
    method: 'GET',
    onCompleted: () => {},
    onError: () => {}
  };

  state = {
    data: null,
    error: false,
    loading: false
  };

  componentDidMount() {
    if (!this.props.url || !this.props.url.length) {
      throw new Error('Url parameter is optional');
    }
    if (this.props.skip) {
      return;
    }
    return this.fetch();
  }

  getMethod = (): METHOD => {
    if (this.props.method) {
      return this.props.method;
    }
    return this.props.defaultMethod;
  };

  getHeaders = (): Object<any> => {
    return { ...this.props.defaultHeaders, ...this.props.headers };
  };

  getUrl = (): String => {
    return `${this.props.getEndpoint(this.props.endpoint)}${this.props.url}`;
  };

  getFetchParameters = (): Object => {
    let fetchParameters = {
      method: this.getMethod(),
      headers: this.getHeaders()
    };
    if (fetchParameters.method === 'POST') {
      fetchParameters.body = JSON.stringify(this.props.variables);
    }
    return fetchParameters;
  };

  fetch = async (): Promise<any> => {
    try {
      this.setState(() => ({
        loading: true,
        error: false
      }));
      let response = await fetch(this.getUrl(), this.getFetchParameters());
      if (response.ok) {
        let result = await response.json();
        return this.onCompleted(result);
      }
    } catch (e) {
      return this.onError(e);
    }
  };

  onError = e => {
    this.setState(() => ({
      error: true,
      loading: false
    }));
    this.props.onError && this.props.onError(e);
  };

  onCompleted = (data: Object<any>) => {
    this.setState(() => ({
      loading: false,
      error: false,
      data
    }));
  };

  render() {
    return this.props.children({ ...this.state, fetch: this.fetch });
  }
}

export default props => <QueryConsumer>{queryProps => <Query {...queryProps} {...props} />}</QueryConsumer>;
