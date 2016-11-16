import Controller from './Controller';
import DateUtils from '../libs/DateUtils';
import AppModel from '../model/AppModel';
import WeekModel from '../model/WeekModel';
import Trello from 'node-trello';
import moment from 'moment';
import _ from 'lodash';
import ConfigManagerInstance from '../libs/ConfigManager';


export default class AppController extends Controller {
    constructor() {
        super();

        // Controller vars
        this.isLoading = true;
        this.trello = null;

        this.appModel = null;
        this.weekModels = [];

        this.visibleWeeks = [];
        this.weekList = document.querySelector('.js-weeks-list');
        this.weekTemplate = document.querySelector('[js-template-week]');

        this.defaultAppTitle = document.querySelector('[js-title]').innerHTML;

        this.pages = [
            {name: 'weeks', title: 'Weeks'},
            {name: 'projects', title: 'Projects'}
        ];

        // DOM vars
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

    setLoader(loading) {
        if (loading) {
            this.loader.classList.add('active');
            this.isLoading = loading;
        } else {
            this.loader.classList.remove('active');
            this.isLoading = loading;
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
                this.connectToTrello();
            });
        });
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

            const hash = window.location.hash.match(/^#token=(.*)/);
            let token = null;

            if (hash !== null) {
                token = hash[1];
            }

            if (token !== null && token !== '') {
                this.appModel.token = token;
                this.appModel.put();
            }

            this.loadData();
        });
    }

    loadData() {
        console.log('loadData');

        if (this.appModel.token !== null) {
            ConfigManagerInstance().then(configManager => {
                this.trello = new Trello(configManager.config.trello.key, this.appModel.token);

                this.trello.get('1/boards/577130dfed8fabf757eddc60/lists', {
                    cards: 'open',
                    card_fields:'name,labels',
                    fields:'name,desc'
                }, (err, data) => {
                    if (err) throw err;

                    this.setLoader(false);
                    if (data.length > 0) {
                        this.parseData(data);
                        this.setPage('home');
                    } else {
                        this.setPage('empty');
                    }
                });
            });
        } else {
            this.setLoader(false);
            this.setPage('connect');
        }
    }

    parseData(data) {
        data.forEach(item => {
            const matches = item.name.match(/^W(\d+).*:\s*(\d+)/);
            if (matches && matches.length > 0) {
                const weekNumber = parseInt(matches[1]);
                const weekPoints = parseInt(matches[2]);

                const w = new WeekModel(weekNumber);
                w.availablePoints = weekPoints;
                w.cards = item.cards;
                w.startDate = DateUtils.getDateOfISOWeek(weekNumber, 2016);
                w.endDate = DateUtils.getDateOfISOWeek(weekNumber, 2016, 5);
                w.estimatedPoints = 0;
                w.spentPoints = 0;
                w.lastUpdate = new Date();

                item.cards.forEach(c => {
                    const matches = c.name.match(/^\((\d+)\).*\[(\d+)\]$/);
                    if (matches && matches.length > 0) {
                        w.estimatedPoints += parseInt(matches[1]);
                        w.spentPoints += parseInt(matches[2]);
                    }
                });

                w.put();

                this.weekModels.push(w);

                const weekCard = this.visibleWeeks[w.key];
                if (!weekCard) {
                    const week = this.weekTemplate.cloneNode(true);
                    week.querySelector('[js-week-key]').textContent = w.key;
                    week.querySelector('[js-week-last-updated]').textContent = w.lastUpdate;
                    week.querySelector('[js-week-start]').textContent = moment(w.startDate).format('MMM DD');
                    week.querySelector('[js-week-end]').textContent = moment(w.endDate).format('ll');
                    week.querySelector('[js-week-cards]').textContent = `${w.cards.length} cards`;
                    week.querySelector('[js-week-points]').textContent = `${w.spentPoints} pts`;
                    week.removeAttribute('hidden');
                    this.weekList.appendChild(week);

                    this.visibleWeeks[data.key] = week;
                }
            }
        });
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

    connectToTrello() {
        ConfigManagerInstance().then(configManager => {
            const connectUrl = `${configManager.config.trello.connectUrl}&key=${configManager.config.trello.key}&return_url=${window.location.origin}${window.location.pathname}`;
            window.location.href = connectUrl;
        });
    }
}
