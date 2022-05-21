const InternalOrderService = require('../Services/InternalOrderServices');
const io = require('../Modules/InternalOrder');
const db = require('../Modules/DB')
const dao = new io(db.db)
const io_service = new InternalOrderService();

describe("get users", () => {
    beforeEach(async () => {
       
        await dao.createInternalOrder('21-05-2022', 'ISSUED', 1);
        //await dao.newUser('mmz', 'Maurizio', 'Morisio', 'admin');
        
    });



    testUser('21-05-2022', 'ISSUED', 1, []);
    //testUser('mmz', 'Maurizio', 'Morisio', 'admin');

    //testUser('mario', 'Mario', 'Rossi', 'admin'); // -> this test will fail

});

async function testUser(date, state, customer, array) {
    test('get User', async () => {
        let res = await io_service.getInternalOrders();
        expect(res[0]).toEqual({
            id: 1,
            issueDate: date,
            state: state,
            customerId : customer,
            products : array
        });
    });
}

/*describe("set users", () => {
    beforeEach(() => {
        dao.deleteUserData();
    })
    describe("set user data", () => {
        test('setUser', async () => {
            const user = {
                username: 'mmz',
                name: 'Maurizio',
                surname: 'Morisio',
                role: 'admin'
            }

            let res = await user_service.setUser(user.username, user.name, user.surname, user.role);
            res = await user_service.getUser(user.username);

            expect(res).toEqual({
                id: user.username,
                fullName: user.name + ' ' + user.surname,
                role: user.role
            });
        })
    });
});*/
