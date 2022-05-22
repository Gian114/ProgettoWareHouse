'use strict'

const express = require('express');
const skuRouter = express.Router();

const db = require('../Modules/DB')

const SKU = require('../Modules/SKU')
const sku = new SKU(db.db)

const Position = require('../Modules/Position')
const pos = new Position(db.db)

const SKUServices = require('../Services/SKUServices')
const sservices = new SKUServices(sku,pos);


//get

skuRouter.get('/api/skus', async (req,res) =>{

    let x;
    x = await sservices.getSKUs();
    if(x === false){
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
    
    
    const id = req.params.id;
    let x;
    x = await sservices.getSKU(id)

    if (x === false){
        res.status(500).json({error: "generic error"})
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
    let x;
    x = await sservices.createSKU(item)
    if(x === false ){
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
    let x
    x = await sservices.modifySKU(id, newvalues)

    if(x===false){
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

    let x;
    x = await sservices.modifyPosition(res, id, positionID)
    if(x===false){
        return res.status(503).json({error: "generic error"})
    } else if(x===404){
        return res.status(404).json({err: "sku does not exist"})
    } else if(x===4042){
        return res.status(404).json({err: "position does not exist"})
    } else if(x===422){
        return res.status(422).json({err:"that position is capable of satisfying volume and/or weight constraint BUT some of it is occupied"})
    } else if(x===4222){
        return res.status(422).json({err:"that position is not capable of satisfying volume and/or weight constraint"})
    } else {
        return res.status(200).json();
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
    let x
    x = await sservices.deleteSKU(id)

    if(x===false){
        return res.status(503).json({error: "generic error"})
    } 
    return res.status(204).json();
  });
  
  module.exports = skuRouter;