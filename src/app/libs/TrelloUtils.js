import Trello from 'node-trello';
import DateUtils from './DateUtils';
import ConfigManagerInstance from './ConfigManager';
import WeekModel from '../model/WeekModel';
import CardModel from '../model/CardModel';

export default class TrelloUtils extends Trello {
    constructor(key, token) {
        super(key, token);
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
        const promises = [];

        return new Promise((resolve, reject) => {
            ConfigManagerInstance().then(configManager => {
                configManager.config.trello.boards.forEach((b) => {
                    promises.push(new Promise((resolve, reject) => {
                        this.get(b.url, {
                            cards: 'open',
                            card_fields:'id,idShort,name,labels,url,shortUrl,desc,descData',
                            fields:'name,desc'
                        }, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(this.parseData(b.year, data));
                            }
                        });
                    }));
                });

                Promise.all(promises).then(() => {
                    resolve(this.data);
                });
            });
        });
    }

    parseData(year, data) {
        if (data.length > 0) {
            data.forEach(item => {
                const matches = item.name.match(/^W(\d+).*:\s*(\d+)/);
                if (matches && matches.length > 0) {
                    const weekNumber = parseInt(matches[1]);
                    const weekPoints = parseInt(matches[2]);

                    const w = new WeekModel(year + '-' + weekNumber);
                    w.year = year;
                    w.number = weekNumber;
                    w.startDate = DateUtils.getDateOfISOWeek(weekNumber, year);
                    w.endDate = DateUtils.getDateOfISOWeek(weekNumber, year, 5);
                    w.points.available = weekPoints;
                    w.lastUpdate = new Date();

                    item.cards.forEach(c => {
                        const card = this.parseCardData(w, c);

                        // weeks data
                        w.cards.push(card);
                        w.points.estimated = Math.round((w.points.estimated + card.estimated) * 100) / 100;
                        w.points.spent = Math.round((w.points.spent + card.spent) * 100) / 100;

                        if (card.type) {
                            w.points[card.type] = Math.round((w.points[card.type] + card.spent) * 100) / 100;
                        }
                    });

                    w.activity.project = Math.round(w.points.project / w.points.spent * 10000) / 100;
                    w.activity.product = Math.round(w.points.product / w.points.spent * 10000) / 100;
                    w.activity.support = Math.round(w.points.support / w.points.spent * 10000) / 100;
                    w.activity.process = Math.round(w.points.process / w.points.spent * 10000) / 100;
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

        c.week = week.key;
        c.name = card.name.replace(/\((([0-9]*[.])?[0-9]+)\)/, '').replace(/\[(([0-9]*[.])?[0-9]+)\]/, '');
        c.estimated = (res = card.name.match(/\((([0-9]*[.])?[0-9]+)\)/)) === null ? 0 : parseFloat(res[1]);
        c.spent = (res = card.name.match(/\[(([0-9]*[.])?[0-9]+)\]/)) === null ? 0 : parseFloat(res[1]);
        c.desc = card.desc;
        c.url = card.shortUrl;

        c.type = null;
        c.version = 'V2'; // V2 when not precised
        c.labels = [];
        card.labels.forEach((l) => {
            if (types.includes(l.name)) {
                c.type = l.name.toLowerCase();
            } else if (versions.includes(l.name)) {
                c.version = l.name;
            } else {
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
