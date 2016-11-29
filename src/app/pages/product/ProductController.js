import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import Chart from 'chart.js';

export default class ProductController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.products = this.parseDataForProduct(data);
        this.productsList = [];

        // DOM vars
        this.productsContainer = document.querySelector('[js-product-list]');

        this.displayData();
    }

    displayData() {
        // Displaying products
        _orderBy(this.products, 'name').forEach((p) => {
            let product = null;

            if (!this.productsList[p.key]) {
                product = new TopicTemplate(p);
                this.productsContainer.appendChild(product.getContent());
            } else {
                product = this.productsList[p.key];
                product.update(p);
            }

            this.productsList[p.key] = product;
        });

        const labels = _map(this.products, 'name');
        const values = _map(this.products, 'points.spent');

        // Display chart
        new Chart(document.getElementById('ChartProductRepartition'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ],
                        hoverBackgroundColor: [
                            '#ffce56',
                            '#44d279',
                            '#ff6384',
                            '#36a2eb'
                        ]
                    }
                ]
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    parseDataForProduct(data) {
        const products = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'product' && c.spent > 0) {
                    const p = _find(products, (o) => {
                        return o.key === c.project;
                    });

                    if (p) {
                        p.cards.push(c);
                        p.points.estimated += c.estimated;
                        p.points.spent += c.spent;

                        if (p.startDate > starts) {
                            p.startDate = starts;
                        }
                        if (p.endDate < ends) {
                            p.endDate = ends;
                        }
                        p.lastUpdate = new Date();
                    } else {
                        const newProduct = new TopicModel(c.project, {
                            cards: [c],
                            name: c.project,
                            points: {
                                spent: c.spent,
                                estimated: c.estimated
                            },
                            startDate: starts,
                            endDate: ends,
                            lastUpdate: new Date()
                        });

                        products.push(newProduct);
                    }
                }
            });
        });

        return products;
    }
}
