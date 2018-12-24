/**
 * ./ux/b4-app/app/index.ts
 *
 * front end assets
 */

/*----------  webpack imports  ----------*/

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

/** will populate innerHTML elements */
import * as templates from './templates.ts';


/*----------  HTML elements from templates.ts  ----------*/

/** replace this with a method call instead of string value */
//document.body.innerHTML = templates.main;
document.body.innerHTML = templates.main();

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

////
//mainElement.innerHTML = templates.welcome();
//alertsElement.innerHTML = templates.alert({
//    type: 'info',
//    message: 'Handlebars is working!',
//});
////
/** use hash-based navigation instead, calling on hash change */
const showView = async () => {

    /** read everything after hash and split on /'s */
    const [view, ...params] = window.location.hash.split('/');

    /** switch() on newly created view object */
    switch (view) {

        case '#welcome':
            mainElement.innerHTML = templates.welcome();
            break;
        default:
            /** async() returns reject Promise */
            throw Error(`Unrecognized view: ${view}`);
    }
};

/** fire on hash change... */
window.addEventListener('hashchange', showView);
/** ...or explicitly call on initial page load (rejected async Promise) */
showView().catch(err => window.location.hash = '#welcome');