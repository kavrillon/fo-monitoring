import DateUtils from '../../libs/DateUtils';

export default class CardTemplate {
    constructor(data, showType = false, showLabels = false, showWeek = false, showVersion = true) {
        this.template = document.querySelector('[js-template-card]');
        this.data = data;
        this.content = this.template.cloneNode(true);

        this.content.querySelector('[js-card-name]').textContent = `${this.data.name}`;
        this.content.querySelector('[js-card-name]').setAttribute('href', `${this.data.url}`);
        this.content.querySelector('[js-card-name]').setAttribute('title', `${this.data.name}`);

        if (showVersion) {
            this.content.querySelector('[js-card-version]').removeAttribute('hidden');

            if (this.data.version) {
                this.content.querySelector('[js-card-version-value]').textContent = `${this.data.version}`;
                this.content.querySelector('[js-card-version-value]').classList.add(`card__version__value--${this.data.version}`);
                this.content.querySelector('[js-card-version-value]').removeAttribute('hidden');
            }
        }

        if (showType && this.data.type) {
            this.content.querySelector('[js-card-type]').removeAttribute('hidden');
            this.content.querySelector('[js-card-type]').setAttribute('title', `${this.data.type}`);
            this.content.querySelector('[js-card-type]').classList.add(`card__name__type--${this.data.type.toLowerCase()}`);
        }

        if (showLabels) {
            this.data.labels.forEach((l) => {
                this.content.querySelector('[js-card-labels]').textContent = this.content.querySelector('[js-card-labels]').textContent + `${l} `;
            });

            this.content.querySelector('[js-card-labels]').removeAttribute('hidden');
        }

        if (showWeek) {
            this.content.querySelector('[js-card-week]').removeAttribute('hidden');
            this.content.querySelector('[js-card-week]').textContent = DateUtils.getWeekFormat(this.data.week);
        }

        this.content.querySelector('[js-card-spent]').textContent = `${this.data.spent} pts`;

        this.content.setAttribute('js-template-card-instance', '');
        this.content.removeAttribute('js-template-card');
        this.content.removeAttribute('hidden');
    }

    getContent() {
        return this.content;
    }
}
