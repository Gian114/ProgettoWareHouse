const UserServices = require('../Services/UserServices')

const User = require('../Modules/User')

const DB = require('../Modules/DB').DB;
const db = new DB(':memory:');
const dao = new User(db.db)

const user_services = new UserServices(dao)


describe("userlogin", () => {
    beforeEach(async () => {

        //deleting data 
        await db.dropTableUser();
        await db.createTableUser()

        let user1 = 
            {
                "username":"test2@gmail.com",
                "name":"Marco",
                "surname" : "Rossi",
                "password" : "testpassword",
                "type" : "customer"

            }

            let user2 = 
            {
                "username":"mverdi@gmail.com",
                "name":"Maria",
                "surname" : "Verdi",
                "password" : "ezwhezwhezeh",
                "type" : "clerk"
        
            }

        await dao.createUser(user1)
        await dao.createUser(user2)

    });


    let u1 = {"username":"test2@gmail.com", "password":"testpassword"}
    let u2 = {"username":"mverdi@gmail.com", "password":"ezwhezwhezeh"}

    testLogin(1, u1, "customer", "Marco");
    testLogin(2, u2, "clerk", "Maria");
    //testLogin(2, u2, "manager", "Maria"); //should fail, wrong role 
    
    
});



async function testLogin(id, data, type, name) {
    test('try to login', async () => {
        //lets see if the user is actually there and he can login in his account
        res = await user_services.userLogin(data, type)
        expect(res).toEqual({
            id : id,
            username: data.username,
            name: name,
        })
    });
}

//another testcase
describe("modify user type", () => {

    let modify = 
    {
        "oldType" : "customer",
        "newType" : "supplier"
    }

    
    testModify(modify, "test2@gmail.com")

});


async function testModify(data, username) {
    test('modify user type', async () => {
        let res = await user_services.modifyType(data, username)
        //if everything works fine it returns true
        expect(res).toEqual(true);
    });
}



//another testcase
describe("get all users", () => {

   testgetUsers(1, "test2@gmail.com","Marco","Rossi","supplier");
   //testgetUsers(1, "test2@gmail.com","Marco","Rossi","clerk"); //should fail, he is a supplier not a clerk 
 
});

async function testgetUsers(id, email, name, surname, type) {
    test('get all users', async () => {
        let res = await user_services.getUsers()
        //returns a list of users, as we added 2 users in a test above the length of res must be 2
        expect(res.length).toEqual(2);
        //in particular the first user has been modifed too, so lets see if his information are correct
        expect(res[0]).toEqual({
            id : id,
            email: email,
            name: name,
            surname: surname,
            type: type
        })
    });
}



//another testcase
describe("delete User", () => {

    let toDelete = 
    {
        "username" : "mverdi@gmail.com",
        "type" : "clerk"
    }
  
    testDelete(toDelete);


 
});

async function testDelete(data) {
    test('delete user', async () => {
        let res = await user_services.deleteUser(data)
        //if everything worked fine the services returns true
        expect(res).toEqual(true);
    });
}


