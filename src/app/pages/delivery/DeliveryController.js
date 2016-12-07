import Controller from '../../libs/Controller';
import ProjectTemplate from '../../templates/project/ProjectTemplate';
import ProjectModel from '../../model/ProjectModel';
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
    }

    displayProjects() {
        document.querySelector('[js-delivery-count]').innerHTML = `${this.projects.length} projects`;

        // Displaying projects
        this.projectsContainer.innerHTML = '';
        this.projectsList = [];
        _orderBy(this.projects, this.activeSort, this.activeOrder).forEach((p) => {
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
        let projects = [];

        data.forEach((w) => {
            w.cards.forEach((c) => {
                if (c.type === 'delivery' && c.spent > 0) {
                    let p = _find(projects, (o) => {
                        return o.key === c.project;
                    });

                    if (p) {
                        p.cards.push(c);
                        p.points.estimated += c.estimated;
                        p.points.spent += c.spent;
                        if(c.subtype === 'implementation') {
                            p.points.implementation += c.spent;

                            if (p.implementationStarts == 0 || w.key < p.implementationStarts) {
                                p.implementationStarts = w.key;
                            }

                            if (w.key > p.implementationEnds) {
                                p.implementationEnds = w.key;
                            }
                        } else if (c.subtype === 'review') {
                            p.points.review += c.spent;
                        }
                        p.lastUpdate = new Date();
                    } else {
                        const newProject = new ProjectModel(c.project, {
                            cards: [c],
                            name: c.project,
                            points: {
                                spent: c.spent,
                                estimated: c.estimated,
                                implementation: (c.subtype === 'implementation' ? c.spent : 0),
                                review: (c.subtype === 'review' ? c.spent : 0)
                            },
                            implementationStarts: (c.subtype === 'implementation' ? w.key : 0),
                            implementationEnds: (c.subtype === 'implementation' ? w.key : 0),
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
