'use strict'

const express = require('express');
const Position = require('../Modules/Position');
const db = require('../Modules/DB').db;

const positionRouter = express.Router();
const position = new Position(db.db);

const PositionServices = require('../Services/PositionServices');
const positionServices = new PositionServices(position);

//get

//test ok
positionRouter.get('/api/positions', async (req, res) => {

    let x = await positionServices.getPosition();
    if (x === false) {
        return res.status(500).json({ error: "generic error" });
    }
    return res.status(200).json(x);

});

//post

//test ok 
positionRouter.post('/api/position', async (req, res) => {

    if (req.body.positionID == undefined || req.body.aisleID == undefined || req.body.row == undefined ||
        req.body.col == undefined || !Number.isInteger(Number(req.body.maxWeight))
        || !Number.isInteger(Number(req.body.maxVolume)) || req.body.maxWeight < 0 || req.body.maxVolume < 0) {
        return res.status(422).json({ err: "invalid body" })
    }


    if (req.body.aisleID.length != 4 || req.body.row.length != 4 ||
        req.body.col.length != 4) {
        return res.status(422).json({ err: "invalid lenght of aisle and/or row and/or col" })
    }

    const string = req.body.aisleID + req.body.row + req.body.col
    if (req.body.positionID !== string) {
        return res.status(422).json({ err: "invalid positionID" })
    }
    const item = req.body;

    let x = await positionServices.addPosition(item);
    if (x === false) {
        return res.status(503).json({ error: "generic error" })
    }

    return res.status(201).json();

});

//put


positionRouter.put('/api/position/:positionID', async (req, res) => {

    if (Object.keys(req.body).length === 0 ||
        Object.keys(req.params).length === 0) {
        return res.status(422).json({})
    }


    if (req.body.newAisleID == undefined || req.body.newRow == undefined ||
        req.body.newCol == undefined || req.body.newMaxWeight == undefined ||
        req.body.newOccupiedWeight == undefined || req.body.newOccupiedVolume == undefined || req.body.newMaxVolume == undefined) {
        return res.status(422).json({})
    }

    if (req.body.newMaxWeight < 0 || req.body.newOccupiedWeight < 0
        || req.body.newOccupiedVolume < 0 || req.body.newMaxVolume < 0) {
        return res.status(422).json({})
    }

    const position_id = req.params.positionID;

    const newPositionId = '' + req.body.newAisleID + req.body.newRow + req.body.newCol;

    let x = await positionServices.changePosition(position_id, req.body, newPositionId);

    if (x === false) {
        return res.status(503).json({ err: "generic error" })
    }

    if (x === 404) {
        return res.status(404).json({ err: "position not found" });
    }

    return res.status(200).json();

});


positionRouter.put('/api/position/:positionID/changeID', async (req, res) => {

    if (Object.keys(req.body).length === 0 ||
        Object.keys(req.params).length === 0) {
        return res.status(422).json({})
    }

    /*
    if(Object.keys(req.params).length !== 12){
      return res.status(422).json({})
    }
    */

    if (req.params.positionID == undefined || req.body.newPositionID == undefined) {
        return res.status(422).json({})
    }

    const position_id = req.params.positionID;
    const newPositionId = req.body.newPositionID;
    const aisle_id = newPositionId[0] + newPositionId[1] + newPositionId[2] + newPositionId[3];
    const row = newPositionId[4] + newPositionId[5] + newPositionId[6] + newPositionId[7];
    const col = newPositionId[8] + newPositionId[9] + newPositionId[10] + newPositionId[11];

    let x = await positionServices.changePositionID(position_id, newPositionId, aisle_id, row, col);
    if (x === false) {
        return res.status(503).json({ err: "generic error" });
    }

    if (x === 404) {
        return res.status(404).json({ err: "position not found" });
    }

    return res.status(200).json();

});

//delete

//test ok anche qui aggiungi altri if
positionRouter.delete('/api/position/:positionID', async (req, res) => {

    if (Object.keys(req.params).length === 0 || !Number(req.params.positionID)) {
        return res.status(422).json({})
    }

    const id = req.params.positionID;

    let x = await positionServices.deletePosition(id);

    if (x === false) {
        return res.status(503).json({ error: "generic error" })
    }

    return res.status(204).json();
});


module.exports = positionRouter;
