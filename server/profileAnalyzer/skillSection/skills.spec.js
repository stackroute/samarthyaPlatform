// this is for test the personal Info Analyzer functionality

const chai = require('chai');
const expect = chai.expect;

describe('Test personal Info section data Analysis', function () {
    it('Invoke personal Info Analyzer as a module', function (done) {
        const skillsModule = require('./');
        expect(undefined).to.not.equal(skillsModule);
        expect('object').to.equal(typeof skillsModule);
        expect('function').to.equal(typeof skillsModule.analyzer);
        done();
    });

    describe('Validations', function () {
        it('Check if analyze method verifies for data, espeically required data, before prcoeeding to analyze', function (done) {
            const skillsModule = require('./');
            const profileUser = { username: 'prakul' };
            const skills = [{
                name: 'Java',
                experience: '3',
                expertise: 'Beginner'
            }];

            // Expecting a error
            skillsModule.analyzer(profileUser, skills, function (err, result) {
                // Only if no data was passed, error should be thrown
                // if error comes, test case passes, if no error comes, test cases failes
                expect('object').to.equal(typeof err);
                expect('string').to.equal(typeof err.error);
                expect('No data found to analyze').to.equal(err.error);
                done();
            });
        });
    });

    describe('Analyse simple one single personal Info entry in the profile', function () {
        before(function () {
            console.log('[*] Cleaning up graph model, BEFORE verifying graph model creation from analyzer ');
        });

        it('Pass a actual data and check if data model is returned', function (done) {
            const skillsModule = require('./');
            const profileUser = { username: 'dheeren' };
            const skills = [{
                name: 'Java',
                experience: '3',
                expertise: 'Beginner'
            }];

            skillsModule.analyzer(profileUser, skills, function (err, result) {
                expect(null).to.equal(err);
                done();
            });
        });

        after(function () {
            console.log('[*] Cleaning up graph model, AFTER verifying graph model creation from analyzer');
        });
    });
});
