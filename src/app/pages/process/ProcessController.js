import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import Chart from 'chart.js';
import moment from 'moment';

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

        let datasets = [];
        const step = .5 / this.processes.sets.length;
        let borderStep = 1 / this.processes.sets.length;
        let opacity = 0;
        let opacityBorder = 0;

        _orderBy(this.processes.sets, 'label').forEach((s) => {
            opacity += step;
            opacityBorder += borderStep;

            // Days conversion
            s.data = _map(s.data, (d) => {
                return DateUtils.pointsToDays(d);
            });

            datasets.push(Object.assign(s, {
                backgroundColor: `rgba(255,206,86,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(255,206,86,${opacityBorder})`,
                pointRadius: 1
            }));
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

    parseData(data) {
        const processes = {
            list: [],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            sets: []
        };

        data.forEach((w) => {
            const monthKey = parseInt(moment(w.startDate).format('M')) - 1;
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

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
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        };

                        s.data[monthKey] += c.spent;
                        processes.sets.push(s);
                    } else {
                        s.data[monthKey] += c.spent;
                    }
                }
            });
        });

        return processes;
    }
}
