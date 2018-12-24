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

document.body.innerHTML = templates.main;

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

mainElement.innerHTML = templates.welcome;
alertsElement.innerHTML = templates.alert;