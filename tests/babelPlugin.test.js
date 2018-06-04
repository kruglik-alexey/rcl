const babel = require('babel-core');
const plugin = require('../rcl/babelPlugin');

const testCase = `
class Foo1 {
  render() {
    return React.createElement(
      A,
      null,
      React.createElement(B, null)
    );
  }
}

const foo2 = {
  render() {
    return React.createElement(
      A,
      null,
      React.createElement(B, null)
    );
  }
}

const foo3 = {
  render: function() {
    return React.createElement(
      A,
      null,
      React.createElement(B, null)
    );
  }
}

function Foo4() {
  return React.createElement(
    A,
    null,
    React.createElement(B, null)
  );
}

const foo5 = function () {
  return React.createElement(
    A,
    null,
    React.createElement(B, null)
  );
};

const foo6 = () => {
  return React.createElement(
    A,
    null,
    React.createElement(B, null)
  );
};

const foo7 = () => React.createElement(
  A,
  null,
  React.createElement(B, null)
);
`;

it('should be awesome', () => {
  const {code} = babel.transform(testCase, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
