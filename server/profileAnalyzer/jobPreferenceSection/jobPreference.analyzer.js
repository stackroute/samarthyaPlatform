const logger = require('./../../../applogger');
const async = require('async');
const jobPreferenceModel = require('./jobPreference.graphmodel');

const analyze = function (profileUser, jobPreferenceColln, callback) {
    if (!profileUser || !profileUser.username || !jobPreferenceColln || jobPreferenceColln.jobPreferenceRoles.length <= 0) {

        logger.error('No data found to analyze');

        return callback({
            error: 'No data found to analyze'
        }, null);
    }

    logger.info('Proceeding to analyze Job preference..!');
    async.map(jobPreferenceColln.jobPreferenceRoles, function (instance, asyncCallback) {
        analyzeJobPreferenceInstance(profileUser, instance,jobPreferenceColln.looking, asyncCallback);
    }, callback); 
    return true;
}

analyzeJobPreferenceInstance = function (profileUser, jobPreference, looking, analyzeResultCallback) {
    logger.debug('[*] Starting to analyze Job preference instance [', profileUser + ':' + jobPreference.jobRole, ']');

    async.parallel([
         //relating person to Himself node with relation looking and property
        function (callback) {
            jobPreferenceModel.relatePersonToHimself(profileUser.username, looking, callback)
        },
        //relating person to jobRole node
=======
    logger.info('Proceeding to analyze work experience..!');


    let results = [];
    analyzeJobPreferenceInstance(profileUser, jobPreferenceColln[0], callback);
    return callback;
};

analyzeJobPreferenceInstance = function (profileUser, jobPreference, callback) {
    async.parallel([
        // relating person to jobRole node
>>>>>>> b8610a061854203a858a2d1d22b8d0325fc46542
        function (callback) {
            jobPreferenceModel.relatePersonTojobRole(profileUser.username, jobPreference.jobRole, callback)
        },
        // relating person to skill node
        function (callback) {
            jobPreferenceModel.relatePersonToSkill(profileUser.username, jobPreference.skill, callback);
        },
        // relating person to location node
        function (callback) {
            jobPreferenceModel.relatePersonToPreferredLocation(profileUser.username, jobPreference.location, callback);
        }
    ], function (err, result) {
<<<<<<< HEAD
        if (err) {
            logger.error('Error in analyzing jobPreference instance ', err);
            analyzeResultCallback(err, null);
        }
        logger.debug('[*] Done analysing jobPreference instance [', profileUser + ':' + jobPreference.jobRole, ']');
        analyzeResultCallback(null, result);
    });
}

module.exports = {
    analyze: analyze,
    analyzeJobPreferenceInstance: analyzeJobPreferenceInstance
}
=======
        callback(result);
    });
};

module.exports = {
    analyze: analyze
};
>>>>>>> b8610a061854203a858a2d1d22b8d0325fc46542
