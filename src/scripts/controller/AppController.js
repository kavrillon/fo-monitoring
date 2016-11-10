import Controller from './Controller';

export default class AppController extends Controller {
    constructor() {
        super();

        this.sideNavToggleButton = document.querySelector('.js-sidebar-toggle');
        this.sideNav = document.querySelector('.js-sidebar');
        this.sideNavContent = this.sideNav.querySelector('.js-sidebar-content');

        this.bindEvents();
    }

    bindEvents() {
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
