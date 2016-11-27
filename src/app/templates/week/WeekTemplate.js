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
        this.update();

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
        this.content.querySelector('[js-week-key]').textContent = this.data.key;
        this.content.querySelector('[js-week-last-updated]').textContent = this.data.lastUpdate;
        this.content.querySelector('[js-week-start]').textContent = moment(this.data.startDate).format('MMM DD');
        this.content.querySelector('[js-week-end]').textContent = moment(this.data.endDate).format('ll');
        this.content.querySelector('[js-week-count]').textContent = `${this.data.cards.length} cards`;
        this.content.querySelector('[js-week-available]').textContent = `${this.data.points.available} pts`;
        this.content.querySelector('[js-week-spent]').textContent = `${this.data.points.spent} pts`;

        this.content.querySelector('[js-week-product]').textContent = `${this.data.points.product} pts`;
        this.content.querySelector('[js-week-support]').textContent = `${this.data.points.support} pts`;
        this.content.querySelector('[js-week-monitoring]').textContent = `${this.data.points.monitoring} pts`;
        this.content.querySelector('[js-week-delivery]').textContent = `${this.data.points.delivery} pts`;

        this.content.querySelector('[js-week-delivery-percent]').textContent = `${Math.round(this.data.activity.delivery)}%`;
        this.content.querySelector('[js-week-product-percent]').textContent = `${Math.round(this.data.activity.product)}%`;
        this.content.querySelector('[js-week-monitoring-percent]').textContent = `${Math.round(this.data.activity.monitoring)}%`;
        this.content.querySelector('[js-week-support-percent]').textContent = `${Math.round(this.data.activity.support)}%`;

        // Reset if cards exists
        this.content.querySelector('[js-week-cards]').innerHTML = '';

        if (this.showCards) {
            this.data.cards.forEach((c) => {
                const card = new CardTemplate(c);
                this.cardsContainer.appendChild(card.getContent());
            });
        }
    }

    getContent() {
        return this.content;
    }
}
