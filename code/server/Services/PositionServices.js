'use strict'
class PositionServices {

    constructor(dao) {
        this.position = dao
    }

    async getPosition() {

        let x = '';

        try {
            x = await this.position.getAllPosition()
        } catch (err) {
            return false;
        }

        return x;
    }

    async addPosition(item) {
        try {
            await this.position.createNewPosition(item);
        } catch (err) {
            console.log(err);
            return false;
        }

        return 201;
    }

    async changePosition(pos_id, data, newPos_id) {
        let x;

        let y = await this.position.getPositionByID(pos_id);
        if (y === '') {
            return 404;
        }


        try {
            x = await this.position.modifyPosition(pos_id, data, newPos_id);
        } catch (err) {
            return false
        }

        return x;

    }

    async changePositionID(pos_id, newPos_id, new_aisle, new_row, new_col) {
        let x;

        let y = await this.position.getPositionByID(pos_id);
        if (y === '') {
            return 404;
        }

        try {
            x = await this.position.modifyPositionID(pos_id, newPos_id, new_aisle, new_row, new_col);
        } catch (err) {
            return false;
        }

    }

    async deletePosition(id) {
        let x

        let y = await this.position.getPositionByID(id);
        if (y === '') {
            return 404;
        }

        try {
            x = await this.position.deletePosition(id);
        } catch (err) {
            return false;
        }
        return true;

    }

}

module.exports = PositionServices