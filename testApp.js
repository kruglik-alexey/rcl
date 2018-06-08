import React from 'react';
import ReactDom from 'react-dom';
import createRoot from './jsx/Root';
import {initLogger, destroyLogger} from './rcl/rerenderLogger';

export function init() {
    initLogger(React, {skipReactRedux: true, addIdTooltip: true});

    const div = document.createElement('div');
    ReactDom.render(createRoot(), div);
    document.body.innerHTML = '';
    document.body.appendChild(div);
}

export function destroy() {
    destroyLogger();
}
