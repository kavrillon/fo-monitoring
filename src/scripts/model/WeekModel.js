import Model from './Model';

export default class WeekModel extends Model {
    constructor(key, data) {
        super(key);
        this.points = null;
        this.startDate = null;
        this.endDate = null;
        this.availablePoints = 0;
        this.estimatedPoints = 0;
        this.spentPoints = 0;
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
