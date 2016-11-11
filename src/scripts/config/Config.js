const Config = {
    name: 'fo-monitor',
    shellCacheName: 'fo-monitor',
    dataCacheName: 'fo-monitor-data',
    version: 1,
    debug: true,
    trello: {
        url: 'https://api.trello.com/1/boards/577130dfed8fabf757eddc60/lists',
        filters: 'cards=open&card_fields=name,labels&fields=name,desc'
    },
    stores: {
        TestModel: {
            properties: {
                autoIncrement: true,
                keyPath: 'url'
            },
            indexes: {
                time: { unique: true }
            }
        },
        AppModel: {
            deleteOnUpgrade: true,
            properties: {
                autoIncrement: true
            }
        }
    }
};

export default Config;
