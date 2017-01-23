import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';
import Chart from 'chart.js';

export default class ProcessController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.processes = this.parseData(data);
        this.processesList = [];

        // DOM vars
        this.processesContainer = document.querySelector('[js-process-list]');

        this.displayData();
    }

    displayData() {
        // Displaying processes
        _orderBy(this.processes.list, 'name').forEach((p) => {
            let process = null;

            if (!this.processesList[p.key]) {
                process = new TopicTemplate(p);
                this.processesContainer.appendChild(process.getContent());
            } else {
                process = this.processesList[p.key];
                process.update(p);
            }

            this.processesList[p.key] = process;
        });

        // Displaying chart

        const datasets = [];
        const step = .5 / this.processes.sets.length;
        const borderStep = 1 / this.processes.sets.length;
        let opacity = 0, opacityBorder = 0;

        const total = Array(this.processes.labels.length).fill(0);

        _orderBy(this.processes.sets, 'label').forEach((s) => {
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
                backgroundColor: `rgba(255,206,86,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(255,206,86,${opacityBorder})`,
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

        new Chart(document.getElementById('ChartProcessRepartition'), {
            type: 'line',
            data: {
                labels: this.processes.labels,
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
        const processes = {
            list: [],
            labels: [],
            sets: []
        };

        // Define labels
        processes.labels = this.getChartLabels(data);

        // Parse weeks
        data.forEach((w) => {
            const matches = w.key.match(/^(\d+)-(\d+)/);

            if (matches && matches.length > 0) {
                const year = parseInt(matches[1]);
                const weekNumber = parseInt(matches[2]);
                const monthKey = DateUtils.getMonthKeyFromStartDate(w.startDate);
                const starts = DateUtils.getDateOfISOWeek(weekNumber, year);
                const ends = DateUtils.getDateOfISOWeek(weekNumber, year, 5);
                const label = moment().year(year).month(monthKey).format('MMM') + ' ' + year.toString().substr(2, 2);
                
                w.cards.forEach((c) => {
                    if (c.type === 'process' && c.spent > 0) {

                        // Add to process list
                        let p = _find(processes.list, (o) => {
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

                            processes.list.push(p);
                        }

                        // Add to chart set
                        let s = _find(processes.sets, (o) => {
                            return o.label === c.project;
                        });

                        if (!s) {
                            s = {
                                label: c.project,
                                data: Array(processes.labels.length).fill(0)
                            };

                            s.data[processes.labels.indexOf(label)] = c.spent;
                            processes.sets.push(s);
                        } else {
                            s.data[processes.labels.indexOf(label)] += c.spent;
                        }
                    }
                });
            }
        });

        return processes;
    }
}
