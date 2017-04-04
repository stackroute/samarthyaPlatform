const ProfileImportModel = require('./../server/api/v1/profileImport/profileImport.entity');
const UserModel = require('./../server/api/v1/users/users.entity');
const ProfileModel = require('./../server/api/v1/profile/profile.entity');
const logger = require('./../applogger');
const async = require('async');
const highland = require('highland');
const fs = require('fs');


// save the profileImport to profile collections and users collections and updated profileImportHistory and ready for profile analyser
let saveProfileImport = function (id) {
    let id1 = '_id';
    let username = 'username';
    let importedOn = 'importedOn';
    let status = 'status';
    let saveData;
    require('../server/services/webapp.service').setupMongooseConnections();
    try {
        ProfileImportModel.find({
            _id: id
        }, function (err, datas) {
            if (err) {
                logger.error(err);
            } else {
                ProfileImportModel.update({
                    id1: id
                }, {
                    $set: {
                        'importResult.total': datas[0].importData.length
                    }
                }, function (err, data) {
                    if (err) {
                        logger.error(err);
                    } else {
                        logger.info('updted total profiles');
                    }
                });
                // Creates a stream from an array of filenames
                let result = highland(datas[0].importData)
                    .map(function (fileContent) {
                        return fileContent;
                    });
                result.each(function (d) {
                    async.waterfall(
                        [
                            function (callback) {
                                saveData = {
                                    username: d.username,
                                    password: d.username,
                                    role: d.role,
                                    status: 'ACTIVE',
                                    createdOn: Date.now(),
                                    updatedOn: Date.now()
                                };
                                userData = new UserModel(saveData);
                                userData.save(function (err, data) {
                                    details = {
                                        id1: id
                                    };
                                    if (err) {
                                        logger.error('userData not added sucessfully' + err);
                                        ProfileImportModel.update(details, {

                                                $inc: {
                                                    'importResult.failed': 1
                                                }

                                            },
                                            function (err, data) {
                                                if (err) {
                                                    logger.error(err);
                                                } else {
                                                    ProfileImportModel.update({
                                                        id1: id,
                                                        'importData.personalinfo.contact.I': d.personalinfo.contact.I
                                                    }, {
                                                        $set: {
                                                            'importData.$.importStatus': 'failed',
                                                            'importResult.errors': err
                                                        }
                                                    }, function (err, data) {
                                                        if (err) {
                                                            logger.error('Error in adding import Failed status');
                                                        } else {
                                                            logger.info('failure Status added success');
                                                        }
                                                    });
                                                }
                                            });
                                    } else {
                                        callback(null, d);
                                    }
                                });
                            },

                            function (d, callback) {
                                profileData = new ProfileModel(d);
                                profileData.save(function (err, docs) {
                                    if (err) {
                                        ProfileImportModel.update({
                                            id1: id,
                                            'importData.personalinfo.contact.I': d.personalinfo.contact.I
                                        }, {
                                            $set: {
                                                'importData.$.importStatus': 'failed',
                                                'importResult.errors': err
                                            }
                                        }, function (err, data) {
                                            if (err) {
                                                logger.error('Error in adding import Failed status');
                                            } else {
                                                logger.info('failure Status added success');
                                            }
                                        });
                                        logger.error('error in profile add' + err);

                                        UserModel.remove({
                                            username: d.username
                                        }, function (err, removeDocs) {
                                            if (err) {
                                                logger.error('Error in remove the user data while fail' + err);
                                            } else {
                                                logger.info('remove userData success while fail');
                                            }
                                        });
                                    } else {
                                        logger.info('profile added');
                                        ProfileImportModel.update({
                                                id1: id
                                            }, {
                                                $inc: {
                                                    'importResult.success': 1
                                                }
                                            },
                                            function (err, data) {
                                                if (err) {
                                                    logger.error(err);
                                                } else {
                                                    ProfileImportModel.update({
                                                        id1: id,
                                                        'importData.username': d.username
                                                    }, {
                                                        $set: {
                                                            importedOn: Date.now(),
                                                            status: 'imported',
                                                            'importData.$.importStatus': 'Success'
                                                        }
                                                    }, function (err, data) {
                                                        if (err) {
                                                            logger.error('Error in adding import Success status');
                                                        } else {
                                                            logger.info('Success Status added success');
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });

                                callback(null);
                            },

                            // this waterfall function is to call profile analyser
                            function (callback) {

                            }


                        ],
                        function (err, result) {
                            logger.error(result);
                        });
                });
            }
        });
    } catch (err) {
        logger.error(err);
    }
};
