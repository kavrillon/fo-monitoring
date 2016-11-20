import Controller from './Controller';
import AppModel from '../model/AppModel';
import TrelloUtils from '../libs/TrelloUtils';
import moment from 'moment';
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
            {name: 'weeks', title: 'Weeks'},
            {name: 'projects', title: 'Projects'}
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
        this.registerSW();
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

                        // Add in the view
                        this.weeks.forEach((w) => {
                            this.createOrUpdateWeekCard(w);
                        });

                        this.setLoader(false);
                        this.setPage('weeks');

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
        } else {
            week = this.weeksCards[w.key];
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
        week.querySelector('[js-week-total-percent]').textContent = `${Math.round(w.activity.total)}%`;

        w.cards.forEach((c) => {
            const card = this.cardTemplate.cloneNode(true);

            card.querySelector('[js-card-name]').textContent = `${c.name}`;
            card.querySelector('[js-card-name]').setAttribute('href', `${c.url}`);
            card.querySelector('[js-card-type]').textContent = `${c.type}`;
            card.querySelector('[js-card-type]').classList.add(`card__type__value--${c.type.toLowerCase()}`);
            card.querySelector('[js-card-spent]').textContent = `${c.spent} pts`;

            week.querySelector('[js-week-cards]').appendChild(card);
        });

        week.querySelector('[js-week-header]').addEventListener('click', () => {
            if (week.classList.contains('active')) {
                week.classList.remove('active');
            } else {
                week.classList.add('active');
            }
        });

        week.removeAttribute('hidden');
        this.weekList.appendChild(week);
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
            let pageTitle = _.find(this.pages, function(o) {
                return o.name === page;
            });

            if (typeof pageTitle == 'undefined') {
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
