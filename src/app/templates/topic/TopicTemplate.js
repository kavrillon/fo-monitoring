import CardTemplate from '../card/CardTemplate';
import moment from 'moment';

export default class TopicTemplate {
    constructor(data, showCards = true) {

        // Template cards
        this.template = document.querySelector('[js-template-topic]');
        this.data = data;
        this.showCards = showCards;
        this.content = this.template.cloneNode(true);

        // DOM vars
        this.cardsContainer = this.content.querySelector('[js-topic-cards]');

        // Events binding
        this.bind();

        // Content update
        this.update(this.data);

        // Displaying item
        this.content.setAttribute('js-template-topic-instance', '');
        this.content.removeAttribute('js-template-topic');
        this.content.removeAttribute('hidden');
    }

    bind() {
        const header = this.content.querySelector('[js-topic-header]');

        if (this.showCards) {
            header.classList.add('topic__header--clickable');

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
        this.content.querySelector('[js-topic-key]').textContent = data.key;
        this.content.querySelector('[js-topic-name]').textContent = data.name;
        this.content.querySelector('[js-topic-last-updated]').textContent = data.lastUpdate;
        this.content.querySelector('[js-topic-start]').textContent = moment(data.startDate).format('ll');
        this.content.querySelector('[js-topic-end]').textContent = moment(data.endDate).format('ll');
        this.content.querySelector('[js-topic-spent]').textContent = `${data.points.spent} pts`;
        this.content.querySelector('[js-topic-count]').textContent = `${data.cards.length} cards`;

        // Reset if cards exists
        this.content.querySelector('[js-topic-cards]').innerHTML = '';

        if (this.showCards) {
            data.cards.forEach((c) => {
                const card = new CardTemplate(c, false, false, true);
                this.cardsContainer.appendChild(card.getContent());
            });
        }
    }

    getContent() {
        return this.content;
    }
}
