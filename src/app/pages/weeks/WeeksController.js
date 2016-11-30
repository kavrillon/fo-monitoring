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
        const monitoringPercents = _map(this.weeks, 'activity.monitoring');
        let monitoringAvg = 0;
        monitoringPercents.forEach((elt) => {
            monitoringAvg += elt;
        });
        monitoringAvg = Math.round(monitoringAvg / monitoringPercents.length);

        const deliveryPercents = _map(this.weeks, 'activity.delivery');
        let deliveryAvg = 0;
        deliveryPercents.forEach((elt) => {
            deliveryAvg += elt;
        });
        deliveryAvg = Math.round(deliveryAvg / deliveryPercents.length);

        const supportPercents = _map(this.weeks, 'activity.support');
        let supportAvg = 0;
        supportPercents.forEach((elt) => {
            supportAvg += elt;
        });
        supportAvg = Math.round(supportAvg / supportPercents.length);

        const productPercents = _map(this.weeks, 'activity.product');
        let productAvg = 0;
        productPercents.forEach((elt) => {
            productAvg += elt;
        });
        productAvg = Math.round(productAvg / productPercents.length);

        document.querySelector('[js-weeks-globals-monitoring]').innerHTML = `${monitoringAvg}%`;
        document.querySelector('[js-weeks-globals-support]').innerHTML = `${supportAvg}%`;
        document.querySelector('[js-weeks-globals-delivery]').innerHTML = `${deliveryAvg}%`;
        document.querySelector('[js-weeks-globals-product]').innerHTML = `${productAvg}%`;
    }

    displayWeeks() {
        document.querySelector('[js-weeks-count]').innerHTML = `${this.weeks.length} weeks`;

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
