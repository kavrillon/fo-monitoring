import Model from './Model';

export default class CardModel extends Model {
    constructor(key, data) {
        super(key);

        this.week = null;
        this.name = null;
        this.type = null;
        this.subtype = null;
        this.project = null;
        this.url = null;
        this.labels = [];
        this.estimated = 0;
        this.spent = 0;

        if (data) {
            Object.assign(this, data);
        }
    }

    static get UPDATED() {
        return 'CardModel-updated';
    }

    static get storeName() {
        return 'CardModel';
    }

}
