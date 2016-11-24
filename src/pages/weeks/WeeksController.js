import Controller from '../../libs/Controller';
import moment from 'moment';

export default class WeekController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.data = data;
        this.weeksCards = [];

        // DOM vars
        this.weekList = document.querySelector('[js-weeks-list]');
        this.cardTemplate = document.querySelector('[js-template-card]');
        this.weekTemplate = document.querySelector('[js-template-week]');

        this.init();
    }

    init() {
        this.data.weeks.forEach((w) => {
            this.createOrUpdateWeekCard(w);
        });
    }

    createOrUpdateWeekCard(w) {
        let week = null;

        if (!this.weeksCards[w.key]) {
            week = this.weekTemplate.cloneNode(true);
            this.weekList.appendChild(week);

            week.querySelector('[js-week-header]').addEventListener('click', () => {
                if (week.classList.contains('active')) {
                    week.classList.remove('active');
                } else {
                    week.classList.add('active');
                }
            });
        } else {
            week = this.weeksCards[w.key];
            week.querySelectorAll('[js-template-card]').forEach((elt) => {
                elt.outerHTML = '';
            });
        }

        week.querySelector('[js-week-key]').textContent = w.key;
        week.querySelector('[js-week-last-updated]').textContent = w.lastUpdate;
        week.querySelector('[js-week-start]').textContent = moment(w.startDate).format('MMM DD');
        week.querySelector('[js-week-end]').textContent = moment(w.endDate).format('ll');
        week.querySelector('[js-week-count]').textContent = `${w.cards.length} cards`;
        week.querySelector('[js-week-available]').textContent = `${w.points.available} pts`;
        week.querySelector('[js-week-spent]').textContent = `${w.points.spent} pts`;

        week.querySelector('[js-week-product]').textContent = `${w.points.product} pts`;
        week.querySelector('[js-week-support]').textContent = `${w.points.support} pts`;
        week.querySelector('[js-week-monitoring]').textContent = `${w.points.monitoring} pts`;
        week.querySelector('[js-week-delivery]').textContent = `${w.points.delivery} pts`;

        week.querySelector('[js-week-delivery-percent]').textContent = `${Math.round(w.activity.delivery)}%`;
        week.querySelector('[js-week-product-percent]').textContent = `${Math.round(w.activity.product)}%`;
        week.querySelector('[js-week-monitoring-percent]').textContent = `${Math.round(w.activity.monitoring)}%`;
        week.querySelector('[js-week-support-percent]').textContent = `${Math.round(w.activity.support)}%`;

        w.cards.forEach((c) => {
            const card = this.cardTemplate.cloneNode(true);

            card.querySelector('[js-card-name]').textContent = `${c.name}`;
            card.querySelector('[js-card-name]').setAttribute('href', `${c.url}`);
            card.querySelector('[js-card-type]').textContent = `${c.type}`;
            card.querySelector('[js-card-type]').classList.add(`card__type__value--${c.type.toLowerCase()}`);
            card.querySelector('[js-card-spent]').textContent = `${c.spent} pts`;

            week.querySelector('[js-week-cards]').appendChild(card);
        });

        week.removeAttribute('hidden');
        this.weeksCards[w.key] = week;
    }
}
