import * as babel from 'babel-core';
import plugin from '../rcl/babelPlugin';

const classTestCase = `
export default class Root extends React.Component {
  render() {
      return React.createElement(
          'div',
          null,
          React.createElement(
              'button',
              { onClick: () => this.setState({}) },
              'Hi'
          ),
          React.createElement(Class, { prop: 'Class' }),
          React.createElement(PureClass, { prop: 'PureClass' }),
          React.createElement(Func, null),
          React.createElement(Func, { prop: 'Func1' })
      );
  }
}
`;

const funcTestCase = `
function func() {
  return React.createElement(
    'div',
    null,
    React.createElement(
        'button',
        { onClick: () => this.setState({}) },
        'Hi'
    ),
    React.createElement(Class, { prop: 'Class' }),
    React.createElement(PureClass, { prop: 'PureClass' }),
    React.createElement(Func, null),
    React.createElement(Func, { prop: 'Func1' })
  );
}
`;

it('classTestCase', () => {
  const {code} = babel.transform(classTestCase, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});

it('funcTestCase', () => {
  const {code} = babel.transform(classTestCase, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
