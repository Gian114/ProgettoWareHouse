'use strict'

const express = require('express');
const Position = require('../Modules/Position');
const db = require('../Modules/DB');

const positionRouter = express.Router();
const position = new Position(db.db);

//get

//test ok
positionRouter.get('/api/position', async (req,res) =>{

    let x
  
    try{
      x = await position.getAllPosition();
    }catch(err){
      return res.status(500).json({error: "generic error"})
    }
      
      return res.status(200).json(x);
    
    });

//post

//test ok 
positionRouter.post('/api/position', async (req,res)=>{
        
    if(req.body.aisle_id === undefined || req.body.row === undefined ||
        req.body.col === undefined){
            return res.status(422).json({err:"invalid body"})
        }


    if(req.body.aisle_id.length != 4 || req.body.row.length !=4  ||
          req.body.col.length !=4) {
              return res.status(422).json({err:"invalid body"})
        }

    const item = req.body;

    const positionID = '' + req.body.aisle_id + req.body.row + req.body.col;

    console.log(item)
   
    try{
        await position.createNewPosition(item, positionID);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }
    
    return res.status(201).json();
  
  });

  //put

  //test ok, devi inserire gestione 404
  positionRouter.put('/api/position/:positionID', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}
  

    if(req.params.positionID === undefined || req.body.aisle_id === undefined){
        return res.status(422).json({})}  
  
    const position_id = req.params.positionID;

    const newvalues = req.body;

    const newPositionId = ''+ newvalues.aisle_id + newvalues.row + newvalues.col;

    try{
      await position.modifyPosition(position_id, newvalues,newPositionId);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //test ok anche qui aggiungi il 404 più altri test
  positionRouter.put('/api/position/:positionID/changeID', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}
  

    if(req.params.positionID === undefined || req.body.newPositionID === undefined){
        return res.status(422).json({})}  
  
    const position_id = req.params.positionID;
    const newPositionId = req.body.newPositionID;

    console.log(position_id);
    console.log(newPositionId);

    try{
      await position.modifyPositionID(position_id,newPositionId);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }
    
    return res.status(200).json();
  
  });

  //delete

  //test ok anche qui aggiungi altri if
  positionRouter.delete('/api/position/:positionID', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({})}

    const id = req.params.positionID;
    
    try{
        await position.deletePosition(id);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }

    return res.status(204).json(); 
  });

  
  module.exports = positionRouter;
