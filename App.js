import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [userName, setUserName] = useState(null)

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setIsFetched(false);
    await axios.post(`http://dev-api.modulabs.im/v1/common/detail/user/qr/${data}`).then((res) => {
      setIsFetched(true)
      setUserName(res.data.data.userName)
    }).catch(() => {
      throw Error('로그인 정보를 확인해 주세요.')
    })
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (scanned) {
      setTimeout(() => {
        setScanned(false)
      }, 2000)
    }
  },[scanned])

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && isFetched && 
        <View style={styles.modal}>
          <Text style={styles.modalText}>반갑습니다</Text>
          <Text style={styles.modalDescription}>{`${userName}님`}</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 150,
    borderRadius: 20,
    gap: 15,
    backgroundColor: 'white'
  },
  modalText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },  
  modalDescription: {
    color: '#777',
    fontSize: 40,
    fontWeight: 'light',
  }
});