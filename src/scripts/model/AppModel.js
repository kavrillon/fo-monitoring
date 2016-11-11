import Model from './Model';

export default class AppModel extends Model {
    constructor(key, data) {
        super(key);
        this.firstRun = true;
        this.token = null;
        this.preferences = {};

        if (data) {
            Object.assign(this, data);
        }
    }

    static get UPDATED() {
        return 'AppModel-updated';
    }

    static get storeName() {
        return 'AppModel';
    }

}
