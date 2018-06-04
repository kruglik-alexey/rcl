import React from 'react';
import {connect} from 'react-redux';

class Class extends React.Component {
    render() {
        return this.props.prop;
    }
}

class PureClass extends React.PureComponent {
    render() {
        return this.props.prop;
    }
}

const Func = ({prop}) => prop;

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
                <Func key="1" prop="Func1"/>
                <Func key="2" prop="Func2"/>
                <Func key="3" prop="Func3"/>
            </div>
        );
    }
}

class Nested extends React.Component {
    render() {
        return <Class prop="NestedClass"/>
    }
}

const Connected = connect(() => ({prop: 'Connected'}))(Class);

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <button onClick={() => this.setState({})}>Hi</button>
                <Class prop={'Class'} />
                <PureClass prop={'PureClass'}/>
                <Func prop={'Func'}/>
                <Func prop={'Func1'}/>
                <Counter prop={'Counter'}/>
                <Connected store={{
                    getState: () => {},
                    subscribe() {},
                    dispatch() {}
                }}/>
                <List />
                <Nested />
                <Nested />
            </div>
        );
    }
}

export default function createRoot() {
    return <Root />;
}
