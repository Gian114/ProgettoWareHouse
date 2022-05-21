const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test user apis', () => {

    beforeEach(async () => {
        //await agent.delete('/users/allUsers');
    })

    //deleteAllData(204);
    newUser(201, '21-05-2022', [], 1);
    newUser(422);
   
});

/*function deleteAllData(expectedHTTPStatus) {
    it('Deleting data', function (done) {
        agent.delete('/users/allUsers')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}*/

function newUser(expectedHTTPStatus, issueDate, products, customerId) {
    it('adding a new user', function (done) {
        if (issueDate !== undefined) {
            let io = {issueDate: issueDate, products : products, customerId: customerId};

            agent.post('/api/internalOrders')
                .send(io)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    //res.body.issueDate.should.equal(issueDate);
                    done();
                });
             } else {
            agent.post('/api/internalOrders') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}


function getUser(expectedHTTPStatus, username, name, surname, role) {
    it('getting user data from the system', function (done) {
        let user = { username: username, name: name, surname: surname, role: role }
        agent.post('/users/newUser/')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                res.body.username.should.equal(username);
                agent.get('/users/getUser/' + username)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(username);
                        r.body.fullName.should.equal(name + ' ' + surname);
                        r.body.role.should.equal(role);
                        done();
                    });
            });
    });
}
