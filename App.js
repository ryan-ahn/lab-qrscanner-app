import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null)

  const handleBarCodeScanned = ({ data }) => {
    if (hasPermission && !scanned) {
      console.log(data)
      setScanned(true)
      axios.post(`https://hocalhost:8080/v1/common/detail/qr`, {userId: data})
    }
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (hasPermission && scanned) {
      setTimeout(() => {
        setScanned(false)
      }, 2000)
    }
  },[scanned])

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && 
        <View style={styles.modal}>
          <Text style={styles.modalText}>반갑습니다</Text>
          <Text style={styles.modalDescription}>{`${data}님`}</Text>
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