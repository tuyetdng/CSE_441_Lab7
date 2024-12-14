import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DeleteTransactionScreen = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const { token } = useAuth();

  React.useEffect(() => {
    showDeleteConfirmation();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://kami-backend5rs0.onrender.com/transactions/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to remove this transaction? This will not be possible to return',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'DELETE',
          onPress: handleDelete,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction detail</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e91e63',
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default DeleteTransactionScreen;
