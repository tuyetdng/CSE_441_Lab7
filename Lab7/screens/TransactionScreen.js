import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';

const TransactionScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        'https://kami-backend-5rs0.onrender.com/Transactions',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const totalAmount = item.services.reduce((sum, service) => 
      sum + (service.price * service.quantity), 0);

    return (
      <TouchableOpacity
        style={styles.transactionCard}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: item._id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.serviceCount}>
            {item.services.length} service{item.services.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.amount}>{totalAmount.toLocaleString()} đ</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  const renderAddButton = () => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('AddTransaction')}
      style={styles.addButton}
    >
      <Icon name="add" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Transactions"
        rightComponent={renderAddButton()}
      />
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No transactions found'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardHeader: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    marginRight: 16,
    alignItems: 'flex-end',
  },
  serviceCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e91e63',
  },
  addButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionScreen;