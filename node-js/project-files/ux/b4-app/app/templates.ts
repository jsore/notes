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

/**
 * bundle lister, takes advantage of Handlebar's version
 *   of if/else statements to render a table of bundles
 *   or a message and its version of forEach to iterate
 *   over an array or object
 *
 * href="#view-bundle/{{id}}" to link to a single bundle
 * data-bundle-id="{{id}}" to identify which bundle to del
 */
export const listBundles = Handlebars.compile(`
    <div class="panel panel-default">
        <div class="panel-heading">Your Book Bundles</div>
        {{#if bundles.length}}
            <table class="table">
                <thead>
                    <tr>
                        <th>Bundle Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {{#each bundles}}
                <tr>
                    <td>
                        <a href="#view-bundle/{{this.id}}">{{this.name}}</a>
                    </td>
                    <td>
                        <button class="btn delete" data-id="{{this.id}}">Delete</button>
                    </td>
                </tr>
                {{/each}}
            </table>
        {{else}}
            <div class="panel-body">
                <p>No bundles found!</p>
            </div>
        {{/if}}
    </div>
`);

/**
 * bundle adder, using input form
 */
export const addBundleForm = Handlebars.compile(`
<div class="panel panel-default">
    <div class="panel-heading">Create a new Book Bundle</div>
    <div class="panel-body">
        <form>
            <div class="input-group">
                <input class="form-control" placeholder="Bundle Name" />
                <span class="input-group-btn">
                    <button class="btn btn-primary" type="submit">Create</button>
                </span>
            </div>
        </form>
    </div>
</div>
`);