const Config = {
    name: 'fo-sprints',
    shellCacheName: 'fo-sprints',
    dataCacheName: 'fo-sprints-data',
    version: 1,
    debug: true,
    trello: {
        key: 'd54e7add79eb871a615dcdb47033a99b',
        connectUrl: 'https://trello.com/1/authorize?name=fo-sprints&scope=read&expiration=30days&response_type=token',
        boards: [
            {
                year: 2017,
                url: '1/boards/5873497b3b5a6abf4aefc12a/lists'
            },
            {
                year: 2016,
                url: '1/boards/577130dfed8fabf757eddc60/lists'
            }
        ],
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
    },
    highlights: {
        implementation: 15,
        review: 10
    }
};

export default Config;
