/**
 * ./project-files/web-services/express-b4/lib/bundle.js
 *
 * API endpoints for managing book bundles
 *
 * an example consideration:
 *
 *     Consider an API to update the name of a bundle.
 *     Roughly speaking, yourNode.js code will need to
 *     do the following:
 *
 *     - Retrieve the bundle from Elasticsearch.
 *     - Update the name field on the object in memory.
 *     - Put the updated object back into Elasticsearch.
 *
 *     In addition to handling these asynchronously and
 *     in order, you’ll have to deal with various failure
 *     modes:
 *
 *     - What if Elasticsearch is down?
 *     - What if the bundle doesn’t exist?
 *     - What if the bundle changed between the time Node.js
 *       downloaded it and the time it reuploaded it?
 *     - What if Elasticsearch fails to update for some
 *       other reason?
 */