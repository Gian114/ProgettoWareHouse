'use strict'

const db = require('../Modules/DB');

class PositionServices {

    constructor(dao) {
        this.position = dao
    }

    async getPosition() {

        let x = '';

        try {
            x = await this.getPosition()
        } catch (err) {
            return false;
        }

        return x;
    }

    async createPosition(item) {

        let x = '';
        try {
            await this.createNewPosition(item);
        } catch (err) {
            return false;
        }

        return x
    }

    async changePosition(pos_id, data, newPos_id) {
        let x;

        try {
            x = await this.modifyPosition(pos_id, data, newPos_id);
        } catch (err) {
            return false
        }

        if (x === false) {
            return 404;
        }

        return x;

    }

    async changePositionID(pos_id, newPos_id) {
        let x;
        try {
            x = await this.modifyPositionID(pos_id, newPos_id);
        } catch (err) {
            return false;
        }

        if (x === false) {
            return 404;
        }

    }

    async deletePosition(id) {
        let x
        try {
            x = await this.deletePosition(id);
        } catch (err) {
            return false;
        }

        if (x === false) {
            return 404;
        }
    }

}

module.exports = PositionServices