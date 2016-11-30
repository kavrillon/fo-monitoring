import Controller from '../../libs/Controller';
import ProjectTemplate from '../../templates/project/ProjectTemplate';
import ProjectModel from '../../model/ProjectModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class DeliveryController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.projects = this.parseDataForDelivery(data);
        this.projectsList = [];

        // DOM vars
        this.projectsContainer = document.querySelector('[js-delivery-list]');

        // Displaying projects
        _orderBy(this.projects, 'name').forEach((p) => {
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

        document.querySelector('[js-delivery-count]').innerHTML = `${this.projects.length} projects`;
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
                            implementationStarts: null,
                            implementationEnds: null,
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
