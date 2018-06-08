import {getDisplayName, isClassComponent, debugLog} from './utils';
import React from 'react';

const parentIdProp = '__parentId';

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
        tree.props[parentIdProp] = parentId;
    }

    if (tree.props !== null && tree.props.children !== undefined) {
        const id = tree.key !== null ? parentId+ '/' + tree.key : parentId;
        if (Array.isArray(tree.props.children)) {
            tree.props.children = tree.props.children.map(c => setParentId(c, id));
        } else {
            // children can be a single child
            tree.props.children = setParentId(tree.props.children, id);
        }
    }

    return tree;
}

function addIdTooltip(tree, id) {
    return React.createElement('div', {title: id}, tree);
}

function interceptClassComponent(id, type, hooks, options) {
    return class extends type {
        render() {
            const totalId = (this.props[parentIdProp] || '') + '_' + id;
            callHooks(hooks, 'render', [totalId, type, this, this.props, this.state, this.context]);
            let tree = super.render();
            tree = setParentId(tree, totalId);
            if (options.addIdTooltip) {
                tree = addIdTooltip(tree, totalId);
            }
            return tree;
        }
    };
}

function interceptFunctionalComponent(id, type, hooks, options) {
    return function(props, context) {
        // Pass func as both type and instance
        const totalId = ((props && props[parentIdProp]) || '') + '_' + id;
        callHooks(hooks, 'render', [totalId, type, type, props, null, context]);
        let tree = type.apply(this, arguments);
        tree = setParentId(tree, totalId);
        if (options.addIdTooltip) {
            tree = addIdTooltip(tree, totalId);
        }
        return tree;
    };
}

export function interceptComponent(id, type, interceptionCache, hooks, options) {
    let intercepted = interceptionCache.get(id);
    // TODO remove cache
    if (intercepted === undefined || true) {
        debugLog(`Intercepting ${getDisplayName(type)}:${id}`);
        intercepted = isClassComponent(type) ?
            interceptClassComponent(id, type, hooks, options) :
            interceptFunctionalComponent(id, type, hooks, options);
        interceptionCache.set(id, intercepted);
    }
    return intercepted;
}

