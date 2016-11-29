import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class SupportController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.supports = this.parseDataForSupport(data);
        this.supportsList = [];

        // DOM vars
        this.supportsContainer = document.querySelector('[js-support-list]');

        // Displaying supports
        _orderBy(this.supports, 'name').forEach((p) => {
            let support = null;

            if (!this.supportsList[p.key]) {
                support = new TopicTemplate(p);
                this.supportsContainer.appendChild(support.getContent());
            } else {
                support = this.supportsList[p.key];
                support.update(p);
            }

            this.supportsList[p.key] = support;
        });

        document.querySelector('[js-support-count]').innerHTML = `${this.supports.length} topics`;
    }

    parseDataForSupport(data) {
        let supports = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'support' && c.spent > 0) {
                    let p = _find(supports, (o) => {
                        return o.key === c.project;
                    });

                    if (p) {
                        p.cards.push(c);
                        p.points.estimated += c.estimated;
                        p.points.spent += c.spent;

                        if (p.startDate > starts) {
                            p.startDate = starts;
                        }
                        if (p.endDate < ends) {
                            p.endDate = ends;
                        }
                        p.lastUpdate = new Date();
                    } else {
                        const newSupport = new TopicModel(c.project, {
                            cards: [c],
                            name: c.project,
                            points: {
                                spent: c.spent,
                                estimated: c.estimated
                            },
                            startDate: starts,
                            endDate: ends,
                            lastUpdate: new Date()
                        });

                        supports.push(newSupport);
                    }
                }
            });
        });

        return supports;
    }
}
