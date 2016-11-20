import Controller from './Controller';
import AppModel from '../model/AppModel';
import TrelloUtils from '../libs/TrelloUtils';
import moment from 'moment';
import Chart from 'chart.js';
import _ from 'lodash';
import ConfigManagerInstance from '../libs/ConfigManager';


export default class AppController extends Controller {
    constructor() {
        super();

        // Controller vars
        this.appModel = null;
        this.isLoading = true;
        this.trello = null;

        this.weeks = [];
        this.weeksCards = [];

        this.defaultAppTitle = document.querySelector('[js-title]').innerHTML;

        this.pages = [
            {name: 'weeks', title: 'All weeks'},
            {name: 'projects', title: 'All projects'}
        ];

        // DOM vars
        this.weekList = document.querySelector('.js-weeks-list');
        this.cardTemplate = document.querySelector('[js-template-card]');
        this.weekTemplate = document.querySelector('[js-template-week]');
        this.loader = document.querySelector('.js-loader');
        this.sideNavToggleButton = document.querySelector('[js-sidebar-toggle]');
        this.sideNav = document.querySelector('[js-sidebar]');
        this.sideNavContent = document.querySelector('[js-sidebar-content]');
        this.appTitle = document.querySelector('[js-title]');

        // Init calls
        this.bindEvents();
        this.initApp();
        // this.registerSW();
    }

    registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('sw.js')
                .then(() => {
                    // console.log('Service Worker Registered');
                });
        }
    }

    initApp() {
        AppModel.get(1).then(appModel => {
            this.appModel = appModel;

            if (typeof appModel === 'undefined') {
                this.appModel = new AppModel(1);
                this.appModel.put();
            } else if (this.appModel.firstRun) {
                this.appModel.firstRun = false;
                this.appModel.put();
            }

            this.parseRoute();
            this.loadData();
        });
    }

    loadData() {
        this.setLoader(true);
        this.hidePages();

        if (this.appModel.token !== null) {
            ConfigManagerInstance().then(configManager => {
                this.trello = new TrelloUtils(configManager.config.trello.key, this.appModel.token);

                this.trello.getParsedData().then(data => {
                    if (data.length > 0) {
                        this.weeks = data;
                        console.log(data);

                        const labels = _.orderBy(_.map(data, 'key'));

                        // create charts
                        new Chart(document.getElementById('ChartVelocity'), {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Velocity',
                                    data: _.map(_.orderBy(data, 'key'), 'points.spent'),
                                    borderWidth: 1
                                }]
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
                                            beginAtZero:true
                                        }
                                    }]
                                }
                            }
                        });

                        new Chart(document.getElementById('ChartWeeklyActivity'), {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [
                                    {
                                        label: 'Monitoring',
                                        data: _.map(_.orderBy(data, 'key'), 'activity.monitoring'),
                                        backgroundColor: 'rgba(255,206,86,0.3)',
                                        borderWidth: 1,
                                        borderColor: '#ffce56'
                                    },
                                    {
                                        label: 'Support',
                                        data: _.map(_.orderBy(data, 'key'), 'activity.support'),
                                        backgroundColor: 'rgba(68,210,121,0.3)',
                                        borderWidth: 1,
                                        borderColor: '#44d279'
                                    },
                                    {
                                        label: 'Delivery',
                                        data: _.map(_.orderBy(data, 'key'), 'activity.delivery'),
                                        backgroundColor: 'rgba(255,99,132,0.3)',
                                        borderWidth: 1,
                                        borderColor: '#ff6384'
                                    },
                                    {
                                        label: 'Product',
                                        data: _.map(_.orderBy(data, 'key'), 'activity.product'),
                                        backgroundColor: 'rgba(54,162,235,0.3)',
                                        borderWidth: 1,
                                        borderColor: '#36a2eb'
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
                                            beginAtZero:true
                                        }
                                    }]
                                }
                            }
                        });

                        const monitoringPercents = _.map(data, 'activity.monitoring');
                        let monitoringAvg = 0;
                        monitoringPercents.forEach((elt) => {
                            monitoringAvg += elt;
                        });
                        monitoringAvg = Math.round(monitoringAvg / monitoringPercents.length);

                        const deliveryPercents = _.map(data, 'activity.delivery');
                        let deliveryAvg = 0;
                        deliveryPercents.forEach((elt) => {
                            deliveryAvg += elt;
                        });
                        deliveryAvg = Math.round(deliveryAvg / deliveryPercents.length);

                        const supportPercents = _.map(data, 'activity.support');
                        let supportAvg = 0;
                        supportPercents.forEach((elt) => {
                            supportAvg += elt;
                        });
                        supportAvg = Math.round(supportAvg / supportPercents.length);

                        const productPercents = _.map(data, 'activity.product');
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


                        // show home once it's available
                        this.setLoader(false);
                        this.setPage('home');

                        // Add in the week list
                        this.weeks.forEach((w) => {
                            w.put();
                            this.createOrUpdateWeekCard(w);
                        });
                    } else {
                        this.setLoader(false);
                        this.setPage('empty');
                    }
                }).catch(() => {
                    this.setLoader(false);
                    this.setPage('connect');
                });
            });
        } else {
            this.setLoader(false);
            this.setPage('connect');
        }
    }

    bindEvents() {
        Array.from(document.querySelectorAll('[js-link]')).forEach((elt) => {
            elt.addEventListener('click', (e) => {
                this.setPage(e.target.getAttribute('js-link'));
                this.closeSideNav();
            });
        });

        Array.from(document.querySelectorAll('[js-refresh]')).forEach((elt) => {
            elt.addEventListener('click', () => {
                this.loadData();
            });
        });

        this.sideNav.addEventListener('click', () => {
            this.closeSideNav();
        });

        this.sideNavContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.sideNavToggleButton.addEventListener('click', () => {
            this.toggleSideNav();
        });

        Array.from(document.querySelectorAll('[js-trello-connect]')).forEach((elt) => {
            elt.addEventListener('click', () => {
                TrelloUtils.connectToTrello();
            });
        });
    }

    createOrUpdateWeekCard(w) {
        let week = null;

        if (!this.weeksCards[w.key]) {
            week = this.weekTemplate.cloneNode(true);
            this.weekList.appendChild(week);

            week.querySelector('[js-week-header]').addEventListener('click', () => {
                if (week.classList.contains('active')) {
                    week.classList.remove('active');
                } else {
                    week.classList.add('active');
                }
            });
        } else {
            week = this.weeksCards[w.key];
            week.querySelectorAll('[js-template-card]').forEach((elt) => {
                elt.outerHTML = '';
            });
        }

        week.querySelector('[js-week-key]').textContent = w.key;
        week.querySelector('[js-week-last-updated]').textContent = w.lastUpdate;
        week.querySelector('[js-week-start]').textContent = moment(w.startDate).format('MMM DD');
        week.querySelector('[js-week-end]').textContent = moment(w.endDate).format('ll');
        week.querySelector('[js-week-count]').textContent = `${w.cards.length} cards`;
        week.querySelector('[js-week-available]').textContent = `${w.points.available} pts`;
        week.querySelector('[js-week-spent]').textContent = `${w.points.spent} pts`;

        week.querySelector('[js-week-product]').textContent = `${w.points.product} pts`;
        week.querySelector('[js-week-support]').textContent = `${w.points.support} pts`;
        week.querySelector('[js-week-monitoring]').textContent = `${w.points.monitoring} pts`;
        week.querySelector('[js-week-delivery]').textContent = `${w.points.delivery} pts`;

        week.querySelector('[js-week-delivery-percent]').textContent = `${Math.round(w.activity.delivery)}%`;
        week.querySelector('[js-week-product-percent]').textContent = `${Math.round(w.activity.product)}%`;
        week.querySelector('[js-week-monitoring-percent]').textContent = `${Math.round(w.activity.monitoring)}%`;
        week.querySelector('[js-week-support-percent]').textContent = `${Math.round(w.activity.support)}%`;

        w.cards.forEach((c) => {
            const card = this.cardTemplate.cloneNode(true);

            card.querySelector('[js-card-name]').textContent = `${c.name}`;
            card.querySelector('[js-card-name]').setAttribute('href', `${c.url}`);
            card.querySelector('[js-card-type]').textContent = `${c.type}`;
            card.querySelector('[js-card-type]').classList.add(`card__type__value--${c.type.toLowerCase()}`);
            card.querySelector('[js-card-spent]').textContent = `${c.spent} pts`;

            week.querySelector('[js-week-cards]').appendChild(card);
        });

        week.removeAttribute('hidden');
        this.weeksCards[w.key] = week;
    }

    setLoader(loading) {
        if (loading) {
            this.loader.classList.add('active');
            this.isLoading = loading;
        } else {
            this.loader.classList.remove('active');
            this.isLoading = loading;
        }
    }

    parseRoute() {
        const hash = window.location.hash.match(/^#token=(.*)/);
        let token = null;

        if (hash !== null) {
            token = hash[1];
        }

        if (token !== null && token !== '') {
            this.appModel.token = token;
            this.appModel.put();
        }
    }

    hidePages() {
        document.querySelectorAll('.js-page').forEach((el) => {
            el.classList.remove('active');
        });
    }

    setPage(page) {
        this.hidePages();

        const domPage = document.querySelector(`.js-page-${page}`);
        if (domPage !== null) {
            let pageTitle = _.find(this.pages, (o) => {
                return o.name === page;
            });

            if (typeof pageTitle === 'undefined') {
                pageTitle = this.defaultAppTitle;
            } else {
                pageTitle = pageTitle.title;
            }

            this.appTitle.innerHTML = pageTitle;
            domPage.classList.add('active');
        } else {
            this.appTitle.innerHTML = this.defaultAppTitle;
            document.querySelector('.js-page-connect').classList.add('active');
        }
    }

    toggleSideNav() {
        if (this.sideNav.classList.contains('active')) {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }

    openSideNav() {
        this.sideNav.classList.add('active');
        this.sideNavToggleButton.focus();
    }

    closeSideNav() {
        this.sideNav.classList.remove('active');
    }
}
