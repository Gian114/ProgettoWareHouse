const express = require('express');
const User = require('../Modules/User');
const db = require('../Modules/DB');

const userRouter = express.Router();
const user = new User(db.db);


//get
userRouter.get('/api/suppliers', async (req,res) =>{

    let x = '';
    try{
         x = await user.getSuppliers();
    } catch(err){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);
  

});

userRouter.get('/api/users', async (req,res) =>{

    let x = '';
    try{
         x = await user.getUsers();
    } catch(err){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);

})

//post

userRouter.post('/api/newUser', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
        
    if(req.body.username === undefined || req.body.name === undefined ||
        req.body.surname === undefined || req.body.password === undefined || 
        req.body.type === undefined){
            return res.status(422).json({err:"invalid body"})
        }

    if(req.body.password.length < 8 || req.body.type === "manager" || req.body.type === "administrator"){
        return res.status(422).json({err:"invalid body"})
    }

    let x;

    try{
        
        x = await user.getUser(req.body)

    }catch(err){
        console.log(err)
        return res.status(500).json({error: "generic error"})
    }

    if (x === ''){

        try{
            x = await user.createUser(req.body);
         } catch(err){   
            return res.status(500).json({error: "generic error"})
        }

    } else {
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

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'manager')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }

   
})

userRouter.post('/api/customerSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'customer')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }
})

userRouter.post('/api/supplierSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'supplier')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }
})

userRouter.post('/api/clerkSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'clerk')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }
})

userRouter.post('/api/qualityEmployeeSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'qualityEmployee')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }
})

userRouter.post('/api/deliveryEmployeeSessions', async (req,res) =>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
    
        //i work with the premise that in the frontend the password is send
        //using a crypting algorithm, the same used to store the passwords in the db

    if(req.body.username === undefined || req.body.password === undefined){
     return res.status(422).json({err:"invalid body"})}

    let x;
    try{
        x = await user.login(req.body, 'deliveryEmployee')
    }catch(err){
        return res.status(500).json({error: "generic error"})
    }

    if ( x === false ){
        return res.status(401).json({err:"wrong username and/or password"})
    } else {
        return res.status(200).json(x);
    }
})

//logout

//put
userRouter.put('/api/users/:username', async (req,res) =>{

    if(Object.keys(req.params).length === 0 || Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body and/or params"})
    }

    if(req.body.oldType === undefined || req.body.newType === undefined 
        || req.params.username === undefined){
        return res.status(422).json({err:"invalid body and/or username"})}
    
    if(req.body.newType === "manager" || req.body.newType === "administrator"){
        return res.status(422).json({err:"attempt to modify rights to admin or manager"})}
    
   
    try{
        await user.modifyUserType(req.body, req.params.username);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }

    return res.status(200).json();

})

//delete
userRouter.delete('/api/users/:username/:type', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({err:"invalid params"})
    }

    if(req.params.username === undefined || req.params.type === undefined){
        return res.status(422).json({err:"validation of username or of type failed"})}
    
    if(req.params.type === "manager" || req.params.type === "administrator"){
        return res.status(422).json({err:"attempt to delete a manager/administrator"})}

    try{
        console.log(req.params)
        await user.deleteUser(req.params);
    }catch(err){
        console.log(err)
        return res.status(503).json({error: "generic error"})
    }

    return res.status(204).json();

})

module.exports = userRouter;