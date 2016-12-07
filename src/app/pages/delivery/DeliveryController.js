import Controller from '../../libs/Controller';
import ProjectTemplate from '../../templates/project/ProjectTemplate';
import ProjectModel from '../../model/ProjectModel';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class DeliveryController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.projects = this.parseDataForDelivery(data);
        this.projectsList = [];
        this.activeSort = 'alpha';
        this.activeOrder = 'asc';
        this.filterComplete = false;
        this.filterHighlight = false;
        this.filterName = null;

        const activeSorter = document.querySelector('[js-delivery-sort].active');
        if (activeSorter) {
            this.activeSort = activeSorter.getAttribute('js-delivery-sort');
            this.activeOrder = activeSorter.getAttribute('js-delivery-sort-order');
        }

        // DOM vars
        this.projectsContainer = document.querySelector('[js-delivery-list]');
        this.sorters = document.querySelectorAll('[js-delivery-sort]');

        this.displayProjects();
        this.bind();
    }

    bind() {
        // Sorting
        Array.from(this.sorters).forEach((elt) => {
            elt.addEventListener('click', (e) => {
                let requestedSort = e.target;
                if (!requestedSort.hasAttribute('js-delivery-sort')) {
                    requestedSort = requestedSort.parentElement;
                }

                const requestedSortValue = requestedSort.getAttribute('js-delivery-sort');
                let activeSort = null;
                let activeOrder = null;
                const activeSorter = document.querySelector('[js-delivery-sort].active');

                if (activeSorter) {
                    activeSort = activeSorter.getAttribute('js-delivery-sort');
                    activeOrder = activeSorter.getAttribute('js-delivery-sort-order');
                }

                if (requestedSortValue === activeSort) {
                    if (activeOrder === 'asc') {
                        activeOrder = 'desc';
                    } else {
                        activeOrder = 'asc';
                    }
                } else {
                    activeOrder = 'asc';
                    if (activeSorter) {
                        activeSorter.classList.remove('active');
                    }
                }

                requestedSort.classList.add('active');
                document.querySelector('[js-delivery-sort].active').setAttribute('js-delivery-sort-order', activeOrder);

                this.activeSort = requestedSortValue;
                this.activeOrder = activeOrder;

                this.displayProjects();
            });
        });

        // Filter
        document.querySelector('#DeliveryFilterComplete').addEventListener('change', (e) => {
            this.filterComplete = e.target.checked;
            this.displayProjects();
        });

        document.querySelector('#DeliveryFilterHighlight').addEventListener('change', (e) => {
            this.filterHighlight = e.target.checked;
            this.displayProjects();
        });

        document.querySelector('#DeliveryFilterName').addEventListener('keyup', (e) => {
            this.filterName = e.target.value;
            this.displayProjects();
        });
    }

    displayProjects() {
        // Displaying projects
        this.projectsContainer.innerHTML = '';
        this.projectsList = [];
        let results = this.projects;

        if (this.filterComplete) {
            results = _filter(results, (o) => {
                return o.implementationStart > 0;
            });
        }

        if (this.filterHighlight) {
            results = _filter(results, (o) => {
                return o.isImplementationHighlighted() || o.isReviewHighlighted();
            });
        }

        if (this.filterName) {
            results = _filter(results, (o) => {
                return o.name.match(new RegExp(`${this.filterName}`, 'ig'));
            });
        }

        document.querySelector('[js-delivery-count]').innerHTML = `${results.length} projects`;

        _orderBy(results, this.activeSort, this.activeOrder).forEach((p) => {
            let project = null;

            if (!this.projectsList[p.key]) {
                project = new ProjectTemplate(p);
                this.projectsContainer.appendChild(project.getContent());
            } else {
                project = this.projectsList[p.key];
                project.update(p);
            }

            this.projectsList[p.key] = project;
        });
    }

    parseDataForDelivery(data) {
        const projects = [];

        data.forEach((w) => {
            w.cards.forEach((c) => {
                if (c.type === 'delivery' && c.spent > 0) {
                    const p = _find(projects, (o) => {
                        return o.key === c.project;
                    });

                    if (p) {
                        p.cards.push(c);
                        p.points.estimated += c.estimated;
                        p.points.spent += c.spent;

                        if(c.subtype === 'implementation') {
                            p.points.implementation += c.spent;

                            if (p.implementationStart === 0 || w.key < p.implementationStart) {
                                p.implementationStart = w.key;
                            }

                            if (w.key > p.implementationEnd) {
                                p.implementationEnd = w.key;
                            }
                        } else if (c.subtype === 'review') {
                            p.points.review += c.spent;

                            if (p.reviewStart === 0 || w.key < p.reviewStart) {
                                p.reviewStart = w.key;
                            }

                            if (w.key > p.reviewEnd) {
                                p.reviewEnd = w.key;
                            }
                        }
                        p.lastUpdate = new Date();
                    } else {
                        const newProject = new ProjectModel(c.project, {
                            cards: [c],
                            name: c.project,
                            points: {
                                spent: c.spent,
                                estimated: c.estimated,
                                implementation: c.subtype === 'implementation' ? c.spent : 0,
                                review: c.subtype === 'review' ? c.spent : 0
                            },
                            implementationStart: c.subtype === 'implementation' ? w.key : 0,
                            implementationEnd: c.subtype === 'implementation' ? w.key : 0,
                            reviewStart: c.subtype === 'review' ? w.key : 0,
                            reviewEnd: c.subtype === 'review' ? w.key : 0,
                            reviewsCount: 0,
                            lastUpdate: new Date()
                        });

                        projects.push(newProject);
                    }
                }
            });
        });

        return projects;
    }
}
