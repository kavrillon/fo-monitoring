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

        const datasets = [];
        const step = .5 / this.supports.sets.length;
        const borderStep = 1 / this.supports.sets.length;
        let opacity = 0, opacityBorder = 0;

        const total = Array(this.supports.labels.length).fill(0);

        _orderBy(this.supports.sets, 'label').forEach((s) => {
            opacity += step;
            opacityBorder += borderStep;

            // Days conversion
            s.data = _map(s.data, (d) => {
                return DateUtils.pointsToDays(d);
            });

            s.data.forEach((value, key) => {
                total[key] += value;
            });

            datasets.push(Object.assign(s, {
                backgroundColor: `rgba(68,210,121,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(68,210,121,${opacityBorder})`,
                pointRadius: 1
            }));
        });

        datasets.push({
            label: 'Total',
            data: total,
            tooltip: false,
            fill: false,
            borderWidth: 1,
            borderColor: '#cc0000',
            pointRadius: 1
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

    getChartLabels(data) {
        const labels = [];

        _orderBy(data, 'key').forEach((w) => {
            const matches = w.key.match(/^(\d+)-(\d+)/);

            if (matches && matches.length > 0) {
                const year = parseInt(matches[1]);
                const monthKey = DateUtils.getMonthKeyFromStartDate(w.startDate);

                const label = moment().year(year).month(monthKey).format('MMM') + ' ' + year.toString().substr(2,2);
                if (!labels.includes(label)) {
                    labels.push(label);
                }
            }
        });

        return labels;
    }

    parseData(data) {
        const supports = {
            list: [],
            labels: [],
            sets: []
        };

        // Define labels
        supports.labels = this.getChartLabels(data);

        // Parse weeks
        data.forEach((w) => {
            const matches = w.key.match(/^(\d+)-(\d+)/);

            if (matches && matches.length > 0) {
                const year = parseInt(matches[1]);
                const weekNumber = parseInt(matches[2]);
                const monthKey = DateUtils.getMonthKeyFromStartDate(w.startDate);
                const starts = DateUtils.getDateOfISOWeek(weekNumber, year);
                const ends = DateUtils.getDateOfISOWeek(weekNumber, year, 5);
                const label = moment().year(year).month(monthKey).format('MMM') + ' ' + year.toString().substr(2,2);

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
                                data: Array(supports.labels.length).fill(0)
                            };

                            s.data[supports.labels.indexOf(label)] = c.spent;
                            supports.sets.push(s);
                        } else {
                            s.data[supports.labels.indexOf(label)] += c.spent;
                        }
                    }
                });

                supports.list.forEach((elt) => {
                    elt.startWeek = moment(elt.startDate).isoWeek();
                    elt.endWeek = moment(elt.endDate).isoWeek();
                });

            }
        });

        return supports;
    }
}
