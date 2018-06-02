import React from 'react';
import ReactDom from 'react-dom';
import Root from './jsx/Root';
import {initLogger, destroyLogger} from './rcl/rerenderLogger';

export function init() {
    initLogger(React);

    const div = document.createElement('div');
    ReactDom.render(React.createElement(Root, {}), div);
    document.body.innerHTML = '';
    document.body.appendChild(div);
}

export function destroy() {
    destroyLogger();
}
