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
        let impleStart = 'No date', impleEnd = 'No date',
            reviewStart = 'No date', reviewEnd = 'No date';

        this.content.querySelector('[js-client-key]').textContent = data.key;
        this.content.querySelector('[js-client-name]').textContent = data.name;
        this.content.querySelector('[js-client-last-updated]').textContent = data.lastUpdate;

        if (data.isLive) {
            this.content.querySelector('[js-client-live-link]').setAttribute('href', data.urlLive);
            this.content.querySelector('[js-client-live]').removeAttribute('hidden');


            if (data.versionLive) {
                this.content.querySelector('[js-client-version]').classList.add(data.versionLive.toLowerCase());
                this.content.querySelector('[js-client-version]').innerHTML = data.versionLive.toString();
                this.content.querySelector('[js-client-version]').removeAttribute('hidden');
            }
        }

        if (data.implementationStart !== 0) {
            impleStart = DateUtils.getWeekFormat(data.implementationStart);
        }

        if (data.implementationEnd !== 0) {
            impleEnd = DateUtils.getWeekFormat(data.implementationEnd);
        }

        if (data.implementationStart !== 0 && data.implementationEnd !== 0) {
            const diffImple = DateUtils.getDiffWeeks(data.implementationStart, data.implementationEnd);
            this.content.querySelector('[js-client-imple-weeks]').textContent = `${diffImple} week` + (diffImple > 1 ? 's' : '');
        }

        this.content.querySelector('[js-client-imple-start]').textContent = impleStart;
        this.content.querySelector('[js-client-imple-end]').textContent = impleEnd;

        if (data.reviewStart !== 0) {
            reviewStart = DateUtils.getWeekFormat(data.reviewStart);
        }

        if (data.reviewEnd !== 0) {
            reviewEnd = DateUtils.getWeekFormat(data.reviewEnd);
        }

        if (data.reviewStart !== 0 && data.reviewEnd !== 0) {
            const diffReview = DateUtils.getDiffWeeks(data.reviewStart, data.reviewEnd);
            this.content.querySelector('[js-client-review-weeks]').textContent = `${diffReview} week` + (diffReview > 1 ? 's' : '');
        }


        this.content.querySelector('[js-client-review-start]').textContent = reviewStart;
        this.content.querySelector('[js-client-review-end]').textContent = reviewEnd;


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
                const card = new CardTemplate(c, true, true, true, false);
                this.cardsContainer.appendChild(card.getContent());
            });
        }
    }

    getContent() {
        return this.content;
    }
}
