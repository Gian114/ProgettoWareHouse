const express = require('express');
const userRouter = express.Router();

const db = require('../Modules/DB').db;
const User = require('../Modules/User')
const dao = new User(db.db)

const UserServices = require('../Services/UserServices');
const uservices = new UserServices(dao);



//get
userRouter.get('/api/suppliers', async (req,res) =>{
    
    const us = await uservices.getSuppliers()
    if(us === false ){
        return res.status(500).json({error: "generic error"})
    } 
    return res.status(200).json(us);

});

userRouter.get('/api/users', async (req,res) =>{

    const us = await uservices.getUsers()
    if(us === false ){
        return res.status(500).json({error: "generic error"})
    } 
    return res.status(200).json(us);

})

//post

userRouter.post('/api/newUser', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
        
    if(req.body.username == undefined || req.body.name == undefined ||
        req.body.surname == undefined || req.body.password == undefined || 
        req.body.type == undefined){
            return res.status(422).json({err:"invalid body"})
        }

    if(req.body.password.length < 8 || req.body.type === "manager" || req.body.type === "administrator"){
        return res.status(422).json({err:"invalid body"})
    }

   let data = req.body
   const us = await uservices.createUser(data)
   if(us === false ){
    return res.status(500).json({error: "generic error"})
    } else if (us === 409){
        return res.status(409).json({err:"user with same mail and type already exist"}); 
    }
    return res.status(201).json();
})

userRouter.post('/api/managerSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

    let data = req.body;
    const us = await uservices.userLogin(data, 'manager');

    if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);

})

userRouter.post('/api/customerSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

    let data = req.body;
    const us = await uservices.userLogin(data, 'customer');
    if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);
})

userRouter.post('/api/supplierSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

    let data = req.body;
    const us = await  uservices.userLogin(data, 'supplier');
    if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);
})

userRouter.post('/api/clerkSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

     let data = req.body;
     const us = await uservices.userLogin(data, 'clerk');
     if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);
})

userRouter.post('/api/qualityEmployeeSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

     let data = req.body;
     const us = await uservices.userLogin(data, 'qualityEmployee');
     if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);
})

userRouter.post('/api/deliveryEmployeeSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username == undefined || req.body.password == undefined){
     return res.status(422).json({err:"invalid body"})}

     let data = req.body;
     const us = await uservices.userLogin(data, 'deliveryEmployee');
     if(us === false ){
        return res.status(500).json({error: "generic error"})
        } else if (us === 401){
            return res.status(401).json({err:"wrong username and/or password"}); 
        }
        return res.status(200).json(us);
})

//logout

//put
userRouter.put('/api/users/:username', async (req,res) =>{

    if(Object.keys(req.params).length === 0 || Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body and/or params"})
    }

    if(req.body.oldType == undefined || req.body.newType == undefined 
        || req.params.username == undefined){
        return res.status(422).json({err:"invalid body and/or username"})}
    
    if(req.body.newType === "manager" || req.body.newType === "administrator"){
        return res.status(422).json({err:"attempt to modify rights to admin or manager"})}
    
   
    let data = req.body
    let username = req.params.username;

    const us = await uservices.modifyType(data, username)

    if(us === false ){
        return res.status(500).json({error: "generic error"})
    } 
    return res.status(200).json();

})

//delete
userRouter.delete('/api/users/:username/:type', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({err:"invalid params"})
    }

    if(req.params.username == undefined || req.params.type == undefined){
        return res.status(422).json({err:"validation of username or of type failed"})}
    
    if(req.params.type === "manager" || req.params.type === "administrator"){
        return res.status(422).json({err:"attempt to delete a manager/administrator"})}

   let data = req.params
   const us = uservices.deleteUser(data)
   if(us === false ){
    return res.status(500).json({error: "generic error"})
    } 
    return res.status(204).json();

})

module.exports = userRouter;