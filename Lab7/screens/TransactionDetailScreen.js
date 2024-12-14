import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllDetails, setShowAllDetails] = useState(false);

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  const fetchTransactionDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `https://kami-backend-5rs0.onrender.com/Transactions/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTransaction(response.data);
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
      Alert.alert('Error', 'Failed to fetch transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransaction = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to cancel this transaction? This will affect the customer transaction information',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              await axios.delete(
                `https://kami-backend-5rs0.onrender.com/Transactions/${transactionId}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              navigation.goBack();
            } catch (error) {
              console.error('Failed to cancel transaction:', error);
              Alert.alert('Error', 'Failed to cancel transaction');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Transaction Details"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Transaction Details"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Text>Transaction not found</Text>
        </View>
      </View>
    );
  }

  const totalAmount = transaction.services.reduce((sum, service) => 
    sum + (service.price * service.quantity), 0
  );

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Transaction Details"
        onBack={() => navigation.goBack()}
        rightComponent={
          <Menu>
            <MenuTrigger>
              <Icon name="more-vert" size={24} color="#fff" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => setShowAllDetails(!showAllDetails)}>
                <Text style={styles.menuOptionText}>See more details</Text>
              </MenuOption>
              <MenuOption onSelect={handleCancelTransaction}>
                <Text style={styles.menuOptionText}>Cancel transaction</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        }
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Transaction code</Text>
            <Text style={styles.value}>{transaction._id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{transaction.customer?.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Creation time</Text>
            <Text style={styles.value}>
              {new Date(transaction.createdAt).toLocaleString()}
            </Text>
          </View>
          {showAllDetails && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Last updated</Text>
                <Text style={styles.value}>
                  {new Date(transaction.updatedAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{transaction.status || 'Active'}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services list</Text>
          {transaction.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceQuantity}>x{service.quantity}</Text>
              </View>
              <Text style={styles.servicePrice}>
                {service.price.toLocaleString()} đ
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Amount of money</Text>
            <Text style={styles.value}>{totalAmount.toLocaleString()} đ</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>
              {(transaction.discount || 0).toLocaleString()} đ
            </Text>
          </View>
          <View style={[styles.infoRow, styles.totalRow]}>
            <Text style={[styles.label, styles.totalLabel]}>Total payment</Text>
            <Text style={[styles.value, styles.totalValue]}>
              {(totalAmount - (transaction.discount || 0)).toLocaleString()} đ
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e91e63',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  serviceItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  serviceQuantity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  servicePrice: {
    fontSize: 14,
    color: '#e91e63',
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 8,
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: '600',
  },
  menuOptionText: {
    fontSize: 14,
    color: '#333',
    padding: 12,
  },
});

export default TransactionDetailScreen;