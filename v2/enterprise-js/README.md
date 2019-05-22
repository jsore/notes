# Building Enterprise JS Applications

My notes and excerpts of possible integrations to my site `jsore.com`

Source and supplemental code: https://github.com/jsore/hobnob

<br>

### Project Contents

[Writing And Tracking Good Code](https://github.com/jsore/notes/blob/master/v2/enterprise-js/writing-and-tracking-good-code.md)

[The Development Environment](https://github.com/jsore/notes/blob/master/v2/enterprise-js/the-development-environment.md)

[End To End Testing](https://github.com/jsore/notes/blob/master/v2/enterprise-js/end-to-end-testing.md)

[Elasticsearch](https://github.com/jsore/notes/blob/master/v2/enterprise-js/elasticsearch.md)

[Modularization](https://github.com/jsore/notes/blob/master/v2/enterprise-js/modularization.md)

[Unit/Integration Tests](https://github.com/jsore/notes/blob/master/v2/enterprise-js/unit-integration-tests.md)

[API Design](https://github.com/jsore/notes/blob/master/v2/enterprise-js/api-design.md)

[Deployment](https://github.com/jsore/notes/blob/master/v2/enterprise-js/deployment.md)

[CI](https://github.com/jsore/notes/blob/master/v2/enterprise-js/ci.md)

[Authentication And Authorization](https://github.com/jsore/notes/blob/master/v2/enterprise-js/authentication-authorization.md)

[Documenting The API](https://github.com/jsore/notes/blob/master/v2/enterprise-js/document-api.md)

[React And The UI](https://github.com/jsore/notes/blob/master/v2/enterprise-js/react-ui.md)

[Testing With React](https://github.com/jsore/notes/blob/master/v2/enterprise-js/testing-react.md)

[Redux For State Management](https://github.com/jsore/notes/blob/master/v2/enterprise-js/redux-state-management.md)

[Docker](https://github.com/jsore/notes/blob/master/v2/enterprise-js/docker.md)

[Kubernetes For HA](https://github.com/jsore/notes/blob/master/v2/enterprise-js/kubernetes.md)

[Snippets](https://github.com/jsore/notes/blob/master/v2/enterprise-js/snippets.md) ( just some things that might be useful to integrate )

<br>

### Concepts And Tools

( Some of these I'm already familair or am already using in my daily workflow )

- Git
- npm
- yarn
- Babel
- ESLint
- Cucumber
- Mocha
- Istanbul/NYC
- Selenium
- OpenAPI/Swagger
- Express
- Elasticsearch
- React
- Redux
- Webpack
- Travis
- Jenkins
- NGINX
- Linux
- PM2
- Docker
- Kubernetes

<br><br>

Reminder to self: TM userscript added to fix the fucky sizing for `kbd` text
> ```javascript
> // ==UserScript==
> ...
> // @match        https://learning.oreilly.com/library/view/building-enterprise-javascript/*
> // @grant        GM_addStyle
> ...
> let fixme = () => {
>     //GM_addStyle('kbd { font-size: 1rem !important; }');
>     // i hate myself
>     //GM_addStyle('#sbo-rt-content kbd, #sbo-rt-content .packt_action { font-size: 13pt !important; }');
>     GM_addStyle('#sbo-rt-content kbd, #sbo-rt-content .packt_action { font-size: 13pt !important; } #sbo-rt-content a, #sbo-rt-content .packt_url { font-size: 11pt; }');
>     console.log('kbd text size fixed');
> };
> fixme();
> ```