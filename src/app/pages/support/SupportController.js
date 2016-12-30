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
        this.supports = this.parseData(data);
        this.supportsList = [];

        // DOM vars
        this.supportsContainer = document.querySelector('[js-support-list]');

        this.displayData();
    }

    displayData() {
        // Displaying supports
        _orderBy(this.supports.list, 'name').forEach((p) => {
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

        // Displaying chart

        let datasets = [];
        const step = .5 / this.supports.sets.length;
        let borderStep = 1 / this.supports.sets.length;
        let opacity = 0;
        let opacityBorder = 0;

        _orderBy(this.supports.sets, 'label').forEach((s) => {
            opacity += step;
            opacityBorder += borderStep;

            // Days conversion
            s.data = _map(s.data, (d) => {
                return DateUtils.pointsToDays(d);
            });

            datasets.push(Object.assign(s, {
                backgroundColor: `rgba(68,210,121,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(68,210,121,${opacityBorder})`,
                pointRadius: 1
            }));
        });

        new Chart(document.getElementById('ChartSupportRepartition'), {
            type: 'line',
            data: {
                labels: this.supports.labels,
                datasets: datasets
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    parseData(data) {
        const supports = {
            list: [],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            sets: []
        };

        data.forEach((w) => {
            const monthKey = parseInt(moment(w.startDate).format('M')) - 1;
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'support' && c.spent > 0) {

                    // Add to support list
                    let p = _find(supports.list, (o) => {
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
                        p = new TopicModel(c.project, {
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

                        supports.list.push(p);
                    }

                    // Add to chart set
                    let s = _find(supports.sets, (o) => {
                        return o.label === c.project;
                    });

                    if (!s) {
                        s = {
                            label: c.project,
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        };

                        s.data[monthKey] += c.spent;
                        supports.sets.push(s);
                    } else {
                        s.data[monthKey] += c.spent;
                    }
                }
            });

            supports.list.forEach((elt) => {
                elt.startWeek = moment(elt.startDate).isoWeek();
                elt.endWeek = moment(elt.endDate).isoWeek();
            });
        });

        return supports;
    }
}
