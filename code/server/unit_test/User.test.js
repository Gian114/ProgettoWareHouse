'use strict';

const db = require('../Modules/DB')
const User = require('../Modules/User');
const dao = new User(db.db)

describe('testDao', () => {
    beforeAll(async () => {
        await db.dropTableUser();
        await db.createTableUser();
    });

    test('delete db', async () => {
        let res = await dao.getUsers();
        expect(res.length).toStrictEqual(0);
    });

    const data = 
    {
        "username":"user1@ezwh.com",
        "name":"John",
        "surname" : "Smith",
        "password" : "testpassword",
        "type" : "customer"
    }

    const loginData = 
    {
        "username":"user1@ezwh.com",
        "password" : "testpassword"
    }
    
    const deletingData = 
    {
        "username":"user1@ezwh.com",
        "type" : "customer"
    }

    testNewUser(data);
    testLogin(loginData, data.type);
    testdeleteUser(deletingData);

   
});


function testNewUser(data) {
    test('create new user', async () => {
        
        await dao.createUser(data)
        
        let d = {
            "username":"user1@ezwh.com",
            "type" : "customer"
        }
       
        let res = await dao.getUsers()
        expect(res.length).toStrictEqual(1);
        
        res = await dao.getUser(d)

        expect(res.id).toStrictEqual(1);
        expect(res.email).toStrictEqual(data.username);
        expect(res.name).toStrictEqual(data.name);
        expect(res.surname).toStrictEqual(data.surname);    
        expect(res.type).toStrictEqual(data.type);
         
    });
}



function testLogin(loginData, type) {
    test('login', async () => {
        
        const res = await dao.login(loginData, type)
        
        
        expect(res.username).toStrictEqual(loginData.username); 
        expect(res.type).toStrictEqual(type);
         
    });
}


function testdeleteUser(deletingData) {
    test('delete user', async () => {
        
        let res = await dao.deleteUser(deletingData)
        expect(res).toStrictEqual(true)

        res = await dao.getUsers()
        expect(res.length).toStrictEqual(0);
            
    });
}