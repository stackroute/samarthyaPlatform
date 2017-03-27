const neo4jConn = require('../neo4jcon/neo4jcon');
const graphConst = require('../common/graphConstants');
const session = neo4jConn.connection();

const findCenters = function (name, limit) {
    let promise = new Promise((resolve, reject) => {
        let query = '';
        query = query + 'MATCH (c:' + graphConst.NODE_CENTER + ')';

        if (name !== 'undifined' && name.length > 0) {
            query = query + 'WHERE c.name = "' + name + '"';
        }

        query = query + ' RETURN c';
        session
            .run(query)
            .then(function (result) {
                var data = [];
                result.records.forEach(function (record) {
                    data.push(record._fields[0].properties);
                });
                resolve(JSON.stringify(data));
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
};

module.exports = {
    findCenters: findCenters
};
