'use strict';

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
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
    
    

    testNewUser(data);
    testLogin(loginData, data.type, data.name, 1);
    testModifyType({"newType":"supplier", "oldType":"customer"}, data.username)
    testGetSuppliers(data.username, data.name, data.surname)

    const deletingData = 
    {
        "username":"user1@ezwh.com",
        "type" : "supplier"
    }
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



function testLogin(loginData, type, name, id) {
    test('login', async () => {
        
        const res = await dao.login(loginData, type)
        
        expect(res.id).toStrictEqual(id); 
        expect(res.username).toStrictEqual(loginData.username); 
        expect(res.name).toStrictEqual(name); 
         
    });
}

function testModifyType(data, username) {
    test('modify type', async () => {
        
        let res = await dao.modifyUserType(data, username)
        expect(res).toStrictEqual(true)

        res = await dao.getUser({username: username, type: data.newType})
        expect(res.id).toStrictEqual(1); 
        expect(res.email).toStrictEqual(username); 
        expect(res.type).toStrictEqual(data.newType);
    });
}

function testGetSuppliers(username, name, surname) {
    test('get suppliers', async () => {
        
        const res = await dao.getSuppliers()
        //console.log(res)
        expect(res[0].email).toStrictEqual(username); 
        expect(res[0].name).toStrictEqual(name); 
        expect(res[0].surname).toStrictEqual(surname); 
         
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