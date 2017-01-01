import Controller from '../../libs/Controller';
import DateUtils from '../../libs/DateUtils';
import ClientTemplate from '../../templates/client/ClientTemplate';
import ClientModel from '../../model/ClientModel';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class ClientsController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.clients = this.parseData(data);
        this.clientsList = [];
        this.activeSort = 'alpha';
        this.activeOrder = 'asc';
        this.filterComplete = false;
        this.filterHighlight = false;
        this.filterName = null;

        const activeSorter = document.querySelector('[js-clients-sort].active');
        if (activeSorter) {
            this.activeSort = activeSorter.getAttribute('js-clients-sort');
            this.activeOrder = activeSorter.getAttribute('js-clients-sort-order');
        }

        // DOM vars
        this.clientsContainer = document.querySelector('[js-clients-list]');
        this.sorters = document.querySelectorAll('[js-clients-sort]');

        this.displayClients();
        this.bind();
    }

    bind() {
        // Sorting
        Array.from(this.sorters).forEach((elt) => {
            elt.addEventListener('click', (e) => {
                let requestedSort = e.target;
                if (!requestedSort.hasAttribute('js-clients-sort')) {
                    requestedSort = requestedSort.parentElement;
                }

                const requestedSortValue = requestedSort.getAttribute('js-clients-sort');
                let activeSort = null, activeOrder = null;
                const activeSorter = document.querySelector('[js-clients-sort].active');

                if (activeSorter) {
                    activeSort = activeSorter.getAttribute('js-clients-sort');
                    activeOrder = activeSorter.getAttribute('js-clients-sort-order');
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
                document.querySelector('[js-clients-sort].active').setAttribute('js-clients-sort-order', activeOrder);

                this.activeSort = requestedSortValue;
                this.activeOrder = activeOrder;

                this.displayClients();
            });
        });

        // Filter
        document.querySelector('#ClientsFilterComplete').addEventListener('change', (e) => {
            this.filterComplete = e.target.checked;
            this.displayClients();
        });

        document.querySelector('#ClientsFilterHighlight').addEventListener('change', (e) => {
            this.filterHighlight = e.target.checked;
            this.displayClients();
        });

        document.querySelector('#ClientsFilterName').addEventListener('keyup', (e) => {
            this.filterName = e.target.value;
            this.displayClients();
        });
    }

    displayClients() {
        // Displaying clients
        this.clientsContainer.innerHTML = '';
        this.clientsList = [];
        let results = this.clients;

        if (this.filterComplete) {
            results = _filter(results, (o) => {
                return o.isLive;
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

        document.querySelector('[js-clients-count]').innerHTML = `${results.length} client` + (results.length > 1 ? 's' : '');

        let avgImpleSpent = 0, avgReviewSpent = 0, avgImpleDuration = 0,
            avgReviewDuration = 0, countImple = 0, countReview = 0;

        results.forEach((r) => {
            if (r.isLive) {
                if (r.implementationStart > 0 && r.implementationEnd > 0) {
                    countImple++;
                    avgImpleDuration += r.implementationEnd - r.implementationStart + 1;
                    avgImpleSpent += r.points.implementation;
                }

                if (r.reviewStart > 0 && r.reviewEnd > 0) {
                    countReview++;
                    avgReviewDuration += r.reviewEnd - r.reviewStart + 1;
                    avgReviewSpent += r.points.review;
                }
            }
        });

        avgImpleDuration = Math.round(avgImpleDuration * 10 / countImple) / 10;
        avgImpleSpent = Math.round(avgImpleSpent / countImple);
        avgReviewDuration = Math.round(avgReviewDuration * 10 / countReview) / 10;
        avgReviewSpent = Math.round(avgReviewSpent / countReview);

        document.querySelector('[js-clients-imple-duration-avg]').innerHTML = `${avgImpleDuration} weeks`;
        document.querySelector('[js-clients-imple-spent-avg]').innerHTML = `${DateUtils.pointsToDays(avgImpleSpent, 10, true)}`;
        document.querySelector('[js-clients-review-duration-avg]').innerHTML = `${avgReviewDuration} weeks`;
        document.querySelector('[js-clients-review-spent-avg]').innerHTML = `${DateUtils.pointsToDays(avgReviewSpent, 10, true)}`;

        _orderBy(results, this.activeSort, this.activeOrder).forEach((p) => {
            let client = null;

            if (!this.clientsList[p.key]) {
                client = new ClientTemplate(p);
                this.clientsContainer.appendChild(client.getContent());
            } else {
                client = this.clientsList[p.key];
                client.update(p);
            }

            this.clientsList[p.key] = client;
        });
    }

    parseData(data) {
        const clients = [];

        data.forEach((w) => {
            w.cards.forEach((c) => {
                if (c.type === 'project' && (c.spent > 0 || c.labels.includes('Live'))) {
                    const p = _find(clients, (o) => {
                        return o.key === c.project;
                    });

                    const isImplementation = c.labels.includes('Implementation');
                    const isReview = c.labels.includes('Review');
                    const isLive = c.labels.includes('Live');

                    if (p) {
                        p.cards.push(c);
                        p.points.estimated += c.estimated;
                        p.points.spent += c.spent;

                        if (isLive) {
                            p.isLive = isLive;
                        }

                        if(isImplementation) {
                            p.points.implementation += c.spent;

                            if (p.implementationStart === 0 || w.key < p.implementationStart) {
                                p.implementationStart = w.key;
                            }

                            if (w.key > p.implementationEnd) {
                                p.implementationEnd = w.key;
                            }
                        } else if (isReview) {
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
                        const newClient = new ClientModel(c.project, {
                            cards: [c],
                            name: c.project,
                            points: {
                                spent: c.spent,
                                estimated: c.estimated,
                                implementation: isImplementation ? c.spent : 0,
                                review: isReview ? c.spent : 0
                            },
                            implementationStart: isImplementation ? w.key : 0,
                            implementationEnd: isImplementation ? w.key : 0,
                            isLive: isLive,
                            reviewStart: isReview ? w.key : 0,
                            reviewEnd: isReview ? w.key : 0,
                            reviewsCount: 0,
                            lastUpdate: new Date()
                        });

                        clients.push(newClient);
                    }
                }
            });
        });

        return clients;
    }
}
