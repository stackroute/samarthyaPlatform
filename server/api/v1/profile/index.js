/*
 * What this resource or module will do?
 * Handles CRUD operations related to "user Profile"
 * Users is a collection for maintaining/persisting profile details for each user registered in the system
 *
 * i.e., operations this module will support are typically like
 *
 * - Add User profile (HTTP POST /profiles)
 * - Update user profile(HTTP PATCH /profiles/editprofile)
 * - Delete user profile  (HTTP DELETE /profiles/deleteprofile)
 *
 * Recommended to mount routes of this module as '/profiles'
 * i.e., if a client wants to make a request it will start from '/profile/<route defined in the module>'
 *
 */

module.exports = require('./profile.router');
