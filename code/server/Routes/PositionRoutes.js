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
        
    if(req.body.positionID === undefined || req.body.aisleID === undefined || req.body.row === undefined ||
        req.body.col === undefined || req.body.maxWeight === undefined
        || req.body.maxVolume === undefined ){
            return res.status(422).json({err:"invalid body"})
        }


    if(req.body.aisleID.length != 4 || req.body.row.length !=4  ||
          req.body.col.length !=4) {
              return res.status(422).json({err:"invalid lenght of aisle and/or row and/or col"})
        }

    const item = req.body;
   
    try{
        await position.createNewPosition(item);
    }catch(err){
      console.log(err)
        return res.status(503).json({error: "generic error"})
    }
    
    return res.status(201).json();
  
  });

  //put

  
  positionRouter.put('/api/position/:positionID', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}
  

    if(req.body.newAisleID === undefined || req.body.newRow === undefined ||
      req.body.newCol === undefined || req.body.newMaxWeight === undefined||
      req.body.newOccupiedWeight === undefined || req.body.newOccupiedVolume === undefined){
        return res.status(422).json({})}  
  
    const position_id = req.params.positionID;
    
    const newPositionId = ''+  + req.body.newAisleID + req.body.newRow + req.body.newCol;
    let x;

    try{
      x = await position.modifyPosition(position_id, req.body,newPositionId);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }

    if(x===false){
      return res.status(404).json({err:"position not found"});
    } 
    
    return res.status(200).json();
  
  });


  positionRouter.put('/api/position/:positionID/changeID', async (req,res)=>{

    if(Object.keys(req.body).length === 0 || 
    Object.keys(req.params).length === 0){
      return res.status(422).json({})}
  

    if(req.params.positionID === undefined || req.body.newPositionID === undefined){
        return res.status(422).json({})}  
  
    const position_id = req.params.positionID;
    const newPositionId = req.body.newPositionID;

    let x;
    try{
      x = await position.modifyPositionID(position_id,newPositionId);
    }catch(err){
      return res.status(503).json({err:"generic error"})
    }

    if(x===false){
      return res.status(404).json({err:"position not found"});
    }
    
    return res.status(200).json();
  
  });

  //delete

  //test ok anche qui aggiungi altri if
  positionRouter.delete('/api/position/:positionID', async (req,res) =>{

    if(Object.keys(req.params).length === 0){
        return res.status(422).json({})}

    const id = req.params.positionID;
    let x
    try{
        x = await position.deletePosition(id);
    }catch(err){
        return res.status(503).json({error: "generic error"})
    }

    if(x===false){
      return res.status(404).json({err:"position not found"});
    }
    return res.status(204).json(); 
  });

  
  module.exports = positionRouter;
