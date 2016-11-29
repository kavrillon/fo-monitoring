import Controller from '../../libs/Controller';
import TopicTemplate from '../../templates/Topic/TopicTemplate';
import TopicModel from '../../model/TopicModel';
import DateUtils from '../../libs/DateUtils';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

export default class ProductController extends Controller {
    constructor(data) {
        super();

        // Controller vars
        this.products = this.parseDataForProduct(data);
        this.productsList = [];

        // DOM vars
        this.productsContainer = document.querySelector('[js-product-list]');

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

        document.querySelector('[js-product-count]').innerHTML = `${this.products.length} topics`;
    }

    parseDataForProduct(data) {
        let products = [];

        data.forEach((w) => {
            const starts = DateUtils.getDateOfISOWeek(w.key, 2016);
            const ends = DateUtils.getDateOfISOWeek(w.key, 2016, 5);

            w.cards.forEach((c) => {
                if (c.type === 'product' && c.spent > 0) {
                    let p = _find(products, (o) => {
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
