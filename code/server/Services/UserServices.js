'use strict';

class UserServices{

    constructor(dao){
        this.user = dao;
    }

    async getSuppliers(){
        
        let x = '';
        try{
            x = await this.user.getSuppliers();
        } catch(err){
            return false
        }
        return x;
    }

    async getUsers(){

        let x = '';
        try{
            x = await this.user.getUsers();
        } catch(err){
            return false
        }
        return x
    }

    async createUser(data){

        let x;

        try{
            
            x = await this.user.getUser(data)
    
        }catch(err){
            console.log(err)
            return false
        }
        
        if (x === ''){
    
            try{
                x = await this.user.createUser(data);
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
            x = await this.user.login(data, type)
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
            const us = {
                username: username,
                type: data.oldType
            }
            x = await this.user.getUser(us)
        }catch(err){
            return false
        }

        if(x!==''){
        try{
            x = await this.user.modifyUserType(data, username);
        }catch(err){
            return false
        }
    
        return x
        } else {return 404}

    }

    async deleteUser(data){

        let x

        try{
            x = await this.user.deleteUser(data);
        }catch(err){
            console.log(err)
            return false
        }
        return x
    }

}

module.exports = UserServices;