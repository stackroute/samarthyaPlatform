const logger = require('./../../../applogger');
const async = require('async');
const qualificationModel = require('./qualification.graphmodel');

const analyze = function(profileUser, qualificationColln, callback) {
    // If data is not valid, return back without processing
    if (!profileUser ||
        !qualificationColln || !Array.isArray(qualificationColln) || qualificationColln.length <= 0) {
        logger.error('No qualification data found to analyze');
        return callback({
            error: 'No qualification data found to analyze'
        }, null);
    }
    logger.info('Proceeding to analyze qualification..!');
    async.map(qualificationColln, function(instance, asyncCallback) {
        analyzeQualificationInstance(profileUser, instance, asyncCallback);
    }, callback);

    return true;
};

analyzeQualificationInstance = function(personName, qualification, analyzeResultCallback) {
    logger.debug('[*] Starting to analyze qualification instance [', personName + ':' + qualification.name, ']');

    async.waterfall([
        function(callback) {
            // Establish relation between person and qualification
            qualificationModel.relatePersonToQualification(personName, qualification, callback);
        },
        function(input, callback) {
            // Establish relation between person and skill
            qualificationModel.relatePersonToSkill(personName, qualification, callback);
        },
        function(input, callback) {
            // Establish relation between person and institute
            qualificationModel.relatePersonToInstitute(personName, qualification, callback);
        },
        function(input, callback) {
            // Establish relation between institute and qualification
            qualificationModel.relateInstituteToQualification(qualification, callback);
        },
        function(input, callback) {
            // Establish relation between qualification and skill
            qualificationModel.relateQualificationToSkill(qualification, callback);
        },
        function(input, callback) {
            // Establish relation between qualification and skill
            qualificationModel.relateInstituteToLocation(qualification, callback);
        }
    ], function(err, result) {
        if (err) {
            logger.error('Error in analyzing qualification instance ', err);
            analyzeResultCallback(err, null);
        }
        logger.debug('[*] Done analysing qualification instance [', personName + ':' + qualification.name, ']');
        analyzeResultCallback(null, result);
    });
};

module.exports = {
    analyze: analyze,
    analyzeQualificationInstance: analyzeQualificationInstance
};