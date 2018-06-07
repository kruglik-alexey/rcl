import React from 'react';
import {connect} from 'react-redux';

class Class extends React.Component {
    render() {
        return 'Class';
    }
}

class PureClass extends React.PureComponent {
    render() {
        return 'PureClass';
    }
}

const Func = () => 'Func';
const NestedFunc = () => <Func />;
const SuperNestedFunc = () => <NestedFunc />;

class Counter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
    }

    render() {
        return <button onClick={() => this.setState({counter: this.state.counter + 1})}>{this.state.counter}</button>;
    }
}

class List extends React.Component {
    render() {
        return (
            <div>
                <Func />
                <Func />
                <Func />
            </div>
        );
    }
}

class Nested extends React.Component {
    render() {
        return <Class />
    }
}

class SuperNested extends React.Component {
    render() {
        return <Nested />
    }
}

const Connected = connect(() => ({prop: 'Connected'}))(Class);

// TODO will confuse them as same component
function ArrayWOKeys() {
    return [1,2,3].map(i => <Class />);
}

function ArrayWKeys() {
    return [1,2,3].map(i => <Class key={i}/>);
}

// same for keys on Class
// same for funcs
function ArrayWKeysOnNative() {
    return [1,2,3].map(i => <div key={i}><Class /></div>);
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <button onClick={() => this.setState({})}>Hi</button>
                <Class />
                <PureClass />
                <Func />
                <NestedFunc />
                <SuperNestedFunc />
                {Func()}
                {NestedFunc()}
                {SuperNestedFunc()}
                <Counter />
                <Connected store={{
                    getState: () => {},
                    subscribe() {},
                    dispatch() {}
                }}/>
                <List />
                <Nested />
                <Nested />
                <SuperNested />
                <SuperNested />
                <ArrayWKeys />
                <ArrayWKeysOnNative />
            </div>
        );
    }
}

export default function createRoot() {
    return <Root />;
}
