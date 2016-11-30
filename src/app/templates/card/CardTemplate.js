export default class CardTemplate {
    constructor(data, showType = false, showSubtype = false, showWeek = false) {
        this.template = document.querySelector('[js-template-card]');
        this.data = data;
        this.content = this.template.cloneNode(true);

        this.content.querySelector('[js-card-name]').textContent = `${this.data.name}`;
        this.content.querySelector('[js-card-name]').setAttribute('href', `${this.data.url}`);
        this.content.querySelector('[js-card-name]').setAttribute('title', `${this.data.name}`);

        if (showType) {
            this.content.querySelector('[js-card-type]').removeAttribute('hidden');
            this.content.querySelector('[js-card-type]').textContent = `${this.data.type}`;
            this.content.querySelector('[js-card-type]').classList.add(`card__type__value--${this.data.type.toLowerCase()}`);
        }

        if (showSubtype) {
            this.content.querySelector('[js-card-subtype]').removeAttribute('hidden');

            if (this.data.subtype) {
                this.content.querySelector('[js-card-subtype]').textContent = `${this.data.subtype}`;
            }
        }

        if (showWeek) {
            this.content.querySelector('[js-card-week]').removeAttribute('hidden');
            this.content.querySelector('[js-card-week]').textContent = `${this.data.week}`;
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
