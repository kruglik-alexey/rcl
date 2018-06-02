import {initRcl, destroyRcl} from './rcl';
import {getDisplayName} from './utils';
import * as eq from './equality';
import diffLogger from './diff';

function getComponentEntry(id, componentMap) {
    let entry = componentMap.get(id);
    if (entry === undefined) {
        entry = {
            history: []
        };
        componentMap.set(id, entry);
    }
    return entry;
}

function handleUnavoidableRerender(type, prev, curr, propsEquality, stateEquality, options) {
    if (options.logUnavoidableRerenders) {
        console.groupCollapsed(`%cUnavoidable rerender: ${getDisplayName(type)}`, 'color: grey;');
        if (propsEquality === eq.NOT_EQ) {
            //diffLogger(prev.props, curr.props, console, false, 'props');
        }
        if (stateEquality === eq.NOT_EQ) {
            //diffLogger(prev.state, curr.state, console, false, 'state');
        }
        console.groupEnd();
    }
}

function handleAvoidableRerender(type, prev, curr, propsEquality, stateEquality, options) {
    console.groupCollapsed(`%cAvoidable rerender: ${getDisplayName(type)}`, 'color: brown');
    console.warn(`Props are ${eq.equalityDescriptions[propsEquality]}:`, curr.props);
    console.warn(`State are ${eq.equalityDescriptions[stateEquality]}:`, curr.state);
    console.groupEnd();
}

function handleRender(entry, type, props, state, api, options) {
    const curr = {props, state};
    entry.history.push(curr);
    if (entry.history.length === 1) return;

    const prev = entry.history[entry.history.length - 2];

    const propsEquality = eq.checkEquality(prev.props, curr.props);
    const stateEquality = eq.checkEquality(prev.state, curr.state);

    api.rerenderCount++;
    if (propsEquality === eq.NOT_EQ || stateEquality === eq.NOT_EQ) {
        api.unavoidableRerenderCount++;
        handleUnavoidableRerender(type, prev, curr, propsEquality, stateEquality, options);
    } else {
        api.avoidableRerenderCount++;
        handleAvoidableRerender(type, prev, curr, propsEquality, stateEquality, options);
    }
}

let exposedGlobalApi = false;
let api = null;

export function initLogger(react, options) {
    options = Object.assign({}, options || {});
    options.exposeGlobalApi = options.exposeGlobalApi === undefined ? true : options.exposeGlobalApi;
    options.logUnavoidableRerenders = options.logUnavoidableRerenders === undefined ? true : options.logUnavoidableRerenders;

    const componentMap = new Map();
    api = {
        rerenderCount: 0,
        unavoidableRerenderCount: 0,
        avoidableRerenderCount: 0,
        resetCounters() {
            this.rerenderCount = 0;
            this.unavoidableRerenderCount = 0;
            this.avoidableRerenderCount = 0;
            return this;
        }
    };

    const hook = {
        render(id, type, instance, props, state, context) {
            handleRender(getComponentEntry(id, componentMap), type, props, state, api, options);
        }
    };

    initRcl(react, [hook]);

    exposedGlobalApi = false;
    if (options.exposeGlobalApi) {
        if (window.rerenderLogger !== undefined) {
            console.warn('window.rcl is already defined, skipping exposing global api');
        } else {
            window.rerenderLogger = api;
            exposedGlobalApi = true;
        }
    }

    return api;
}

export function destroyLogger() {
    destroyRcl();
    if (exposedGlobalApi && window.rerenderLogger === api) {
        window.rerenderLogger = undefined;
    }
}
