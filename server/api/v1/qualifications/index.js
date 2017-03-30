/*
 * What this resource or module will do?
 * Handle Create and Find operation for 'qualifications node in neo4j' used for Knowledge model by administrator
 *
 * i.e., operations this module will support are typically like
 *
 * - Get all qualifications in graph database
 * - Add a qualification node in database
 *
 * Recommended to mount routes of this module as '/qualifications'
 * i.e., if a client wants to make a request it will start from '/qualifications/<route defined in the module>'
 *
 */
module.exports = require('./qualification.router');
