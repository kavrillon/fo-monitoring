import Controller from '../../libs/Controller';
import WeekTemplate from '../../templates/week/WeekTemplate';
import _map from 'lodash/map';

export default class WeeksController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.weeks = data;
        this.weeksList = [];

        // DOM vars
        this.weeksContainer = document.querySelector('[js-weeks-list]');

        this.displayGlobalActivities();
        this.displayWeeks();
    }

    displayGlobalActivities() {
        const spentPoints = _map(this.weeks, 'points.spent');
        let spentAvgPoints = 0;

        spentPoints.forEach((elt) => {
            spentAvgPoints += elt;
        });
        spentAvgPoints = Math.round(spentAvgPoints / spentPoints.length);

        const processPercents = _map(this.weeks, 'activity.process');
        const processPoints = _map(this.weeks, 'points.process');
        let processAvg = 0;
        let processAvgPoints = 0;

        processPercents.forEach((elt) => {
            processAvg += elt;
        });
        processAvg = Math.round(processAvg / processPercents.length);

        processPoints.forEach((elt) => {
            processAvgPoints += elt;
        });
        processAvgPoints = Math.round(processAvgPoints / processPoints.length);

        const projectPercents = _map(this.weeks, 'activity.project');
        let projectAvg = 0;
        let projectAvgPoints = 0;
        const projectPoints = _map(this.weeks, 'points.project');

        projectPercents.forEach((elt) => {
            projectAvg += elt;
        });
        projectAvg = Math.round(projectAvg / projectPercents.length);

        projectPoints.forEach((elt) => {
            projectAvgPoints += elt;
        });
        projectAvgPoints = Math.round(projectAvgPoints / projectPoints.length);

        const supportPercents = _map(this.weeks, 'activity.support');
        let supportAvg = 0;
        const supportPoints = _map(this.weeks, 'points.support');
        let supportAvgPoints = 0;

        supportPercents.forEach((elt) => {
            supportAvg += elt;
        });
        supportAvg = Math.round(supportAvg / supportPercents.length);

        supportPoints.forEach((elt) => {
            supportAvgPoints += elt;
        });
        supportAvgPoints = Math.round(supportAvgPoints / supportPoints.length);

        const productPercents = _map(this.weeks, 'activity.product');
        let productAvg = 0;
        const productPoints = _map(this.weeks, 'points.product');
        let productAvgPoints = 0;

        productPercents.forEach((elt) => {
            productAvg += elt;
        });
        productAvg = Math.round(productAvg / productPercents.length);

        productPoints.forEach((elt) => {
            productAvgPoints += elt;
        });
        productAvgPoints = Math.round(productAvgPoints / productPoints.length);

        document.querySelector('[js-weeks-velocity]').innerHTML = `Velocity: ${spentAvgPoints} pts`;
        document.querySelector('[js-weeks-count]').innerHTML = `${this.weeks.length} weeks`;

        document.querySelector('[js-weeks-globals-process]').innerHTML = `${processAvg}%`;
        document.querySelector('[js-weeks-globals-support]').innerHTML = `${supportAvg}%`;
        document.querySelector('[js-weeks-globals-project]').innerHTML = `${projectAvg}%`;
        document.querySelector('[js-weeks-globals-product]').innerHTML = `${productAvg}%`;

        document.querySelector('[js-weeks-globals-process-points]').innerHTML = `${processAvgPoints} pts`;
        document.querySelector('[js-weeks-globals-support-points]').innerHTML = `${supportAvgPoints} pts`;
        document.querySelector('[js-weeks-globals-project-points]').innerHTML = `${projectAvgPoints} pts`;
        document.querySelector('[js-weeks-globals-product-points]').innerHTML = `${productAvgPoints} pts`;
    }

    displayWeeks() {
        // Displaying weeks
        this.weeks.forEach((w) => {
            let week = null;

            if (!this.weeksList[w.key]) {
                week = new WeekTemplate(w);
                this.weeksContainer.appendChild(week.getContent());
            } else {
                week = this.weeksList[w.key];
                week.update(w);
            }

            this.weeksList[w.key] = week;
        });
    }
}
