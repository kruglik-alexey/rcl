import {interceptComponent} from './componentInterceptor';
import {getDisplayName, debugLog} from './utils';

const defaultHook = {
    render(id, type, instance, props, state, context) {
        debugLog(`Render ${getDisplayName(type)}:${id}`);
    }
};

function patchReact(react, hooks, options) {
    if (react.__createElement) {
        throw new Error('Seems like React is already patched');
    }

    const interceptionCache = new Map();
    hooks = hooks !== undefined ? hooks.concat(defaultHook) : [defaultHook];

    react.__createElement = function(id, type, props, ...children) {
        const args = Array.from(arguments);
        args.shift();

        if (typeof type !== 'string') {
            if (props && props.key !== undefined) {
                id = id + '/' + props.key;
            }
            args[0] = interceptComponent(id, type, interceptionCache, hooks, options);
        }

        return react.createElement.apply(react, args);
    };

    debugLog('Patched React');

    return react;
}

function unpatchReact(react) {
    if (!react.__createElement) {
        throw new Error('Seems like React is not patched');
    }

    react.__createElement = undefined;
    debugLog('Unpatched React');
}

let initialized = false;
let patchedReact = null;

export function initRcl(react, hooks, options) {
    if (initialized) {
        destroyRcl();
    }
    patchedReact = patchReact(react, hooks, options);
    initialized = true;
}

export function destroyRcl() {
    if (!initialized) return;
    unpatchReact(patchedReact);
    initialized = false;
}
