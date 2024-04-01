import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';


const LoadingSpinner = () => {
    return (
      <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };
export default LoadingSpinner

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
})