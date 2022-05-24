const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const db = require('../Modules/DB').db;



describe('test user apis', () => {
    
    beforeEach(async () => {

        await db.startDB()
        const user = 
        {
        "username":"test2@ezwh.com",
        "name":"Mario",
        "surname" : "Test",
        "password" : "testpassword",
        "type" : "customer"
        }
        //populating with a user so i can login and modify
        await agent.post("/api/newUser").send(user);

    })
    
    const data = 
    {
        "username":"user1@ezwh.com",
        "name":"John",
        "surname" : "Smith",
        "password" : "testpassword",
        "type" : "customer"
    }

    const user = 
        {
        "username":"test2@ezwh.com",
        "name":"Mario",
        "surname" : "Test",
        "password" : "testpassword",
        "type" : "customer"
        }

    newUser(201, data);
    newUser(409, user) //i try adding a user that already exist, must res 409 error
    newUser(422);



    //test login

    const loginData =
    {
        "username":"test2@ezwh.com",
        "password" : "testpassword"
    }

    const expectedData = 
    {
        "id":1,
        "username":"test2@ezwh.com",
        "name":"Mario"
    }

    const wrongData = 
    {
        "username":"user1@ezwh.com",
        "password" : "testpassword1"
    }


    loginUser(200, loginData, expectedData)
    loginUser(422)
    loginUser(401, wrongData, expectedData)

    //test modify type

    let modify = 
    {
        "oldType" : "customer",
        "newType" : "supplier"
    }
    
    modifyType(200, modify, "test2@ezwh.com")
    modifyType(422, modify)
    modifyType(422)
});


function newUser(expectedHTTPStatus, data) {
    it('create new user', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/newUser').send(data)
                    res.should.have.status(expectedHTTPStatus);
             } else {
            let res = await agent.post('/api/newUser') //we are not sending any data
               res.should.have.status(expectedHTTPStatus);  
        }
    })
}

function loginUser(expectedHTTPStatus, data, expectedData) {
    it('login test', async function () {
        if (data !== undefined) {
            let res = await agent.post('/api/customerSessions').send(data)
                    res.should.have.status(expectedHTTPStatus);
                    if(expectedHTTPStatus === 200){
                    res.body.id.should.equal(expectedData.id);
                    res.body.username.should.equal(expectedData.username);
                    res.body.name.should.equal(expectedData.name);}
             } else {
            let res = await agent.post('/api/customerSessions') //we are not sending any data
                    res.should.have.status(expectedHTTPStatus);   
        }

    });
}

function modifyType(expectedHTTPStatus, data, username) {
    it('test modify user type', async function () {
        if (data !== undefined && username !== undefined) {
            let res = await agent.put('/api/users/' + username).send(data);
                    res.should.have.status(expectedHTTPStatus);
             } else {
            let res = await agent.put('/api/users/' + username) //we are not sending the username
                    res.should.have.status(expectedHTTPStatus);
        }

    });
}