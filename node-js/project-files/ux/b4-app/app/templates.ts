/**
 * ./ux/b4-app/app/templates.ts
 *
 * front end code for app
 */
 /**
  * mnually bring some HTML in, referencing Bootstrap via
  *   classnames, specifying any classes beginning with 'b4-'
  *   ass application - not Bootstrap - specific
  */
export const main = `
    <div class="container">
        <h1>B4 - Better Book Bundle Builder</h1>
        <div class="b4-alerts"></div>
        <div class="b4-main"></div>
    </div>
`;

///** grab main via CSS selector on querySelector method */
//const mainElement = document.body.querySelector('.b4-main');

/** welcome message */
export const welcome = `
    <div class="jumbotron">
        <h1>Welcome!</h1>
        <p>B4 is an application for creating book bundles.</p>
    </div>
`;
///** grab secondary div via CSS selector on querySelector method */
//const alertsElement = document.body.querySelector('.b4-alerts');

/** green dismissable alert box */
export const alert = `
    <div class="alert alert-success alert-dismissible fade in" role="alert">
        <button class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <strong>Success!</strong> Bootstrap is working.
    </div>
`;