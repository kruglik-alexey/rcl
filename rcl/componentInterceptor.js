import {getDisplayName, isClassComponent, debugLog} from './utils';
import React from 'react';

function callHooks(hooks, callbackName, args) {
    for (let i = 0; i < hooks.length; i++) {
        const callback = hooks[i][callbackName];
        callback.apply(hooks[i], args);
    }
}

function interceptClassComponent(id, type, hooks) {
    return class extends type {
        render() {
            callHooks(hooks, 'render', [id, type, this, this.props, this.state, this.context]);
            return React.createElement('div', null, id, super.render());
        }
    };
}

function interceptFunctionalComponent(id, type, hooks) {
    return function(props, context) {
        // Pass func as both type and instance
        callHooks(hooks, 'render', [id, type, type, props, null, context]);
        return React.createElement('div', null, id, type.apply(this, arguments));
    };
}

export function interceptComponent(id, type, interceptionCache, hooks) {
    let intercepted = interceptionCache.get(id);
    if (intercepted === undefined) {
        debugLog(`Intercepting ${getDisplayName(type)}:${id}`);
        intercepted = isClassComponent(type) ?
            interceptClassComponent(id, type, hooks) :
            interceptFunctionalComponent(id, type, hooks);
        interceptionCache.set(id, intercepted);
    }
    return intercepted;
}

