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
/** frontend user interaction choices */
import '../node_modules/bootstrap-social/bootstrap-social.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
/** our HTML */
import * as templates from './templates.ts';


/*----------  helper functions  ----------*/

/**
 * throw alerts to user
 */
const showAlert = (message, type = 'danger') => {
    const alertsElement = document.body.querySelector('.b4-alerts');
    const html = templates.alert({type, message});
    alertsElement.insertAdjacentHTML('beforeend', html);
};

/**
 * simplify backend requests, fetch & decode JSON
 *
 * using fetch() API to get specified url string
 */
const fetchJSON = async (url, method = 'GET') => {
    try {
        /** make sure fetch() sends cookies (credentials) */
        const response = await fetch(url, {method, credentials: 'same-origin'});
        /** send success Promise back to caller */
        return response.json();
    } catch (error) {
        return {error};
    }
};

/**
 * bundle getter
 */
const getBundles = async () => {
    /** hit /list-bundles route via fetchJSON */
    const bundles = await fetchJSON('/api/list-bundles');
    if (bundles.error) {
        throw bundles.error;
    }
    return bundles;
};

/**
 * bundle renderer
 */
const listBundles = bundles => {
    /** tack everything on to parent div */
    const mainElement = document.body.querySelector('.b4-main');

    mainElement.innerHTML =
        templates.addBundleForm() + templates.listBundles({bundles});

    /** add new bundle section */
    const form = mainElement.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.querySelector('input').value;
        addBundle(name);
    });
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
            /** grab fresh session object for up to date info... */
            const session = await fetchJSON('/api/session');
            /** ...and if found send the object to templates... */
            mainElement.innerHTML = templates.welcome({session});
            /** ...or fail */
            if (session.error) {  showAlert(session.error);  }
            break;

        /** bundle page */
        case '#list-bundles':
            try {
                const bundles = await getBundles();
                listBundles(bundles);
            } catch (err) {
                showAlert(err);
                window.location.hash = '#welcome';
            }
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
    /** pass main() our user object */
    const session = await fetchJSON('/api/session');
    document.body.innerHTML = templates.main({session});
    window.addEventListener('hashchange', showView);
    showView().catch(err => window.location.hash = '#welcome');
})();