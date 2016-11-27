import Model from './Model';

export default class ProjectModel extends Model {
    constructor(key, data) {
        super(key);

        this.name = null;
        this.points = {
            spent: 0,
            estimated: 0,
            implementation: 0,
            review: 0
        };
        this.cards = [];
        this.startDate = null;
        this.endDate = null;
        this.lastUpdate = null;

        if (data) {
            Object.assign(this, data);
        }
    }

    static get UPDATED() {
        return 'ProjectModel-updated';
    }

    static get storeName() {
        return 'ProjectModel';
    }

}
