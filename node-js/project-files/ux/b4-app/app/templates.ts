/**
 * ./ux/b4-app/app/templates.ts
 *
 * front end code for app, pulled in via
 * webpack.config.js_module.rules.ts-loader
 */

/** bring in Handlebars for templating */
import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

/**
 * any classes beginning with 'b4-' are specific to this
 *   application - everything else is Bootstrap
 */

/** top container */
////
//export const main = `         <-- pre-Handlebars
////
/** pass everything through Handlebars.compile to return strings */
export const main = Handlebars.compile(`
    <div class="container">
        <h1>B4 - Better Book Bundle Builder</h1>
        <div class="b4-alerts"></div>
        <div class="b4-main"></div>
    </div>
`);

/** welcome message */
////
//export const welcome = `      <-- pre-Handlebars
////
/** pass everything through Handlebars.compile to return strings */
export const welcome = Handlebars.compile(`
    <div class="jumbotron">
        <h1>Welcome!</h1>
        <p>B4 is an app for creating book bundles.</p>
    </div>
`);

/** green dismissable alert box */
////
//export const alert = `        <-- pre-Handlebars
////
/** pass everything through Handlebars.compile to return strings */
export const alert = Handlebars.compile(`
    <div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
        <button class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        {{message}}
    </div>
`);
