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
        this.implementationStart = 0;
        this.implementationEnd = 0;
        this.implementationHighlighted = false;
        this.reviewStart = 0;
        this.reviewEnd = 0;
        this.reviewHighlighted = false;
        this.cards = [];
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

    isImplementationHighlighted() {
        return this.points.implementation > 15;
    }

    isReviewHighlighted() {
        return this.points.review > 10;
    }

}
