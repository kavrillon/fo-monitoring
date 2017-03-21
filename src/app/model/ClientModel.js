import Model from './Model';

export default class ClientModel extends Model {
    constructor(key, data) {
        super(key);

        this.highlights = {
            implementation: 15,
            review: 10
        };

        this.name = null;
        this.points = {
            spent: 0,
            estimated: 0,
            feature: 0,
            update: 0,
            bug: 0,
            consulting: 0,
            implementation: 0,
            review: 0
        };
        this.version = null;
        this.isLive = false;
        this.urlLive = null;
        this.implementationStart = 0;
        this.implementationEnd = 0;
        this.reviewStart = 0;
        this.reviewEnd = 0;
        this.cards = [];
        this.lastUpdate = null;

        if (data) {
            Object.assign(this, data);
        }
    }

    static get UPDATED() {
        return 'ClientModel-updated';
    }

    static get storeName() {
        return 'ClientModel';
    }

    isImplementationHighlighted() {
        return this.points.implementation > this.highlights.implementation;
    }

    isReviewHighlighted() {
        return this.points.review > this.highlights.review;
    }

}
