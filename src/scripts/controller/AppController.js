import Controller from './Controller';
import AppModel from '../model/AppModel';

export default class AppController extends Controller {
    constructor() {
        super();

        this.appModel = null;
        this.loader = document.querySelector('.js-loader');
        this.main = document.querySelector('.js-main');
        this.empty = document.querySelector('.js-empty');
        this.btnLoadData = document.querySelector('.js-load-data');
        this.setLoader(true);

        this.sideNavToggleButton = document.querySelector('.js-sidebar-toggle');
        this.sideNav = document.querySelector('.js-sidebar');
        this.sideNavContent = this.sideNav.querySelector('.js-sidebar-content');

        this.bindEvents();
        this.loadData();
    }

    setLoader(loading = this.isLoading) {
        if (loading) {
            this.main.setAttribute('hidden', true);
            this.loader.removeAttribute('hidden');
            this.isLoading = loading;
        } else {
            this.main.removeAttribute('hidden');
            this.loader.setAttribute('hidden', true);
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
    }

    loadData() {
        AppModel.get(1).then(appModel => {
            this.appModel = appModel;

            if (typeof appModel === 'undefined') {
                this.appModel = new AppModel();
                this.appModel.put();
            }

            if (this.appModel.firstRun) {
                this.setLoader(false);
                this.setEmpty(true);
            }
        });
    }

    setEmpty(empty) {
        if (empty) {
            this.main.setAttribute('hidden', true);
            this.empty.classList.add('active');
        } else {
            this.main.removeAttribute('hidden');
            this.empty.classList.remove('active');
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
