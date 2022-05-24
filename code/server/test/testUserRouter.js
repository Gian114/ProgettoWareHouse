const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test user apis', () => {
    
    beforeEach(async () => {
        await db.dropTableUser()
        await db.createTableUser()
    })
    
    afterEach(async ()=>{
        await db.dropTableUser()
    })

    
    
    const data = 
    {
        "username":"user1@ezwh.com",
        "name":"John",
        "surname" : "Smith",
        "password" : "testpassword",
        "type" : "customer"
    }

    newUser(201, data);
    newUser(422);

    //test login

    const loginData =
    {
        "username":"user1@ezwh.com",
        "password" : "testpassword"
    }

    const expectedData = 
    {
        "id":1,
        "username":"user1@ezwh.com",
        "name":"John"
    }

    const wrongPassword = 
    {
        "username":"user1@ezwh.com",
        "password" : "testpassword1"
    }

    const user = 
    {
        "username":"test2@ezwh.com",
        "name":"Mario",
        "surname" : "Test",
        "password" : "testpassword",
        "type" : "customer"
    }

    loginUser(200, user, loginData, expectedData)
    loginUser(422)
    loginUser(401, user, wrongPassword, expectedData)

    //test modify type

    let modify = 
    {
        "oldType" : "customer",
        "newType" : "supplier"
    }
    
    modifyType(200, modify, data.username)
    modifyType(422, modify)
    modifyType(422)
});


function newUser(expectedHTTPStatus, data) {
    it('create new user', function (done) {
        if (data !== undefined) {
            agent.post('/api/newUser')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
             } else {
            agent.post('/api/newUser') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function loginUser(expectedHTTPStatus, user, data, expectedData) {
    it('login test', function (done) {
        if (data !== undefined) {
            agent.post('/api/newUser')
            .send(user)
            .then(function(res){
                res.should.have.status(201)
            agent.post('/api/customerSessions')
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    if(expectedHTTPStatus === 200){
                    res.body.id.should.equal(expectedData.id);
                    res.body.username.should.equal(expectedData.username);
                    res.body.name.should.equal(expectedData.name);}
                    done();
                }).catch(done());
            })
             } else {
            agent.post('/api/customerSessions') //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function modifyType(expectedHTTPStatus, data, username) {
    it('test modify user type', function (done) {
        if (data !== undefined && username !== undefined) {
            agent.put('/api/users/' + username)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
             } else {
            agent.put('/api/users/' + username) //we are not sending the username
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}