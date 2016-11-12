import Model from './Model';

export default class WeekModel extends Model {
    constructor(key, data) {
        super(key);
        this.points = null;
        this.startDate = null;
        this.endDate = null;
        this.cards = [];

        if (data) {
            Object.assign(this, data);
        }
    }

    static get UPDATED() {
        return 'WeekModel-updated';
    }

    static get storeName() {
        return 'WeekModel';
    }

}
