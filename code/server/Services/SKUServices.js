class SKUServices{

    constructor(sku, pos){
        this.sku = sku
        this.pos = pos
    }

    async getSKUs(){

        let x;
        try{
          
            x = await this.sku.getListofSKU();
            
        } catch(err){
            return false;
        }
      
        return x
    }

    async getSKU(id){
        let x = ''
        try{
            x = await this.sku.getSKUByID(id);
         
        }catch(err){
           return false
        }

        return x
    }

    async createSKU(data){
        let x

        try{
        
            x = await this.sku.createSKU(data);
        }catch(err){
            return false
        }
        
       return x

    }

    async modifySKU(id, data){
        let x
        try{
             x = await this.sku.modifySKU(id, data);
        }catch(err){
            return false
        }
        return x
       
    }

    async modifyPosition(id, positionID){

    let s;
    let p;
    let status;
    let data;

    try{
        s = await this.sku.getSKUByID(id);
    }catch(err){
        return false
    }

    if(s == ''){
        return 404
    } else {
        
        try {
            p = await this.pos.getPositionByID(positionID)
        } catch(err){
            return false
        }

        if(p == ''){
            return 4042
        } else {

            if((p.max_weight - p.occupied_weight) >= s.weight*s.quantity && (p.max_volume - p.occupied_volume) >= s.volume*s.quantity){
                
                data = {
                    weight : s.weight*s.quantity,
                    volume : s.volume*s.quantity
                }

                try{
                    status = await this.pos.occupyPosition(positionID, data)
                }catch(err){
                    return false
                }

               try{
                await this.sku.modifyPosition(id, positionID)
               }catch(err){
                return false
               }
               return 200

            } else if(p.max_weight >= s.weight*s.quantity &&  p.max_volume >= s.volume*s.quantity) {
                return 422
            } else {
                return 4222
            }
        }
    }
    }

    async deleteSKU(id){

        let x
        try{
            x = await this.sku.deleteSKU(id);
        }catch(err){
            return false
        }
    
        return x
    }

}

module.exports = SKUServices;