const User = require('../Modules/User');
const db = require('../Modules/DB');
const user = new User(db.db);


class UserServices{

    async getSuppliers(){

        let x = '';
        try{
            x = await user.getSuppliers();
        } catch(err){
            return false
        }
        return x;
    }

    async getUsers(){

        let x = '';
        try{
            x = await user.getUsers();
        } catch(err){
            return false
        }
        return x
    }

    async createUser(data){

        let x;

        try{
            
            x = await user.getUser(data)
    
        }catch(err){
            console.log(err)
            return false
        }
    
        if (x === ''){
    
            try{
                x = await user.createUser(data);
             } catch(err){   
                return false
            }
    
        } else {
            return 409;
        }
    
       return x
    }

    async userLogin(data, type){

        let x;
        try{
            x = await user.login(data, type)
        }catch(err){
            return false
        }

        if ( x === false ){
            return 401;
        } else {
            return x
        }

    }
    
    async modifyType(data, username){
        let x
        try{
            x = await user.modifyUserType(data, username);
        }catch(err){
            return false
        }
    
        return x

    }

    async deleteUser(data){

        let x
        try{
            x = await user.deleteUser(data);
        }catch(err){
            console.log(err)
            return false
        }
    
        return x
    }

}

module.exports = UserServices