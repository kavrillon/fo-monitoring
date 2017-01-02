import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';
import Chart from 'chart.js';

export default class ProjectController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.projects = this.parseData(data);
        this.projectsList = [];

        // DOM vars
        this.projectsContainer = document.querySelector('[js-project-list]');

        this.displayData();
    }

    displayData() {
        // Displaying projects
        _orderBy(this.projects.list, 'name').forEach((p) => {
            let project = null;

            if (!this.projectsList[p.key]) {
                project = new TopicTemplate(p, true, true);
                this.projectsContainer.appendChild(project.getContent());
            } else {
                project = this.projectsList[p.key];
                project.update(p);
            }

            this.projectsList[p.key] = project;
        });

        // Displaying chart

        let datasets = [];
        let step = .5 / this.projects.sets.length;
        let borderStep = 1 / this.projects.sets.length;
        let opacity = 0, opacityBorder = 0;

        const total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        _orderBy(this.projects.sets, 'label').forEach((s) => {
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
                backgroundColor: `rgba(255,99,132,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(255,99,132,${opacityBorder})`,
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

        new Chart(document.getElementById('ChartProjectRepartition'), {
            type: 'line',
            data: {
                labels: this.projects.labels,
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

        datasets = [];
        step = .5 / this.projects.versionSets.length;
        borderStep = 1 / this.projects.versionSets.length;
        opacity = 0, opacityBorder = 0;

        _orderBy(this.projects.versionSets, 'label').forEach((s) => {
            opacity += step;
            opacityBorder += borderStep;

            // Days conversion
            s.data = _map(s.data, (d) => {
                return DateUtils.pointsToDays(d);
            });

            datasets.push(Object.assign(s, {
                backgroundColor: `rgba(255,99,132,${opacity})`,
                borderWidth: 1,
                borderColor: `rgba(255,99,132,${opacityBorder})`,
                pointRadius: 1
            }));
        });

        new Chart(document.getElementById('ChartVersionRepartition'), {
            type: 'line',
            data: {
                labels: this.projects.labels,
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
        const labels = ['Mockup', 'Bridge Product', 'Feature', 'Bug', 'Review', 'Update', 'Implementation'];
        const projects = {
            list: [],
            versionSets: [],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            sets: []
        };

        _orderBy(data, 'key').forEach((w) => {
            const monthKey = DateUtils.getMonthKeyFromStartDate(w.startDate);
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'project' && c.spent > 0) {

                    const l = _find(c.labels, (o) => {
                        return labels.includes(o);
                    });

                    if (l) {
                        // Add to project list
                        let p = _find(projects.list, (o) => {
                            return o.key === l;
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
                            p = new TopicModel(l, {
                                cards: [c],
                                name: l,
                                points: {
                                    spent: c.spent,
                                    estimated: c.estimated
                                },
                                startDate: starts,
                                endDate: ends,
                                lastUpdate: new Date()
                            });

                            projects.list.push(p);
                        }

                        // Add to chart set
                        let s = _find(projects.sets, (o) => {
                            return o.label === l;
                        });

                        if (!s) {
                            s = {
                                label: l,
                                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            };

                            s.data[monthKey] += c.spent;
                            projects.sets.push(s);
                        } else {
                            s.data[monthKey] += c.spent;
                        }
                    }

                    // Add to version chart set
                    let vs = _find(projects.versionSets, (o) => {
                        return o.label === c.version;
                    });

                    if (!vs) {
                        vs = {
                            label: c.version,
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        };

                        vs.data[monthKey] += c.spent;
                        projects.versionSets.push(vs);
                    } else {
                        vs.data[monthKey] += c.spent;
                    }
                }
            });
        });

        return projects;
    }
}
