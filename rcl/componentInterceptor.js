import {getDisplayName, isClassComponent, debugLog} from './utils';
import React from 'react';

function callHooks(hooks, callbackName, args) {
    for (let i = 0; i < hooks.length; i++) {
        const callback = hooks[i][callbackName];
        callback.apply(hooks[i], args);
    }
}

function setParentId(tree, parentId) {
    if (typeof tree !== 'object') return tree;

    // child can be array
    if (Array.isArray(tree)) {
        return tree.map(e => setParentId(e, parentId));
    }

    tree = Object.assign({}, tree);
    tree.props = Object.assign({}, tree.props || {});

    if (typeof tree.type === 'function') {
        // do not set prop for native elements as it casue error in react
        tree.props.__parentId = parentId;
    }

    if (tree.props !== null && tree.props.children !== undefined) {
        const id = tree.props.key !== undefined ? parentId+ '/' + tree.props.key : parentId;
        if (Array.isArray(tree.props.children)) {
            tree.props.children = tree.props.children.map(c => setParentId(c, id));
        } else {
            // children can be a single child
            tree.props.children = setParentId(tree.props.children, id);
        }
    }

    return tree;
}

function interceptClassComponent(id, type, hooks) {
    return class extends type {
        render() {
            const totalId = (this.props.__parentId || '') + '_' + id;
            callHooks(hooks, 'render', [totalId, type, this, this.props, this.state, this.context]);
            const tree = React.createElement('div', null, totalId, super.render());
            return setParentId(tree, totalId);
        }
    };
}

function interceptFunctionalComponent(id, type, hooks) {
    return function(props, context) {
        // Pass func as both type and instance
        const totalId = ((props && props.__parentId) || '') + '_' + id;
        callHooks(hooks, 'render', [totalId, type, type, props, null, context]);
        const tree = React.createElement('div', null, totalId, type.apply(this, arguments));
        return setParentId(tree, totalId);
    };
}

export function interceptComponent(id, type, interceptionCache, hooks) {
    let intercepted = interceptionCache.get(id);
    if (intercepted === undefined || true) {
        debugLog(`Intercepting ${getDisplayName(type)}:${id}`);
        intercepted = isClassComponent(type) ?
            interceptClassComponent(id, type, hooks) :
            interceptFunctionalComponent(id, type, hooks);
        interceptionCache.set(id, intercepted);
    }
    return intercepted;
}

