import Model from './Model';

export default class WeekModel extends Model {
    constructor(key, data) {
        super(key);
        this.year = 0;
        this.number = 0;
        this.points = {
            available: 0,
            estimated: 0,
            product: 0,
            process: 0,
            support: 0,
            project: 0,
            spent: 0
        };
        this.activity = {
            product: 0,
            process: 0,
            support: 0,
            project: 0,
            total: 0
        };
        this.startDate = null;
        this.endDate = null;
        this.lastUpdate = null;
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
