import ConfigManagerInstance from './ConfigManager';

class Database {
    constructor() {
        ConfigManagerInstance().then((configManager) => {
            const config = configManager.config;

            this.db_ = null;
            this.name_ = config.name;
            this.version_ = config.version;
            this.stores_ = config.stores;
        });
    }

    getStore(storeName) {
        if (!this.stores_[storeName]) {
            throw `There is no store with name "${storeName}"`;
        }

        return this.stores_[storeName];
    }

    open() {
        if (this.db_) {
            return Promise.resolve(this.db_);
        }

        return new Promise((resolve, reject) => {
            const dbOpen = indexedDB.open(this.name_, this.version_);

            dbOpen.onupgradeneeded = (e) => {
                this.db_ = e.target.result;

                const storeNames = Object.keys(this.stores_);
                let storeName;

                for (let s = 0; s < storeNames.length; s++) {
                    storeName = storeNames[s];

                    // If the store already exists
                    if (this.db_.objectStoreNames.contains(storeName)) {
                        // Check to see if the store should be deleted.
                        // If so delete, and if not skip to the next store.
                        if (this.stores_[storeName].deleteOnUpgrade) {
                            this.db_.deleteObjectStore(storeName);
                        } else {
                            continue;
                        }
                    }

                    const dbStore = this.db_.createObjectStore(
                        storeName,
                        this.stores_[storeName].properties
                    );

                    if (typeof this.stores_[storeName].indexes !== 'undefined') {
                        const indexes = this.stores_[storeName].indexes;
                        const indexNames = Object.keys(indexes);
                        let index;

                        for (let i = 0; i < indexNames.length; i++) {
                            index = indexNames[i];
                            dbStore.createIndex(index, index, indexes[index]);
                        }
                    }
                }
            };

            dbOpen.onsuccess = (e) => {
                this.db_ = e.target.result;
                resolve(this.db_);
            };

            dbOpen.onerror = (e) => {
                reject(e);
            };
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (!this.db_) {
                reject('No database connection');
            }

            this.db_.close();
            resolve(this.db_);
        });
    }

    nuke() {
        return new Promise((resolve, reject) => {
            this.close();

            const dbTransaction = indexedDB.deleteDatabase(this.name_);
            dbTransaction.onsuccess = (e) => {
                resolve(e);
            };

            dbTransaction.onerror = (e) => {
                reject(e);
            };
        });
    }

    put(storeName, value, key) {
        return this.open().then((db) => {
            return new Promise((resolve, reject) => {
                const dbTransaction = db.transaction(storeName, 'readwrite');
                const dbStore = dbTransaction.objectStore(storeName);
                const dbRequest = dbStore.put(value, key);

                dbTransaction.oncomplete = () => {
                    resolve(dbRequest.result);
                };

                dbTransaction.onabort =
                dbTransaction.onerror = (e) => {
                    reject(e);
                };
            });
        });
    }

    get(storeName, value) {
        return this.open().then((db) => {
            return new Promise((resolve, reject) => {
                const dbTransaction = db.transaction(storeName, 'readonly');
                const dbStore = dbTransaction.objectStore(storeName);
                let dbStoreRequest;

                dbTransaction.oncomplete = () => {
                    resolve(dbStoreRequest.result);
                };

                dbTransaction.onabort =
                dbTransaction.onerror = (e) => {
                    reject(e);
                };

                dbStoreRequest = dbStore.get(value);
            });
        });
    }

    getAll(storeName, index, order) {
        return this.open().then((db) => {
            return new Promise((resolve, reject) => {
                const dbTransaction = db.transaction(storeName, 'readonly');
                const dbStore = dbTransaction.objectStore(storeName);
                let dbCursor;

                if (typeof order !== 'string') {
                    order = 'next';
                }

                if (typeof index !== 'string') {
                    dbCursor = dbStore.index(index).openCursor(null, order);
                } else {
                    dbCursor = dbStore.openCursor();
                }

                const dbResults = [];

                dbCursor.onsuccess = (e) => {
                    const cursor = e.target.result;

                    if (cursor) {
                        dbResults.push({
                            key: cursor.key,
                            value: cursor.value
                        });
                        cursor.continue();
                    } else {
                        resolve(dbResults);
                    }
                };

                dbCursor.onerror = (e) => {
                    reject(e);
                };
            });
        });
    }

    delete(storeName, key) {
        return this.open().then((db) => {
            return new Promise((resolve, reject) => {
                const dbTransaction = db.transaction(storeName, 'readwrite');
                const dbStore = dbTransaction.objectStore(storeName);

                dbTransaction.oncomplete = (e) => {
                    resolve(e);
                };

                dbTransaction.onabort =
                dbTransaction.onerror = (e) => {
                    reject(e);
                };

                dbStore.delete(key);
            });
        });
    }

    deleteAll(storeName) {
        return this.open().then((db) => {
            return new Promise((resolve, reject) => {
                const dbTransaction = db.transaction(storeName, 'readwrite');
                const dbStore = dbTransaction.objectStore(storeName);
                const dbRequest = dbStore.clear();

                dbRequest.onsuccess = (e) => {
                    resolve(e);
                };

                dbRequest.onerror = (e) => {
                    reject(e);
                };
            });
        });
    }
}

export default function DatabaseInstance() {
    if (typeof window.DatabaseInstance_ !== 'undefined') {
        return Promise.resolve(window.DatabaseInstance_);
    }

    window.DatabaseInstance_ = new Database();

    return Promise.resolve(window.DatabaseInstance_);
}
