import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Builder, { DB } from 'crane';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export default function App() {
  useEffect(() => {
    testDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

export async function testDB() {
  await initDB();
  await queries();
}

export async function initDB() {
  await testDriver();
  await loadDB();
}

export async function testDriver() {
  const dummy = SQLite.openDatabase('dummy.db');

  try {
    await dummy.transaction(tx => tx.executeSql(''));
  } catch (e) {
    if (this.state.debugEnabled)
      console.log('error while executing SQL in dummy DB');
  }
}

export async function loadDB() {
  let dbFile = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/db.db`);

  if (!dbFile.exists)
    makeDir();

  DB.addConnection({
    type: 'expo',
    driver: SQLite,
    name: 'db.db',
  });
}

export async function makeDir() {
  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/db/db.db')).uri,
    `${FileSystem.documentDirectory}SQLite/db.db`
  );
}

export async function queries() {
  listTables();
  // get();
  // insertOrIgnore();
  // insertGetId();
  // insert();
  // update();
  // updateOrInsert();
  // del();
  // increment();
  // decrement();
  // truncate();
  // find();
  // value();
  // pluck();
}

export function value() {
  Builder()
    .table('employees')
    .where('Title', 'Sales Support Agent')
    .value('FirstName')
    .then(res => console.log(9, 'res:value', res))
    .catch(err => console.log(9, 'err:value', err))
}

export function pluck() {
  Builder()
    .table('employees')
    .where('Title', 'Sales Support Agent')
    .pluck('FirstName', 'LastName')
    .then(res => console.log(10, 'res:pluck', res))
    .catch(err => console.log(10, 'err:pluck', err))
}

export function get() {
  Builder()
    .table('albums')
    .where('ArtistId', '>', 200)
    .get()
    .then(res => {
      console.log('PRE', 'res:get', res)
    })
    .catch((err) => {
      console.log('PRE', 'err:get', err)
    });
}

export function del() {
  Builder()
    .table('artists')
    .where('ArtistId', 505)
    .delete()
    .then(res => {
      console.log(3, 'res:delete', res)
    })
    .catch((err) => {
      console.log(3, 'err:delete', err)
    });
}

export function insert() {
  Builder()
    .table('artists')
    .insert({
      ArtistId: 500,
      Name: 'Euismod Pellentesque'
    }).then(res => {
    console.log(0, 'res:insert', res);

    Builder()
      .table('artists')
      .where('ArtistId', 500)
      .get()
      .then(res => {
        console.log(0, 'res:get', res)
      }).catch((err) => {
      console.log(0, 'err:get', err)
    });
  }).catch((err) => {
    console.log(0, 'err:insert', err);
  });

  // Bulk
  Builder()
    .table('artists')
    .insert([
      {
        ArtistId: 501,
        Name: 'Dolor Tortor'
      },
      {
        ArtistId: 502,
        Name: 'Fringilla Tellus'
      },
    ]).then(res => {
    console.log(1, 'res:insertBulk', res);

    Builder()
      .table('artists')
      .where([
        ['ArtistId', '=', 502],
        ['ArtistId', '=', 503]
      ])
      .get()
      .then(res => {
        console.log(1, 'res:get', res)
      }).catch((err) => {
      console.log(1, 'err:get', err)
    });
  }).catch((err) => {
    console.log(1, 'err:insertBulk', err);
  });
}

export function insertOrIgnore() {
  Builder()
    .table('artists')
    .insertOrIgnore({
      ArtistId: 505,
      Name: 'Fusce Pellentesque'
    }).then(res => {
    console.log(5, 'res:insertOrIgnore', res);

    Builder()
      .table('artists')
      .where('ArtistId', 505)
      .get()
      .then(res => {
        console.log(5, 'res:get', res)
      }).catch((err) => {
      console.log(5, 'err:get', err)
    });
  }).catch((err) => {
    console.log(5, 'err:insertOrIgnore', err);
  });
}

export function update() {
  Builder()
    .table('artists')
    .where('ArtistId', 1)
    .update({
      Name: 'Wkwk'
    }).then(res => {
    console.log(6, 'res:update', res);

    Builder()
      .table('artists')
      .where('ArtistId', 1)
      .get()
      .then(res => {
        console.log(6, 'res:get', res)
      }).catch((err) => {
      console.log(6, 'err:get', err)
    });
  }).catch((err) => {
    console.log(6, 'err:update', err);
  });
}

export function updateOrInsert() {
  Builder()
    .table('artists')
    .updateOrInsert(
      {ArtistId: 506},
      {Name: 'Polymer'}
    )
    .then(res => {
      console.log(7, 'res:updateOrInsert', res);

      Builder()
        .table('artists')
        .where('ArtistId', 506)
        .get()
        .then(res => {
          console.log(7, 'res:get', res)
        }).catch((err) => {
        console.log(7, 'err:get', err)
      });
    }).catch((err) => {
    console.log(7, 'err:updateOrInsert', err);
  });
}

export function increment() {
  Builder()
    .table('invoices')
    .where('InvoiceId', 3)
    .get()
    .then(res => {
      console.log(7.1, 'res:get', res);

      Builder()
        .table('invoices')
        .where('InvoiceId', 3)
        .increment('Total', 1)
        .then(res => {
          console.log(7.2, 'res:increment', res);

          Builder()
            .table('invoices')
            .where('InvoiceId', 3)
            .get()
            .then(res => {
              console.log(7.3, 'res:get', res)
            }).catch((err) => {
            console.log(7.3, 'err:get', err)
          });
        }).catch((err) => {
        console.log(7.2, 'err:increment', err);
      });
    }).catch((err) => {
    console.log(7.1, 'err:get', err)
  });
}

export function decrement() {
  Builder()
    .table('invoices')
    .where('InvoiceId', 3)
    .get()
    .then(res => {
      console.log(8.1, 'res:get', res);

      Builder()
        .table('invoices')
        .where('InvoiceId', 3)
        .decrement('Total', 1)
        .then(res => {
          console.log(8.2, 'res:decrement', res);

          Builder()
            .table('invoices')
            .where('InvoiceId', 3)
            .get()
            .then(res => {
              console.log(8.3, 'res:get', res)
            }).catch((err) => {
            console.log(8.3, 'err:get', err)
          });
        }).catch((err) => {
        console.log(8.2, 'err:decrement', err);
      });
    }).catch((err) => {
    console.log(8.1, 'err:get', err)
  });
}

export function truncate() {
  Builder()
    .table('invoices')
    .truncate()
    .then(res => {
      console.log('res:truncate', res)
    })
    .catch(err => {
      console.log('err:truncate', err)
    })
}

export function insertGetId() {
  Builder()
    .table('artists')
    .insertGetId({
      ArtistId: 504,
      Name: 'Dapibus Risus'
    }).then(res => {
    console.log(4, 'res:insertGetId', res);

    Builder()
      .table('artists')
      .where('ArtistId', 504)
      .get()
      .then(res => {
        console.log(4, 'res:get', res)
      }).catch((err) => {
      console.log(4, 'err:get', err)
    });
  }).catch((err) => {
    console.log(4, 'err:insertGetId', err);
  });
}

export function aggregates() {
  Builder()
    .table('customers')
    .where('PostalCode', "14700")
    .exists()
    .then(res => {
      console.log(0, 'response:exists', res)
    })
    .catch(err => {
      console.log(0, 'error', err)
    });

  Builder()
    .table('customers')
    .where('PostalCode', "14700")
    .doesntExist()
    .then(res => {
      console.log(1, 'response:doesntexist', res)
    })
    .catch(err => {
      console.log(1, 'error', err)
    });

  Builder()
    .table('customers')
    .count()
    .then(res => {
      console.log(2, 'response:count', res)
    })
    .catch(err => {
      console.log(2, 'error', err)
    });

  Builder()
    .table('invoices')
    .max('total')
    .then(res => {
      console.log(3, 'response:max', res)
    })
    .catch(err => {
      console.log(3, 'error', err)
    });

  Builder()
    .table('invoices')
    .min('total')
    .then(res => {
      console.log(4, 'response:min', res)
    })
    .catch(err => {
      console.log(4, 'error', err)
    });

  Builder()
    .table('invoices')
    .avg('total')
    .then(res => {
      console.log(5, 'response:avg', res)
    })
    .catch(err => {
      console.log(5, 'error', err)
    });

  Builder()
    .table('invoices')
    .sum('total')
    .then(res => {
      console.log(6, 'response:sum', res)
    })
    .catch(err => {
      console.log(6, 'error', err)
    });
}

export function union() {
  const first = Builder().table('customers')
    .whereNull('Company');

  Builder().table('customers')
    .whereNull('State')
    .union(first)
    .get()
    .then(res => {
      console.log('response', res)
    })
    .catch(err => {
      console.log('error', err)
    });
}

export function listTables() {
  const db = SQLite.openDatabase('db.db');

  db.transaction(tx => {
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table'",
      null,
      (_, res) => {
        console.log(1, {res})
      },
      (_, err) => {
        console.log(2, {err})
      }
    )
  });
}

export function test() {
  const db = SQLite.openDatabase('db.db');

  db.transaction(tx => {
    tx.executeSql(
      'SELECT "Title" from "albums"',
      null,
      (_, res) => {
        console.log(1, {res})
      },
      (_, err) => {
        console.log(2, {err})
      }
    )
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
