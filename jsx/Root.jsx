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
            </div>
        );
    }
}

export default function createRoot() {
    return <Root />;
}
