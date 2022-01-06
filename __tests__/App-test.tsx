/**
 * @format
 */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {shallow} from 'enzyme';
import 'react-native';
import React from 'react';
import App from '../App';
import {Animated, RefreshControl} from 'react-native';

// Note: test renderer must be required after react-native.

Enzyme.configure({adapter: new Adapter()});
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('App', () => {
  beforeAll(() => {});

  it('App', () => {
    const wrapper = shallow(<App />);

    const refreshControl = wrapper
      .find(Animated.ScrollView)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(RefreshControl);
    expect(refreshControl.props().refreshing).toEqual(true);

    refreshControl.simulate('refresh');
  });
});
