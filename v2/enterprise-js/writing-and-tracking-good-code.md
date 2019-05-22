# Writing And Tracking Good Code

### Technical Debt

I'm not very sure why I'm notating this section, but it stuck out to me.

<br>

https://softwareengineering.stackexchange.com/

> I'm doing 90% maintenance and 10% development, is this normal?

<br>

Minimum Viable Products becoming a company's flagship after quality and tests
continue to be sacrificed to meet deadlines.

- Lack of talent
- Lack of time
- Lack of morale

Repay debt by refactoring your shitty but functional one-pager kitchen sink app.

<br>

### TDD Process

1. Identify smallest functional unit of feature that's to be implemented
2. Identify a test case and write it ( happy path first, then edge cases )
3. Run test, watch it fail
4. Write enough code for the test to pass
5. Refactor, integrate as necessary

<br>

> Write tests before implementation to force yourself to think about and digest   <br>
> what your requirements are and how consumers consume your interface.

> TDD focuses on a single functional block at a time, its development cycles are  <br>
> usually very short (minutes to hours). This means small, incremental changes    <br>
> can be made and released rapidly.

> Always code as if the guy who ends up maintaining your code will be a violent   <br>
> psychopath who knows where you live

<br>

### Jargon

<strong>Isomorphic, Universal JS frameworks</strong> <br>
Write apps entirely in JS running on both client and server ( Meteor, etc ).

<strong>Single Page Applications</strong> <br>
Let the client handle logic and rendering, allowing the server to handle more
requests and the UI to be more responsive since you're not waiting for the
server to respond.

<strong>Server-side Rendering ( SSR )</strong> <br>
Counteract deficiancy of long initial load times for SPA's and helps with SEO
performance by helping crawlers decipher page views faster ( additional assets
get downloaded at some time in the future ).