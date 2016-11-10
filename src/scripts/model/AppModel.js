import Model from './Model';

export default class AppModel extends Model {
    constructor(data, key) {
        super(key);
        this.firstRun = true;
        this.preferences = {};
    }

    static get UPDATED() {
        return 'AppModel-updated';
    }

    static get storeName() {
        return 'AppModel';
    }

}
