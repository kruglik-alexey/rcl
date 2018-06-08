import React from 'react';
import ReactDom from 'react-dom';
import create from './jsx/DistinctionTest';
import {initLogger, destroyLogger} from './rcl/rerenderLogger';

export function init() {
    initLogger(React, {skipReactRedux: true, addIdTooltip: true});

    const div = document.createElement('div');
    ReactDom.render(create(), div);
    document.body.innerHTML = '';
    document.body.appendChild(div);
}

export function destroy() {
    destroyLogger();
}
