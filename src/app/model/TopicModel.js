import Model from './Model';

export default class TopicModel extends Model {
    constructor(key, data) {
        super(key);

        this.name = null;
        this.points = {
            spent: 0,
            estimated: 0
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
        return 'TopicModel-updated';
    }

    static get storeName() {
        return 'TopicModel';
    }

}
