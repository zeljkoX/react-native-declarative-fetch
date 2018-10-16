import React from 'react';
import { shallow, render } from 'react-native-testing-library';
import { QueryProvider } from '../';

describe('QueryProvider', () => {
  it('should be defined', () => {
    expect(QueryProvider).toBeDefined();
  });

  it('should throw if endpoints prop not passed', () => {
    expect(() => shallow(<QueryProvider />)).toThrow();
  });

  it('should return asked endpoint', () => {
    const endpoints = { default: 'http://www.test.com', v1: 'http://www.test.com/v1', v2: 'http://www.test.com/v1/' };
    const component = render(<QueryProvider endpoints={endpoints} />);
    const instance = component.queryByName('QueryProvider').instance;
    expect(instance.getEndpoint()).toEqual(endpoints.default);
    expect(instance.getEndpoint('v1')).toEqual(endpoints.v1);
    expect(instance.getEndpoint('v2')).toEqual('http://www.test.com/v1');
  });

  it('should take defaultMethod prop', () => {
    const endpoints = { default: 'http://www.test.com', v1: 'http://www.test.com/v1' };
    const component = render(<QueryProvider endpoints={endpoints} defaultMethod="POST" />);
    const instance = component.queryByName('QueryProvider').instance;
    expect(instance.state.defaultMethod).toEqual('POST');
  });

  it('should take defaultMethod prop', () => {
    const endpoints = { default: 'http://www.test.com', v1: 'http://www.test.com/v1' };
    const defaultHeaders = { 'x-test-api': 1 };
    const component = render(<QueryProvider endpoints={endpoints} defaultHeaders={defaultHeaders} />);
    const instance = component.queryByName('QueryProvider').instance;
    expect(instance.state.defaultHeaders).toEqual(defaultHeaders);
  });

  it('should invoke onError cb', () => {
    const endpoints = { default: 'http://www.test.com', v1: 'http://www.test.com/v1' };
    const onError = jest.fn();
    const component = render(<QueryProvider endpoints={endpoints} onError={onError} />);
    const instance = component.queryByName('QueryProvider').instance;
    instance.state.onError();
    expect(onError).toHaveBeenCalled();
  });
});
