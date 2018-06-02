import React from 'react';
import {interceptComponent} from './componentInterceptor';
import {getDisplayName, debugLog} from './utils';

let nextInstanceId = 0;

const defaultHook = {
    render(id, type, instance, props, state, context) {
        debugLog(`Render ${getDisplayName(type)}:${id}`);
    }
};

function patchCreateElement(hooks) {
    if (React.__createElement) {
        throw new Error('Seems like React is already patched');
    }

    const interceptionCache = new Map();
    hooks = hooks !== undefined ? hooks.concat(defaultHook) : [defaultHook];

    React.__createElement = function(id, type) {
        const args = Array.from(arguments);
        args.shift();
        args[0] = interceptComponent(id, type, interceptionCache, hooks);
        return React.createElement.apply(React, args);
    };

    debugLog('Patched React');
}

function unpatchCreateElement () {
    if (!React.__createElement) {
        throw new Error('Seems like React is not patched');
    }

    React.__createElement = undefined;
    debugLog('Unpatched React');
}

let initialized = false;

export function initRcl(hooks) {
    if (initialized) {
        destroyRcl();
    }
    patchCreateElement(hooks);
    initialized = true;
}

export function destroyRcl() {
    if (!initialized) return;
    unpatchCreateElement();
    initialized = false;
}
