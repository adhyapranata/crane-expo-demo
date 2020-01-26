import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Builder, { Database } from 'react-native-query-builder'
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export default function App() {
  useEffect(() => {
    makeSQLiteDirAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

export async function makeSQLiteDirAsync() {
  const dbTest = SQLite.openDatabase('dummy.db');

  try {
    await dbTest.transaction(tx => tx.executeSql(''));

    loadDB();
  } catch (e) {
    if (this.state.debugEnabled)
      console.log('error while executing SQL in dummy DB');
  }
}

export async function loadDB() {
  let dbFile = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/db.db`);

  if (!dbFile.exists) {
    await FileSystem.downloadAsync(
      Asset.fromModule(require('./assets/db/db.db')).uri,
      `${FileSystem.documentDirectory}SQLite/db.db`
    );

    dbFile = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/db.db`);

    console.log(dbFile);
  }

  Database.addConnection({
    type: 'expo',
    driver: SQLite,
    name: 'db.db',
  });

  testDatabase();
}

export function testDatabase() {
  // listTables();
  insertOrIgnore();
  // insertGetId();
  // get();
  // insert();
  // del();
}

export function get() {
  (new Builder())
    .table('artists')
    .where('ArtistId', '>', 500)
    .get()
    .then(res => {
      console.log('PRE', 'res:get', res)
    })
    .catch((err) => {
      console.log('PRE', 'err:get', err)
    });
}

export function del() {
  (new Builder())
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
  (new Builder())
    .table('artists')
    .insert({
      ArtistId: 500,
      Name: 'Euismod Pellentesque'
    }).then(res => {
      console.log(0, 'res:insert', res);

      (new Builder())
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
  (new Builder())
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

      (new Builder())
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
  (new Builder())
    .table('artists')
    .insertOrIgnore({
      ArtistId: 505,
      Name: 'Fusce Pellentesque'
    }).then(res => {
    console.log(5, 'res:insertOrIgnore', res);

    (new Builder())
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

export function insertGetId() {
  (new Builder())
    .table('artists')
    .insertGetId({
      ArtistId: 504,
      Name: 'Dapibus Risus'
    }).then(res => {
      console.log(4, 'res:insertGetId', res);

      (new Builder())
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
  (new Builder())
    .table('customers')
    .where('PostalCode', "14700")
    .exists()
    .then(res => {
      console.log(0, 'response:exists', res)
    })
    .catch(err => {
      console.log(0, 'error', err)
    });

  (new Builder())
    .table('customers')
    .where('PostalCode', "14700")
    .doesntExist()
    .then(res => {
      console.log(1, 'response:doesntexist', res)
    })
    .catch(err => {
      console.log(1, 'error', err)
    });

  (new Builder())
    .table('customers')
    .count()
    .then(res => {
      console.log(2, 'response:count', res)
    })
    .catch(err => {
      console.log(2, 'error', err)
    });

  (new Builder())
    .table('invoices')
    .max('total')
    .then(res => {
      console.log(3, 'response:max', res)
    })
    .catch(err => {
      console.log(3, 'error', err)
    });

  (new Builder())
    .table('invoices')
    .min('total')
    .then(res => {
      console.log(4, 'response:min', res)
    })
    .catch(err => {
      console.log(4, 'error', err)
    });

  (new Builder())
    .table('invoices')
    .avg('total')
    .then(res => {
      console.log(5, 'response:avg', res)
    })
    .catch(err => {
      console.log(5, 'error', err)
    });

  (new Builder())
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
  const first = (new Builder()).table('customers')
    .whereNull('Company');

  (new Builder()).table('customers')
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
