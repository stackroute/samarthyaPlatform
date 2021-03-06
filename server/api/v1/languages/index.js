/*
 * What this resource or module will do?
 * Handle Create and Find operation for 'languages node in neo4j' used for Knowledge model by administrator
 *
 * i.e., operations this module will support are typically like
 *
 * - Get all languages in graph database
 * - Add a language node in database
 *
 * Recommended to mount routes of this module as '/languages'
 * i.e., if a client wants to make a request it will start from '/languages/<route defined in the module>'
 *
 */
module.exports = require('./language.router');
