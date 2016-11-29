import Controller from '../../libs/Controller';
import _orderBy from 'lodash/orderBy';
import _map from 'lodash/map';
import Chart from 'chart.js';
import moment from 'moment';

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

    displayGlobalActivities() {
        const monitoringPercents = _map(this.data, 'activity.monitoring');
        let monitoringAvg = 0;
        monitoringPercents.forEach((elt) => {
            monitoringAvg += elt;
        });
        monitoringAvg = Math.round(monitoringAvg / monitoringPercents.length);

        const deliveryPercents = _map(this.data, 'activity.delivery');
        let deliveryAvg = 0;
        deliveryPercents.forEach((elt) => {
            deliveryAvg += elt;
        });
        deliveryAvg = Math.round(deliveryAvg / deliveryPercents.length);

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
                    'Monitoring',
                    'Support',
                    'Delivery',
                    'Product'
                ],
                datasets: [
                    {
                        data: [monitoringAvg, supportAvg, deliveryAvg, productAvg],
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
        for (let i = 0; i <= 11; i++) {
            values.push({
                key: i,
                label: labels[i],
                activity: {
                    monitoring: 0,
                    support: 0,
                    delivery: 0,
                    product: 0
                },
                points: {
                    monitoring: 0,
                    support: 0,
                    delivery: 0,
                    product: 0,
                    spent: 0,
                    available: 0,
                    estimated: 0
                },
                weeks: []
            });
        }

        _orderBy(this.data, 'key').forEach((w) => {
            const monthKey = parseInt(moment(w.startDate).format('M')) - 1;
            if (values[monthKey]) {
                values[monthKey].weeks.push(w);
                values[monthKey].points.product += w.points.product;
                values[monthKey].points.monitoring += w.points.monitoring;
                values[monthKey].points.support += w.points.support;
                values[monthKey].points.delivery += w.points.delivery;
                values[monthKey].points.spent += w.points.spent;
                values[monthKey].points.available += w.points.available;
                values[monthKey].points.estimated += w.points.estimated;
            }
        });

        values.forEach((m) => {
            m.activity.product = Math.round(m.points.product * 100 / m.points.spent);
            m.activity.monitoring = Math.round(m.points.monitoring * 100 / m.points.spent);
            m.activity.support = Math.round(m.points.support * 100 / m.points.spent);
            m.activity.delivery = Math.round(m.points.delivery * 100 / m.points.spent);
        });

        new Chart(document.getElementById('ChartMonthlyActivity'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Monitoring',
                        data: _map(values, 'activity.monitoring'),
                        backgroundColor: 'rgba(255,206,86,0.3)',
                        borderWidth: 1,
                        borderColor: '#ffce56',
                        pointRadius: 1
                    },
                    {
                        label: 'Support',
                        data: _map(values, 'activity.support'),
                        backgroundColor: 'rgba(68,210,121,0.3)',
                        borderWidth: 1,
                        borderColor: '#44d279',
                        pointRadius: 1
                    },
                    {
                        label: 'Delivery',
                        data: _map(values, 'activity.delivery'),
                        backgroundColor: 'rgba(255,99,132,0.3)',
                        borderWidth: 1,
                        borderColor: '#ff6384',
                        pointRadius: 1
                    },
                    {
                        label: 'Product',
                        data: _map(values, 'activity.product'),
                        backgroundColor: 'rgba(54,162,235,0.3)',
                        borderWidth: 1,
                        borderColor: '#36a2eb',
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
