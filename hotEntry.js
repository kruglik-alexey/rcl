import {init, destroy} from './testApp';

init();

if (module.hot) {
    module.hot.dispose(() => destroy());
    module.hot.accept(() => init());
}