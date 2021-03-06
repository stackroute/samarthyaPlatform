const chai = require('chai');
const logger = require('./../../../applogger');
const expect = chai.expect;

describe('Test work experience section data analysis', function() {
    it('Invoke work experience analyser as a module', function(done) {
        const workExpGraphModel = require('./workExperience.graphmodel');

        let personName = 'Dheeren';
        let workExperience = {
            workplace: 'Wipro',
            jobRole: 'Developer',
            location: 'Bangalore',
            isCurrent: true,
            duration: 2
        };

        workExpGraphModel.relatePersonToOrganisation(personName, workExperience, function(err, result) {
            logger.debug('Result: ', JSON.stringify(result));

            expect(err).to.equal(null);
            expect(result).to.not.equal(null);
            expect(result).to.not.equal(undefined);
            done();
        });

        workExpGraphModel.releatePersonToJobRole(personName, workExperience, function(err, result) {
            logger.debug('Result: ', JSON.stringify(result));

            expect(err).to.equal(null);
            expect(result).to.not.equal(null);
            expect(result).to.not.equal(undefined);
            done();
        });

        workExpGraphModel.releatePersonToWorkingLocation(personName, workExperience, function(err, result) {
            logger.debug('Result: ', JSON.stringify(result));

            expect(err).to.equal(null);
            expect(result).to.not.equal(null);
            expect(result).to.not.equal(undefined);
            done();
        });
    });
});