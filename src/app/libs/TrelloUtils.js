import Trello from 'node-trello';
import DateUtils from './DateUtils';
import ConfigManagerInstance from './ConfigManager';
import WeekModel from '../model/WeekModel';
import CardModel from '../model/CardModel';
import _find from 'lodash/find';

export default class TrelloUtils extends Trello {
    constructor(key, token) {
        super(key, token);
        this.currentYear = 2016;
        this.data = [];
    }

    static connectToTrello() {
        ConfigManagerInstance().then(configManager => {
            const connectUrl = `${configManager.config.trello.connectUrl}&key=${configManager.config.trello.key}&return_url=${window.location.origin}${window.location.pathname}`;
            window.location.href = connectUrl;
        });
    }

    getUserData() {
        return new Promise((resolve, reject) => {
            this.get('1/members/me', {
                // fields:'username,fullname,url'
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getParsedData() {
        return new Promise((resolve, reject) => {
            this.get('1/boards/577130dfed8fabf757eddc60/lists', {
                cards: 'open',
                card_fields:'id,idShort,name,labels,url,shortUrl',
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
        if (data.length > 0) {
            data.forEach(item => {
                const matches = item.name.match(/^W(\d+).*:\s*(\d+)/);
                if (matches && matches.length > 0) {
                    const weekNumber = parseInt(matches[1]);
                    const weekPoints = parseInt(matches[2]);

                    const w = new WeekModel(weekNumber);
                    w.startDate = DateUtils.getDateOfISOWeek(weekNumber, this.currentYear);
                    w.endDate = DateUtils.getDateOfISOWeek(weekNumber, this.currentYear, 5);
                    w.points.available = weekPoints;
                    w.lastUpdate = new Date();

                    item.cards.forEach(c => {
                        const card = this.parseCardData(weekNumber, c);

                        // weeks data
                        w.cards.push(card);
                        w.points.estimated += card.estimated;
                        w.points.spent += card.spent;

                        if (card.type) {
                            w.points[card.type] += card.spent;
                        }
                    });

                    w.activity.project = w.points.project / w.points.spent * 100;
                    w.activity.product = w.points.product / w.points.spent * 100;
                    w.activity.support = w.points.support / w.points.spent * 100;
                    w.activity.process = w.points.process / w.points.spent * 100;
                    w.activity.total = w.activity.project + w.activity.product + w.activity.support + w.activity.process;

                    this.data.push(w);
                }
            });
        }

        return this.data;
    }

    parseCardData(week, card) {
        const types = ['Support', 'Process', 'Product', 'Project'];
        const versions = ['V2', 'V3'];
        let res;
        const c = new CardModel(card.idShort);

        c.name = card.name.replace(/\((([0-9]*[.])?[0-9]+)\)/, '').replace(/\[(([0-9]*[.])?[0-9]+)\]/, '');
        c.estimated = (res = card.name.match(/\((([0-9]*[.])?[0-9]+)\)/)) === null ? 0 : parseFloat(res[1]);
        c.spent = (res = card.name.match(/\[(([0-9]*[.])?[0-9]+)\]/)) === null ? 0 : parseFloat(res[1]);
        c.url = card.shortUrl;
        c.week = week;

        c.type = null;
        c.version = null;
        c.labels = [];
        card.labels.forEach((l) => {
            if (types.includes(l.name)) {
                c.type = l.name.toLowerCase();
            }
            else if (versions.includes(l.name)) {
                c.version = l.name;
            }
            else {
                c.labels.push(l.name);
            }
        });

        // Card project: from regex on name
        res = c.name.match(/\[([^\]]*)\]/);
        if(res) {
            c.project = res[1];
        }

        return c;
    }
}
