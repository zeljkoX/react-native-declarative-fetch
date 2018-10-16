import { Query, Provider } from '../';
import React from 'react';
import { shallow, render } from 'react-native-testing-library';
import QueryProvider from '../QueryProvider';
import fetchMock from 'fetch-mock';

const TestQuery = <Query>{() => null}</Query>;

const TestQueryProvider = props => (
  <QueryProvider {...props} endpoints={{default: 'http://test.com/'}}>
    {props.children}
  </QueryProvider>
);

describe('Query', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it('should be defined', () => {
    expect(Query).toBeDefined();
  });

  it('should throw if not used inside QueryProvider', () => {
    expect(() => render(<Query>{() => null}</Query>)).toThrow(
      'QueryProvider component should be used in conjunction with Query component.'
    );
  });

  it('should throw if url prop not defined', () => {
    expect(() =>
      render(
        <TestQueryProvider>
          <Query>{() => null}</Query>
        </TestQueryProvider>
      )
    ).toThrow('Url parameter is required.');
  });

  it('getMethod should return proper method', () => {
    let component = render(
      <TestQueryProvider>
        <Query url="test">{() => null}</Query>
      </TestQueryProvider>
    );
    let instance = component.queryByName('Query').instance;
    expect(instance.getMethod()).toEqual('GET');

    component = render(
      <TestQueryProvider>
        <Query url="test" method="DELETE">
          {() => null}
        </Query>
      </TestQueryProvider>
    );
    instance = component.queryByName('Query').instance;
    expect(instance.getMethod()).toEqual('DELETE');
  });

  it('getHeaders should return proper headers', () => {
    const headers = { acceptLanguage: 'en' };
    const defaultHeaders = { token: 1 };

    let component = render(
      <TestQueryProvider>
        <Query url="test" headers={headers}>
          {() => null}
        </Query>
      </TestQueryProvider>
    );
    let instance = component.queryByName('Query').instance;
    expect(instance.getHeaders()).toEqual(headers);

    component = render(
      <TestQueryProvider defaultHeaders={defaultHeaders}>
        <Query url="test" headers={headers}>
          {() => null}
        </Query>
      </TestQueryProvider>
    );
    instance = component.queryByName('Query').instance;
    expect(instance.getHeaders()).toEqual({ ...headers, ...defaultHeaders });
  });

  it('getUrl should return proper url', () => {
    let component = render(
      <TestQueryProvider>
        <Query url="/1">{() => null}</Query>
      </TestQueryProvider>
    );
    let instance = component.queryByName('Query').instance;
    expect(instance.getUrl()).toEqual('http://test.com/1');

    component = render(
      <TestQueryProvider>
        <Query url="test">
          {() => null}
        </Query>
      </TestQueryProvider>
    );
    instance = component.queryByName('Query').instance;
    expect(instance.getUrl()).toEqual('http://test.com/test');

    component = render(
      <TestQueryProvider endpoints={{default: 'http://test.com/'}}>
        <Query url="/test">
          {() => null}
        </Query>
      </TestQueryProvider>
    );
    instance = component.queryByName('Query').instance;
    expect(instance.getUrl()).toEqual('http://test.com/test');
  });

  it('should fetch on mount', () => {
    const get = fetchMock.get('http://test.com/1', {done: true});
    let component = render(
      <TestQueryProvider>
        <Query url="/1">{() => null}</Query>
      </TestQueryProvider>
    );
    expect(get.called()).toBe(true);

    const post = fetchMock.post('http://test.com/1', {done: true});
    component = render(
      <TestQueryProvider>
        <Query url="/1" method="POST">{() => null}</Query>
      </TestQueryProvider>
    );
    expect(post.called()).toBe(true);
  });

  it('should not fetch when skip is used', () => {
    const req = fetchMock.get('http://test.com/1', {done: true});
    let component = render(
      <TestQueryProvider>
        <Query url="/1" skip>{() => null}</Query>
      </TestQueryProvider>
    );
    expect(req.called()).toBe(false)
  });
});
