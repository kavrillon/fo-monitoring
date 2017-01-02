import Controller from '../../libs/Controller';
import DateUtils from '../../libs/DateUtils';
import _orderBy from 'lodash/orderBy';
import _map from 'lodash/map';
import Chart from 'chart.js';

export default class HomeController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.data = data;

        // Home init
        this.displayVelocity();
        this.displayGlobalActivities();
        this.displayMonthlyActivities();
    }

    displayVelocity() {
        const labels = _orderBy(_map(this.data, 'key'));
        const values = _map(_orderBy(this.data, 'key'), 'points.spent');

        let avg = 0;
        values.forEach((elt) => {
            avg += elt;
        });
        avg = Math.round(avg / values.length);

        document.querySelector('[js-avg-velocity]').textContent = `${avg} pts`;

        const avgValues = [];
        for (let i = 0; i < values.length; i++) {
            avgValues.push(avg);
        }

        // create charts
        new Chart(document.getElementById('ChartVelocity'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Velocity',
                        data: values,
                        borderWidth: 1,
                        borderColor: '#362f5f',
                        backgroundColor: 'rgba(54,47,95,0.3)',
                        pointRadius: 1
                    },
                    {
                        label: 'Average',
                        data: avgValues,
                        tooltip: false,
                        fill: false,
                        borderWidth: 1,
                        borderColor: '#cc0000',
                        pointRadius: 0
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    displayGlobalActivities() {
        const processPercents = _map(this.data, 'activity.process');
        let processAvg = 0;
        processPercents.forEach((elt) => {
            processAvg += elt;
        });
        processAvg = Math.round(processAvg / processPercents.length);

        const projectPercents = _map(this.data, 'activity.project');
        let projectAvg = 0;
        projectPercents.forEach((elt) => {
            projectAvg += elt;
        });
        projectAvg = Math.round(projectAvg / projectPercents.length);

        const supportPercents = _map(this.data, 'activity.support');
        let supportAvg = 0;
        supportPercents.forEach((elt) => {
            supportAvg += elt;
        });
        supportAvg = Math.round(supportAvg / supportPercents.length);

        const productPercents = _map(this.data, 'activity.product');
        let productAvg = 0;
        productPercents.forEach((elt) => {
            productAvg += elt;
        });
        productAvg = Math.round(productAvg / productPercents.length);

        new Chart(document.getElementById('ChartGlobalActivity'), {
            type: 'doughnut',
            data: {
                labels: [
                    'Process',
                    'Support',
                    'Project',
                    'Product'
                ],
                datasets: [
                    {
                        data: [processAvg, supportAvg, projectAvg, productAvg],
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

    displayMonthlyActivities() {
        const values = [];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < labels.length; i++) {
            values.push({
                key: i,
                label: labels[i],
                process: 0,
                support: 0,
                project: 0,
                product: 0,
                spent: 0
            });
        }

        _orderBy(this.data, 'key').forEach((w) => {
            const monthKey = DateUtils.getMonthKeyFromStartDate(w.startDate);
            if (values[monthKey]) {
                values[monthKey].product += w.points.product;
                values[monthKey].process += w.points.process;
                values[monthKey].support += w.points.support;
                values[monthKey].project += w.points.project;
                values[monthKey].spent += w.points.spent;
            }
        });

        values.forEach((m) => {
            m.product = DateUtils.pointsToDays(m.product);
            m.process = DateUtils.pointsToDays(m.process);
            m.support = DateUtils.pointsToDays(m.support);
            m.project = DateUtils.pointsToDays(m.project);
            m.spent = DateUtils.pointsToDays(m.spent);
        });

        new Chart(document.getElementById('ChartMonthlyActivity'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Process',
                        data: _map(values, 'process'),
                        backgroundColor: 'rgba(255,206,86,0.3)',
                        borderWidth: 1,
                        borderColor: '#ffce56',
                        pointRadius: 1
                    },
                    {
                        label: 'Support',
                        data: _map(values, 'support'),
                        backgroundColor: 'rgba(68,210,121,0.3)',
                        borderWidth: 1,
                        borderColor: '#44d279',
                        pointRadius: 1
                    },
                    {
                        label: 'Project',
                        data: _map(values, 'project'),
                        backgroundColor: 'rgba(255,99,132,0.3)',
                        borderWidth: 1,
                        borderColor: '#ff6384',
                        pointRadius: 1
                    },
                    {
                        label: 'Product',
                        data: _map(values, 'product'),
                        backgroundColor: 'rgba(54,162,235,0.3)',
                        borderWidth: 1,
                        borderColor: '#36a2eb',
                        pointRadius: 1
                    },
                    {
                        label: 'Total',
                        data: _map(values, 'spent'),
                        tooltip: false,
                        fill: false,
                        borderWidth: 1,
                        borderColor: '#cc0000',
                        pointRadius: 1
                    }
                ]
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
}
