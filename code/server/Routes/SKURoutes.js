'use strict'

const express = require('express');
const SKU = require('../Modules/SKU');
const db = require('../Modules/DB');
const Position = require('../Modules/Position');

const skuRouter = express.Router();
const sku = new SKU(db.db);
const pos = new Position(db.db)

//get

skuRouter.get('/api/skus', async (req,res) =>{

    let x = '';
    try{
         x = await sku.getListofSKU();
    } catch(err){
        return res.status(500).json({error: "generic error"})
    }
    return res.status(200).json(x);
  
  });

skuRouter.get('/api/skus/:id', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({error: 'validation of id failed'})
        }

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
    
    let x = ''
    const id = req.params.id;
    
    try{
        x = await sku.getSKUByID(id);
     
    }catch(err){
       return res.status(500).json({error: "generic error"})
    }
    
    
    if(x === ''){
       
        return res.status(404).json({error: "no SKU associated to id"});
    } else {
       
        return res.status(200).json(x);
    }
    
  
  });

//post

skuRouter.post('/api/sku', async (req,res)=>{

    if(Object.keys(req.body).length === 0){
        return res.status(422).json({err:"invalid body"})
        }
        
    if(req.body.description === undefined || req.body.weight === undefined ||
        req.body.volume === undefined || req.body.notes === undefined || 
        req.body.price === undefined || req.body.availableQuantity === undefined){
            return res.status(422).json({err:"invalid body"})
        }

    const item = req.body;
   
    try{
        
        await sku.createSKU(item);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }
    
    return res.status(201).json();
  
  });
  

//put
  
  skuRouter.put('/api/sku/:id', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || Object.keys(req.params).length === 0){
        return res.status(422).json({})
        }

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;

    if(req.body.newDescription === undefined || req.body.newWeight === undefined ||
        req.body.newVolume === undefined || req.body.newNotes === undefined || 
        req.body.newPrice === undefined || req.body.newAvailableQuantity === undefined){
            return res.status(422).json({err:"invalid body"})
        }
    
    const newvalues = req.body;

    try{
        await sku.modifySKU(id, newvalues);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }
    
    return res.status(200).json();
  
  });

  skuRouter.put('/api/sku/:id/position', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || Object.keys(req.params).length === 0){
        return res.status(422).json({})
        }
    
    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }
    
    if(req.body.position === undefined){
        return res.status(422).json({error:"invalid body"})
    }

    const id = req.params.id
    const positionID = req.body.position

    let s;
    let p;
    let status;
    let data;

    try{
        s = await sku.getSKUByID(id);
    }catch(err){
        console.log("a")
        console.log(err)
        return res.status(503).json({err:"generic error"})
    }

    if(s == ''){
        return res.status(404).json({err: "sku does not exist"})
    } else {
        
        try {
            p = await pos.getPosition(positionID)
        } catch(err){
            console.log("ba")
            console.log(err)
            return res.status(503).json({err:"generic error"})
        }

        if(p == ''){
            return res.status(404).json({err: "position does not exist"})
        } else {

            if((p.max_weight - p.occupied_weight) >= s.weight*s.quantity && (p.max_volume - p.occupied_volume) >= s.volume*s.quantity){
                
                data = {
                    weight : s.weight*s.quantity,
                    volume : s.volume*s.quantity
                }

                try{
                    status = await pos.occupyPosition(positionID, data)
                }catch(err){
                    console.log("aasd")
                    console.log(err)
                    return res.status(503).json({err:"generic error"})
                }

               try{
                await sku.modifyPosition(id, positionID)
               }catch(err){
                console.log(err)
                console.log("aaaaa")
                return res.status(503).json({err:"generic error"})
               }
               return res.status(200).json()

            } else if(p.max_weight >= s.weight*s.quantity &&  p.max_volume >= s.volume*s.quantity) {
                return res.status(422).json({err:"that position is capable of satisfying volume and/or weight constraint BUT some of it is occupied"})
            } else {
                return res.status(422).json({err:"that position is not capable of satisfying volume and/or weight constraint"})
            }
        }
    }
   
  })


  //delete
  
  skuRouter.delete('/api/skus/:id', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({})}

    if(!Number.isInteger(parseFloat(req.params.id)) || req.params.id<0) {
        return res.status(422).json({error: 'validation of id failed'});
    }

    const id = req.params.id;
    console.log(id)
    try{
        await sku.deleteSKU(id);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }

    return res.status(204).json(); 
  });
  
  module.exports = skuRouter;