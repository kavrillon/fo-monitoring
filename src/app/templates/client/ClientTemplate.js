import CardTemplate from '../card/CardTemplate';
import DateUtils from '../../libs/DateUtils';

export default class ClientTemplate {
    constructor(data, showCards = true) {
        // Template cards
        this.template = document.querySelector('[js-template-client]');
        this.data = data;
        this.showCards = showCards;
        this.content = this.template.cloneNode(true);

        // DOM vars
        this.cardsContainer = this.content.querySelector('[js-client-cards]');

        // Events binding
        this.bind();

        // Content update
        this.update(this.data);

        // Displaying item
        this.content.setAttribute('js-template-client-instance', '');
        this.content.removeAttribute('js-template-client');
        this.content.removeAttribute('hidden');
    }

    bind() {
        const header = this.content.querySelector('[js-client-header]');

        if (this.showCards) {
            header.classList.add('client__header--clickable');

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
        this.content.querySelector('[js-client-key]').textContent = data.key;
        this.content.querySelector('[js-client-name]').textContent = data.name;
        this.content.querySelector('[js-client-last-updated]').textContent = data.lastUpdate;

        if (data.isLive) {
            this.content.querySelector('[js-client-live]').removeAttribute('hidden');
        }

        if (data.implementationStart > 0 && data.implementationEnd > 0) {
            const diffImple = data.implementationEnd - data.implementationStart + 1;
            this.content.querySelector('[js-client-imple-weeks]').textContent = `${diffImple} week` + (diffImple > 1 ? 's' : '');
        }

        if (data.reviewStart > 0 && data.reviewEnd > 0) {
            const diffReview = data.reviewEnd - data.reviewStart + 1;
            this.content.querySelector('[js-client-review-weeks]').textContent = `${diffReview} week` + (diffReview > 1 ? 's' : '');
        }

        if (data.implementationStart > 0) {
            this.content.querySelector('[js-client-imple-start]').textContent = `W${data.implementationStart}`;
        } else {
            this.content.querySelector('[js-client-imple-start]').textContent = `No date`;
        }

        if (data.implementationEnd > 0) {
            this.content.querySelector('[js-client-imple-end]').textContent = `W${data.implementationEnd}`;
        } else {
            this.content.querySelector('[js-client-imple-end]').textContent = `No date`;
        }

        if (data.reviewStart > 0) {
            this.content.querySelector('[js-client-review-start]').textContent = `W${data.reviewStart}`;
        } else {
            this.content.querySelector('[js-client-review-start]').textContent = `No date`;
        }

        if (data.reviewEnd > 0) {
            this.content.querySelector('[js-client-review-end]').textContent = `W${data.reviewEnd}`;
        } else {
            this.content.querySelector('[js-client-review-end]').textContent = `No date`;
        }

        this.content.querySelector('[js-client-imple-value]').textContent = `${DateUtils.pointsToDays(data.points.implementation, 1, true)}`;

        if (data.points.implementation === 0) {
            this.content.querySelector('[js-client-imple]').classList.add('inactive');
        } else if (data.isImplementationHighlighted()) {
            this.content.querySelector('[js-client-imple]').classList.add('highlight');
        }

        this.content.querySelector('[js-client-review-value]').textContent = `${DateUtils.pointsToDays(data.points.review, 1, true)}`;

        if (data.points.review === 0) {
            this.content.querySelector('[js-client-review]').classList.add('inactive');
        } else if (data.isReviewHighlighted()) {
            this.content.querySelector('[js-client-review]').classList.add('highlight');
        }

        this.content.querySelector('[js-client-spent]').textContent = `${DateUtils.pointsToDays(data.points.spent, 1, true)}`;
        this.content.querySelector('[js-client-count]').textContent = `${data.cards.length} cards`;

        // Reset if cards exists
        this.content.querySelector('[js-client-cards]').innerHTML = '';

        if (this.showCards) {
            data.cards.forEach((c) => {
                const card = new CardTemplate(c, false, true, true);
                this.cardsContainer.appendChild(card.getContent());
            });
        }
    }

    getContent() {
        return this.content;
    }
}
