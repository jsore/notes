/**
 * ./ux/b4-app/app/templates.ts
 *
 * front end code for app, pulled in via
 * webpack.config.js_module.rules.ts-loader
 */

/**
 * any classes beginning with 'b4-' are specific to this
 *   application - everything else is Bootstrap
 */

/** top container */
//export const main = `
//    <div class="container">
//        <h1>B4 - Better Book Bundle Builder</h1>
//        <div class="b4-alerts"></div>
//        <div class="b4-main"></div>
//    </div>
//`;
export const main = `
<div class="container">
    <h1>B4 - Better Book Bundle Builder</h1>
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
</div>
`;

/** welcome message */
//export const welcome = `
//    <div class="jumbotron">
//        <h1>Welcome!</h1>
//        <p>B4 is an application for creating book bundles.</p>
//    </div>
//`;
export const welcome = `
<div class="jumbotron">
    <h1>Welcome!</h1>
    <p>B4 is an app for creating book bundles</p>
</div>
`;

/** green dismissable alert box */
//export const alert = `
//    <div class="alert alert-success alert-dismissible fade in" role="alert">
//        <button class="close" data-dismiss="alert" aria-label="Close">
//            <span aria-hidden="true">&times;</span>
//        </button>
//        <strong>Success!</strong> Bootstrap is working.
//    </div>
//`;
export const alert = `
<div class="alert alert-success alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    <strong>Success!</strong> Bootstrap is working.
</div>
`;