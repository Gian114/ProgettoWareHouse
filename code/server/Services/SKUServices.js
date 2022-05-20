'use strict'
const db = require('../Modules/DB');
const SKU = require('../Modules/SKU');
const sku = new SKU(db.db);
const Position = require('../Modules/Position')
const pos = new Position(db.db)

class SKUServices{

    async getSKUs(){

        let x = '';
        try{
             x = await sku.getListofSKU();
        } catch(err){
            return false;
        }
        return x
    }

    async getSKU(id){
        let x = ''
        try{
            x = await sku.getSKUByID(id);
         
        }catch(err){
           return false
        }

        return x
    }

    async createSKU(data){
        let x

        try{
        
            x = await sku.createSKU(data);
        }catch(err){
            return false
        }
        
       return x

    }

    async modifySKU(id, data){
        let x
        try{
            let x = await sku.modifySKU(id, data);
        }catch(err){
            return false
        }
        return x
       
    }

    async modifyPosition(res, id, positionID){

    let s;
    let p;
    let status;
    let data;

    try{
        s = await sku.getSKUByID(id);
    }catch(err){
        console.log(err)
        return res.status(503).json({err:"generic error"})
    }

    if(s == ''){
        return res.status(404).json({err: "sku does not exist"})
    } else {
        
        try {
            p = await pos.getPosition(positionID)
        } catch(err){
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
                    console.log(err)
                    return res.status(503).json({err:"generic error"})
                }

               try{
                await sku.modifyPosition(id, positionID)
               }catch(err){
                console.log(err)
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
    }

    async deleteSKU(id){

        let x
        try{
            x = await sku.deleteSKU(id);
        }catch(err){
            return false
        }
    
        return x
    }

}

module.exports = SKUServices;