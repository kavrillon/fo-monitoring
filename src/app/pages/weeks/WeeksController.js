import Controller from '../../libs/Controller';
import WeekTemplate from '../../templates/week/WeekTemplate';

export default class WeeksController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.weeks = data;
        this.weeksList = [];

        // DOM vars
        this.weeksContainer = document.querySelector('[js-weeks-list]');

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

        document.querySelector('[js-weeks-count]').innerHTML = `${this.weeks.length} weeks`;

    }
}
