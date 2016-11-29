import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class MonitoringController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.monitorings = this.parseDataForMonitoring(data);
        this.monitoringsList = [];

        // DOM vars
        this.monitoringsContainer = document.querySelector('[js-monitoring-list]');

        // Displaying monitorings
        _orderBy(this.monitorings, 'name').forEach((p) => {
            let monitoring = null;

            if (!this.monitoringsList[p.key]) {
                monitoring = new TopicTemplate(p);
                this.monitoringsContainer.appendChild(monitoring.getContent());
            } else {
                monitoring = this.monitoringsList[p.key];
                monitoring.update(p);
            }

            this.monitoringsList[p.key] = monitoring;
        });

        document.querySelector('[js-monitoring-count]').innerHTML = `${this.monitorings.length} topics`;
    }

    parseDataForMonitoring(data) {
        let monitorings = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'monitoring' && c.spent > 0) {
                    let p = _find(monitorings, (o) => {
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
                        const newMonitoring = new TopicModel(c.project, {
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

                        monitorings.push(newMonitoring);
                    }
                }
            });
        });

        return monitorings;
    }
}
