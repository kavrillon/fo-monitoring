import CardTemplate from '../card/CardTemplate';
import moment from 'moment';

export default class WeekTemplate {
    constructor(data, showCards = true) {
        // Template vars
        this.template = document.querySelector('[js-template-week]');
        this.data = data;
        this.showCards = showCards;
        this.content = this.template.cloneNode(true);

        // DOM vars
        this.cardsContainer = this.content.querySelector('[js-week-cards]');

        // Events binding
        this.bind();

        // Content update
        this.update(this.data);

        // Displaying item
        this.content.setAttribute('js-template-week-instance', '');
        this.content.removeAttribute('js-template-week');
        this.content.removeAttribute('hidden');
    }

    bind() {
        const header = this.content.querySelector('[js-week-header]');

        if (this.showCards) {
            header.classList.add('week__header--clickable');

            header.addEventListener('click', () => {
                if (this.content.classList.contains('active')) {
                    this.content.classList.remove('active');
                } else {
                    this.content.classList.add('active');
                }
            });
        }
    }

    update(data) {
        this.content.querySelector('[js-week-key]').textContent = data.key;
        this.content.querySelector('[js-week-last-updated]').textContent = data.lastUpdate;
        this.content.querySelector('[js-week-start]').textContent = moment(data.startDate).format('MMM DD');
        this.content.querySelector('[js-week-end]').textContent = moment(data.endDate).format('ll');
        this.content.querySelector('[js-week-count]').textContent = `${data.cards.length} cards`;
        this.content.querySelector('[js-week-available]').textContent = `${data.points.available} pts`;
        this.content.querySelector('[js-week-spent]').textContent = `${data.points.spent} pts`;

        this.content.querySelector('[js-week-product]').textContent = `${data.points.product} pts`;
        this.content.querySelector('[js-week-support]').textContent = `${data.points.support} pts`;
        this.content.querySelector('[js-week-monitoring]').textContent = `${data.points.monitoring} pts`;
        this.content.querySelector('[js-week-delivery]').textContent = `${data.points.delivery} pts`;

        this.content.querySelector('[js-week-delivery-percent]').textContent = `${Math.round(data.activity.delivery)}%`;
        this.content.querySelector('[js-week-product-percent]').textContent = `${Math.round(data.activity.product)}%`;
        this.content.querySelector('[js-week-monitoring-percent]').textContent = `${Math.round(data.activity.monitoring)}%`;
        this.content.querySelector('[js-week-support-percent]').textContent = `${Math.round(data.activity.support)}%`;

        // Reset if cards exists
        this.content.querySelector('[js-week-cards]').innerHTML = '';

        if (this.showCards) {
            data.cards.forEach((c) => {
                const card = new CardTemplate(c, true, true, false);
                this.cardsContainer.appendChild(card.getContent());
            });
        }
    }

    getContent() {
        return this.content;
    }
}
