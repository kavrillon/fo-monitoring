import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import Chart from 'chart.js';

export default class MonitoringController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.monitorings = this.parseDataForMonitoring(data);
        this.monitoringsList = [];

        // DOM vars
        this.monitoringsContainer = document.querySelector('[js-monitoring-list]');

        this.displayData();
    }

    displayData() {
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

        const labels = _map(this.monitorings, 'name');
        const values = _map(this.monitorings, 'points.spent');

        // Display chart
        new Chart(document.getElementById('ChartMonitoringRepartition'), {
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

    parseDataForMonitoring(data) {
        const monitorings = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'monitoring' && c.spent > 0) {
                    const p = _find(monitorings, (o) => {
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
