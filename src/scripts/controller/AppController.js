import Controller from './Controller';
import AppModel from '../model/AppModel';
import Trello from 'node-trello';
import ConfigManagerInstance from '../libs/ConfigManager';

export default class AppController extends Controller {
    constructor() {
        super();

        this.appModel = null;

        this.trello = null;

        this.loader = document.querySelector('.js-loader');
        this.isLoading = true;

        this.pageConnect = document.querySelector('.js-page-connect');

        this.btnLoadData = document.querySelector('.js-load-data');

        this.sideNavToggleButton = document.querySelector('.js-sidebar-toggle');
        this.sideNav = document.querySelector('.js-sidebar');
        this.sideNavContent = this.sideNav.querySelector('.js-sidebar-content');

        this.bindEvents();
        this.loadData();
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
        this.btnLoadData.addEventListener('click', () => {
            this.closeSideNav();
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

        this.pageConnect.addEventListener('click', () => {
            this.connectToTrello();
        });
    }

    loadData() {
        AppModel.get(1).then(appModel => {
            this.appModel = appModel;

            const hash = window.location.hash.match(/^#token=(.*)/);
            let token = null;

            if (hash !== null) {
                token = hash[1];
            }

            if (typeof appModel === 'undefined') {
                this.appModel = new AppModel(1);
                this.appModel.put();
            } else if (this.appModel.firstRun) {
                this.appModel.firstRun = false;
            }

            if (token !== null && token !== '') {
                this.appModel.token = token;
            }

            this.appModel.put();
            this.setLoader(false);

            if (this.appModel.token !== null) {
                this.setPage('empty');
            } else {
                this.setPage('connect');
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
            domPage.classList.add('active');
        } else {
            document.querySelector(`.js-page-main`).classList.add('active');
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
