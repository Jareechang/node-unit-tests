/*  Note: Not for production use
 *
 *  use case: storing data in memory only with some db interface methods (etc. save)
 *
 * */

import root from 'window-or-global';
import Errors from './errors/index';

const ID_KEY = '__id';
const storage = []; // Temporarily use simple array...

/* Utils */
function isEmpty(obj) {
  return Object.keys(obj).length <= 0;
}

class DatabaseInMemory {
  constructor(store) {
    if (!storage) {
      throw Errors.DB_STORAGE_MISSING;
    }
    this.ids = [];
    this.storage = store;
  }

  save(obj) {
    if (isEmpty(obj)) {
      throw Errors.VALID_DB_OBJECT_REQUIRED;
    }
    if (!obj[ID_KEY] || this.idExists(obj[ID_KEY])) {
      throw Errors.DB_UNIQUE_ID;
    }
    this.ids.push(obj.__id);
    this.storage.push(obj);
  }

  idExists(id) {
    return this.ids.indexOf(id) >= 0;
  }

  clear() {
    this.ids = [];
    this.storage = [];
  }

  find(id) {
    return this.storage.filter(obj => obj[ID_KEY] === id);
  }
}

const databaseInMemory = new DatabaseInMemory(storage);
if (!root.__database_in_memory__) {
  root.__database_in_memory__ = databaseInMemory;
}

export {
  databaseInMemory,
  ID_KEY
};
