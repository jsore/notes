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

        /** main homepage */
        case '#welcome':
            mainElement.innerHTML = templates.welcome();
            break;
        /** bundle lister */
        case '#list-bundles':
            const bundles = await getBundles();
            listBundles(bundles);
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


/*----------  book bundle retrieval  ----------*/

const getBundles = async () => {
    /**
     * async to Elastic search via fetch()
     *
     * fetch() produces Promise that initiates an HTTP req,
     *   pass in Elasticsearch search URL to get bundles
     */
    const esRes = await fetch('/es/b4/bundle/_search?size=1000');

    /**
     * another async call to a Promise producer, this time
     *   the json() method on the response body we just got
     *   to decode the response into JSON
     */
    const esResBody = await esRes.json();

    /**
     * extract Elasticsearch results (hits.hits) as array of
     *   objects of the bundle id and name
     */
    return esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
    }));
};


/** render the bundles */
const listBundles = bundles => {
    /** bundle add form + form submission */
    //mainElement.innerHTML = templates.listBundles({bundles});
    mainElement.innerHTML =
        templates.addBundleForm() + templates.listBundles({bundles});

    /** capture appropriate submit event */
    const form = mainElement.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();

        /** capture the supplied bundle name and addBundle() it */
        const name = form.querySelector('input').value;
        addBundle(name);
    });
};

/** helper function to show alerts */
const showAlert = (message, type = 'danger') => {
    const html = templates.alert({type, message});
    /** inject at end of element */
    alertsElement.insertAdjacentHTML('beforeend', html);
};


/*----------  add a bundle, then list them  ----------*/

const addBundle = async (name) => {
    /** try/catch synchronous exceptions, reject Promises */
    try {
        /** grab freshest version of existing bundle list... */
        const bundles = await getBundles();

        /** ...then add the new one, POST'ing via fetch() ... */
        const url = `/api/bundle?name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {method: 'POST'});
        /** once the await'ed POST returns, extract JSON */
        const resBody = await res.json();

        /** ...add newly added bundle to bundles[]... */
        bundles.push({id: resBody._id, name});

        /** ...and refresh the bundle list... */
        listBundles(bundles);

        /** ...then handle user notification */
        showAlert(`Bundle "${name}" created!`, 'success');
    } catch (err) {
        showAlert(err);
    }
};