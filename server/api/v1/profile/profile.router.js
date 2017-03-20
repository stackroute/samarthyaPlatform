const router = require('express').Router();
const prflCtrl = require('./profile.controller');
const logger = require('./../../../../applogger');

/*
 * Actual URI will be HTTP POST /profiles/
 */

// view profile
router.get('/', function(req, res) {
    let profileData = req.query;
    try {
        if (!profileData) {
            throw new Error('Invalid inputs passed...!');
        }
        prflCtrl.viewProfile(profileData).then((successResult) => {
            return res.status(201).send(successResult);
        }, (errResult) => {
            // Log the error for internal use
            return res.status(500).send({ error: 'Internal error occurred, please try later..!' });
        });
    } catch (err) {
        // Log the Error for internal use
        res.send({ error: 'Failed to complete successfully, please check the request and try again..!' });
        return;
    }
});

// api to create new profile
router.post('/', function(req, res) {
    let profileData = req.body;
    logger.debug('Get object and store into profileData');
    try {
        if (!profileData) {
            logger.error('profileData not found');
            throw new Error('Invalid inputs passed...!');
        }
        prflCtrl.createProfile(profileData).then((successResult) => {
            return res.status(201).send(successResult);
        }, (errResult) => {
            // Log the error for internal use
            return res.status(500).send({ error: 'Internal error occurred, please try later..!' });
        });
    } catch (err) {
        // Log the Error for internal use
        res.send({ error: 'Failed to complete successfully, please check the request and try again..!' });
        return;
    }
});

// api to edit  profile
router.patch('/', function(req, res) {
    let profileData = req.body;
    try {
        if (!profileData) {
            throw new Error('Invalid inputs passed...!');
        }
        prflCtrl.editProfile(profileData).then((successResult) => {
            return res.status(201).send(successResult);
        }, (errResult) => {
            // Log the error for internal use
            logger.error('Internal error occurred');
            return res.status(500).send({ error: 'Internal error occurred, please try later..!' });
        });
    } catch (err) {
        // Log the Error for internal use
        logger.fatal('Exception occurred' + err);
        res.send({ error: 'Failed to complete successfully, please check the request and try again..!' });
        return;
    }
});

// api to delete  profile
router.delete('/', function(req, res) {
    let profileData = req.body;
    try {
        if (!profileData) {
            throw new Error('Invalid inputs passed...!');
        }
        prflCtrl.deleteProfile(profileData).then((successResult) => {
            return res.status(201).send(successResult);
        }, (errResult) => {
            // Log the error for internal use
            return res.status(500).send({ error: 'Internal error occurred, please try later..!' });
        });
    } catch (err) {
        // Log the Error for internal use
        res.send({ error: 'Failed to complete successfully, please check the request and try again..!' });
        return;
    }
});


module.exports = router;