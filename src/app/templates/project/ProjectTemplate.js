import CardTemplate from '../card/CardTemplate';

export default class ProjectTemplate {
    constructor(data, showCards = true) {
        // Template cards
        this.template = document.querySelector('[js-template-project]');
        this.data = data;
        this.showCards = showCards;
        this.content = this.template.cloneNode(true);

        // DOM vars
        this.cardsContainer = this.content.querySelector('[js-project-cards]');

        // Events binding
        this.bind();

        // Content update
        this.update(this.data);

        // Displaying item
        this.content.setAttribute('js-template-project-instance', '');
        this.content.removeAttribute('js-template-project');
        this.content.removeAttribute('hidden');
    }

    bind() {
        const header = this.content.querySelector('[js-project-header]');

        if (this.showCards) {
            header.classList.add('project__header--clickable');

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
        this.content.querySelector('[js-project-key]').textContent = data.key;
        this.content.querySelector('[js-project-name]').textContent = data.name;
        this.content.querySelector('[js-project-last-updated]').textContent = data.lastUpdate;

        if (data.implementationStart > 0) {
            this.content.querySelector('[js-project-imple-start]').textContent = `W${data.implementationStart}`;
        } else {
            this.content.querySelector('[js-project-imple-start]').textContent = `No date`;
        }

        if (data.implementationEnd > 0) {
            this.content.querySelector('[js-project-imple-end]').textContent = `W${data.implementationEnd}`;
        } else {
            this.content.querySelector('[js-project-imple-end]').textContent = `No date`;
        }

        if (data.reviewStart > 0) {
            this.content.querySelector('[js-project-review-start]').textContent = `W${data.reviewStart}`;
        } else {
            this.content.querySelector('[js-project-review-start]').textContent = `No date`;
        }

        if (data.reviewEnd > 0) {
            this.content.querySelector('[js-project-review-end]').textContent = `W${data.reviewEnd}`;
        } else {
            this.content.querySelector('[js-project-review-end]').textContent = `No date`;
        }

        this.content.querySelector('[js-project-imple-value]').textContent = `${data.points.implementation} pts`;

        if (data.points.implementation === 0) {
            this.content.querySelector('[js-project-imple]').classList.add('inactive');
        } else if (data.isImplementationHighlighted()) {
            this.content.querySelector('[js-project-imple]').classList.add('highlight');
        }

        this.content.querySelector('[js-project-review-value]').textContent = `${data.points.review} pts`;

        if (data.points.review === 0) {
            this.content.querySelector('[js-project-review]').classList.add('inactive');
        } else if (data.isReviewHighlighted()) {
            this.content.querySelector('[js-project-review]').classList.add('highlight');
        }

        this.content.querySelector('[js-project-spent]').textContent = `${data.points.spent} pts`;
        this.content.querySelector('[js-project-count]').textContent = `${data.cards.length} cards`;

        // Reset if cards exists
        this.content.querySelector('[js-project-cards]').innerHTML = '';

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
