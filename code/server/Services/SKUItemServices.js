const SKUItem = require('../Modules/SKUItem');
const db = require('../Modules/DB');
const skuItem = new SKUItem(db.db);

class SKUItemServices{

    async getSKUItems(){

        let x

        try{
          x = await skuItem.getAllSKUItems();
        }catch(err){
          return false
        }
          
          return x

    }

    async getSKUItemsBySKUID(id){

        let x

        try{
        x = await skuItem.getSKUItemsBySKUId(id);
        }catch(err){
        return false
        }
        
        return x

    }

    async getSKUItemsByRFID(rfid){

        let x;
        try{
            x = await skuItem.getSKUItemByRFID(rfid);
          }catch(err){
            return false
          }
         
          return x;
    }

    async createSKUItem(data){
        
        let x
        try{
            await skuItem.createNewSKUItem(data);
          }catch(err){
            return false
          }
          
          return x
    }

    async modifySKUItem(rfid, data){

      let x;
        try{
            x = await skuItem.modifySKUItem(rfid, data);
          }catch(err){
            return false
          }
          
          return x
    }

    
    async deleteSKUItem(rfid){
    
        let x

        try{
        x = await skuItem.deleteSKUItem(rfid);
        }catch(err){
          return  false 
        }
        
        
        return x;

    }

}

module.exports = SKUItemServices;