import React from 'react';

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

export default class Root extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => this.setState({})}>Hi</button>
                <Class prop={'Class'} />
                <PureClass prop={'PureClass'}/>
                <Func prop={'Func'}/>
                <Func prop={'Func1'}/>
                <Counter prop={'Counter'}/>
            </div>
        );
    }
}
