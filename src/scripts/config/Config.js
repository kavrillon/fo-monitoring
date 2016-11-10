const Config = {
    name: 'pwa-monitoring',
    version: 1,
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
