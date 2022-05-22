class SKUItemServices{
   
      constructor(dao){
          this.skuItem = dao;
      }

    async getSKUItems(){

        let x

        try{
          x = await this.skuItem.getAllSKUItems();
        }catch(err){
          return false
        }
          
          return x

    }

    async getSKUItemsBySKUID(id){

        let x

        try{
        x = await this.skuItem.getSKUItemsBySKUId(id);
        }catch(err){
        return false
        }
        
        return x

    }

    async getSKUItemsByRFID(rfid){

        let x;
        try{
            x = await this.skuItem.getSKUItemByRFID(rfid);
          }catch(err){
            return false
          }
         
          return x;
    }

    async createSKUItem(data){
        
        let x
        try{
            await this.skuItem.createNewSKUItem(data);
          }catch(err){
            return false
          }
          
          return x
    }

    async modifySKUItem(rfid, data){

      let x;
        try{
            x = await this.skuItem.modifySKUItem(rfid, data);
          }catch(err){
            return false
          }
          
          return x
    }

    
    async deleteSKUItem(rfid){
    
        let x

        try{
        x = await this.skuItem.deleteSKUItem(rfid);
        }catch(err){
          return  false 
        }
        
        
        return x;

    }

}

module.exports = SKUItemServices;