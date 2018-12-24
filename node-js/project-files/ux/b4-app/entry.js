/**
 * ./project-files/ux/b4-app/entry.js
 *
 * webpack entry point
 *
 * Bootstrap components: https://getbootstrap.com/docs/3.3/components/
 */
//'use strict';


/*----------  webpack imports  ----------*/

/**
 * bring in minified bootstrap CSS module, using rule from
 *   webpack.config.js_module.rules to match and load
 *   appropriate plugin for it (css-loader)...
 */
//import './node_modules/bootstrap/dist/css/bootstrap.min.css';

/** bootstrap jQuery functionality */
//import 'bootstrap';


/*----------  moved HTML to ./app/index.ts  ----------*/

// document.body.innerHTML = `<p>${new Date()}</p>`;
//
// /**
//  * ... then manually bring some HTML in, referencing Bootstrap
//  *   via classnames, specifying any classes beginning with 'b4-'
//  *   ass application - not Bootstrap - specific
//  */
// document.body.innerHTML = `
//     <div class="container">
//         <h1>B4 - Better Book Bundle Builder</h1>
//         <div class="b4-alerts"></div>
//         <div class="b4-main"></div>
//     </div>
// `;
//
// /** grab main via CSS selector on querySelector method */
// const mainElement = document.body.querySelector('.b4-main');
//
// /** welcome message */
// mainElement.innerHTML = `
//     <div class="jumbotron">
//         <h1>Welcome!</h1>
//         <p>B4 is an application for creating book bundles.</p>
//     </div>
// `;
//
// /** grab secondary div via CSS selector on querySelector method */
// const alertsElement = document.body.querySelector('.b4-alerts');
//
// /** green dismissable alert box */
// alertsElement.innerHTML = `
//     <div class="alert alert-success alert-dismissible fade in" role="alert">
//         <button class="close" data-dismiss="alert" aria-label="Close">
//             <span aria-hidden="true">&times;</span>
//         </button>
//         <strong>Success!</strong> Bootstrap is working.
//     </div>
// `;