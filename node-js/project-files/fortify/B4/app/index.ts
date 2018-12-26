/**
 * project-files/fortify/B4/app/index.ts
 *
 * frontend asset for building 'pages'
 */

/*----------  webpack imports  ----------*/

/** CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
/** jQuery functionality */
import 'bootstrap';
/** HTML */
import * as templates from './templates.ts';


/*----------  helper functions  ----------*/

/**
 * helper function to throw alerts to user
 */
const showAlert = (message, type = 'danger') => {
    const alertsElement = document.body.querySelector('.b4-alerts');
    const html = templates.alert({type, message});
    alertsElement.insertAdjacentHTML('beforeend', html);
};


/*----------  app navigation  ----------*/

/**
 * replace direct HTML manipulation with more dynamic hash
 *   based navigation, calling on hash change
 */
const showView = async () => {

    /** where this will go */
    const mainElement = document.body.querySelector('.b4-main');

    /** read everything after hash and split on /'s */
    const [view, ...params] = window.location.hash.split('/');

    /** switch() on newly created view object */
    switch (view) {
        /** welcome/home page */
        case '#welcome':
            const session = {};
            mainElement.innerHTML = templates.welcome({session});
            break;
        /** or if async() returns rejected Promise */
        default:
            throw Error(`Unrecognized view: ${view}`);
  }
};

/**
 * immediately go to welcome page
 */
(async () => {
    const session = {};
    document.body.innerHTML = templates.main({session});
    window.addEventListener('hashchange', showView);
    showView().catch(err => window.location.hash = '#welcome');
})();