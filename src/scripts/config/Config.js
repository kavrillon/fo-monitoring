const Config = {
    name: 'fo-monitoring',
    shellCacheName: 'fo-monitoring',
    dataCacheName: 'fo-monitoring-data',
    version: 1,
    debug: true,
    trello: {
        key: 'd54e7add79eb871a615dcdb47033a99b',
        connectUrl: 'https://trello.com/1/authorize?name=fo-monitoring&scope=read&expiration=30days&response_type=token',
        url: 'https://api.trello.com/1/boards/577130dfed8fabf757eddc60/lists',
        filters: '?cards=open&card_fields=name,labels&fields=name,desc'
    },
    stores: {
        WeekModel: {
            properties: {
                // autoIncrement: true,
                // keyPath: 'url'
            },
            indexes: {
                // number: { unique: true }
                // time: { unique: true }
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
