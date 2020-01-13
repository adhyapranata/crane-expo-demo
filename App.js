import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    if (this.state.debugEnabled) console.log('error while executing SQL in dummy DB');
  }
}

export function loadDB() {
  FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/db/db.db')).uri,
    `${FileSystem.documentDirectory}SQLite/db.db`
  ).then(function() {
    let db = SQLite.openDatabase('db.db');

    console.log({db});
    // register crane here
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
