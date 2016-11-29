import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';
import _map from 'lodash/map';
import Chart from 'chart.js';
import moment from 'moment';

export default class SupportController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.supports = this.parseDataForSupport(data);
        this.supportsList = [];

        // DOM vars
        this.supportsContainer = document.querySelector('[js-support-list]');

        this.displayData();
    }

    displayData() {
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

        const labels = _map(this.supports, 'name');
        const values = [];
        this.supports.forEach((elt) => {
            values.push(Math.round(elt.points.spent * 10 / (elt.endWeek - elt.startWeek)) / 10);
        });

        // Display chart
        new Chart(document.getElementById('ChartSupportRepartition'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ],
                        hoverBackgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ]
                    }
                ]
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    parseDataForSupport(data) {
        const supports = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'support' && c.spent > 0) {
                    const p = _find(supports, (o) => {
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

            supports.forEach((elt) => {
                elt.startWeek = moment(elt.startDate).isoWeek();
                elt.endWeek = moment(elt.endDate).isoWeek();
            });
        });

        return supports;
    }
}
