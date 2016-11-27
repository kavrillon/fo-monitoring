import Controller from './libs/Controller';
import ConfigManagerInstance from './libs/ConfigManager';
import TrelloUtils from './libs/TrelloUtils';
import HomeController from './pages/home/HomeController';
import WeeksController from './pages/weeks/WeeksController';
import DeliveryController from './pages/delivery/DeliveryController';
import AppModel from './model/AppModel';
import _find from 'lodash/find';

export default class AppController extends Controller {
    constructor() {
        super();

        // Controller vars
        this.appModel = null;
        this.isLoading = true;
        this.trello = null;

        this.data = [];

        this.defaultAppTitle = document.querySelector('[js-title]').innerHTML;

        this.pages = [
            {name: 'weeks', title: 'Weeks'},
            {name: 'delivery', title: 'Delivery'}
        ];

        // DOM vars
        this.loader = document.querySelector('[js-loader]');
        this.sideNavToggleButton = document.querySelector('[js-sidebar-toggle]');
        this.sideNav = document.querySelector('[js-sidebar]');
        this.sideNavContent = document.querySelector('[js-sidebar-content]');
        this.appTitle = document.querySelector('[js-title]');

        // Init calls
        this.bindEvents();
        this.init();
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

    init() {
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
                    if (data) {
                        this.data = data;

                        new HomeController(this.data);
                        new WeeksController(this.data);
                        new DeliveryController(this.data);

                        // Add each week in the database
                        this.data.forEach((w) => {
                            w.put();
                        });

                        // show home once it's available
                        this.setLoader(false);
                        this.setPage('home');
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
        Array.from(document.querySelectorAll('[js-page]')).forEach((el) => {
            el.classList.remove('active');
        });
    }

    setPage(page) {
        this.hidePages();

        const domPage = document.querySelector(`[js-page="${page}"]`);
        if (domPage !== null) {
            let pageTitle = _find(this.pages, (o) => {
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
            document.querySelector('[js-page="connect"]').classList.add('active');
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
