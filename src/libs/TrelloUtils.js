import Trello from 'node-trello';
import DateUtils from '../libs/DateUtils';
import WeekModel from '../model/WeekModel';
import _ from 'lodash';
import ConfigManagerInstance from '../libs/ConfigManager';

export default class TrelloUtils extends Trello {
    constructor(key, token) {
        super(key, token);
        this.currentYear = 2016;
    }

    static connectToTrello() {
        ConfigManagerInstance().then(configManager => {
            const connectUrl = `${configManager.config.trello.connectUrl}&key=${configManager.config.trello.key}&return_url=${window.location.origin}${window.location.pathname}`;
            window.location.href = connectUrl;
        });
    }

    getParsedData() {
        return new Promise((resolve, reject) => {
            this.get('1/boards/577130dfed8fabf757eddc60/lists', {
                cards: 'open',
                card_fields:'name,labels,url',
                fields:'name,desc'
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.parseData(data));
                }
            });
        });
    }

    parseData(data) {
        const weeks = [];

        if (data.length > 0) {
            data.forEach(item => {
                const matches = item.name.match(/^W(\d+).*:\s*(\d+)/);
                if (!(matches && matches.length > 0)) {
                    //TODO: no match: what to do ?
                } else {
                    const weekNumber = parseInt(matches[1]);
                    const weekPoints = parseInt(matches[2]);

                    const w = new WeekModel(weekNumber);
                    w.startDate = DateUtils.getDateOfISOWeek(weekNumber, this.currentYear);
                    w.endDate = DateUtils.getDateOfISOWeek(weekNumber, this.currentYear, 5);
                    w.points.available = weekPoints;
                    w.lastUpdate = new Date();

                    item.cards.forEach(c => {
                        let res;
                        const estimatedPoints = (res = c.name.match(/\((([0-9]*[.])?[0-9]+)\)/)) === null ? 0 : parseFloat(res[1]);
                        const spentPoints = (res = c.name.match(/\[(([0-9]*[.])?[0-9]+)\]/)) === null ? 0 : parseFloat(res[1]);

                        const name = c.name.replace(/\((([0-9]*[.])?[0-9]+)\)/, '').replace(/\[(([0-9]*[.])?[0-9]+)\]/, '');

                        let type = _.find(c.labels, (o) => {
                            return o.name === 'Support' || o.name === 'Monitoring' || o.name === 'Product';
                        });

                        if (typeof type === 'undefined') {
                            type = 'Delivery'; // default type
                        } else {
                            type = type.name;
                        }

                        w.points.estimated += estimatedPoints;
                        w.points.spent += spentPoints;

                        switch (type) {
                            case 'Delivery':
                                w.points.delivery += spentPoints;
                                break;
                            case 'Product':
                                w.points.product += spentPoints;
                                break;
                            case 'Monitoring':
                                w.points.monitoring += spentPoints;
                                break;
                            case 'Support':
                                w.points.support += spentPoints;
                                break;
                            default:
                                break;
                        }

                        w.cards.push({
                            name: name,
                            type: type,
                            url: c.url,
                            labels: c.labels,
                            estimated: estimatedPoints,
                            spent: spentPoints
                        });
                    });

                    w.activity.delivery = w.points.delivery / w.points.spent * 100;
                    w.activity.product = w.points.product / w.points.spent * 100;
                    w.activity.support = w.points.support / w.points.spent * 100;
                    w.activity.monitoring = w.points.monitoring / w.points.spent * 100;
                    w.activity.total = w.activity.delivery + w.activity.product + w.activity.support + w.activity.monitoring;

                    weeks.push(w);
                }
            });
        }

        return weeks;
    }
}
