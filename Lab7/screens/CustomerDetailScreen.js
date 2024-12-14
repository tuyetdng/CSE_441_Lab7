import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import CustomHeader from '../components/CustomHeader';

const ThreeDotMenu = ({ navigation, customer, handleDelete }) => (
  <Menu>
    <MenuTrigger>
      <Icon name="more-vert" size={24} color="#fff" style={{ marginRight: 15 }} />
    </MenuTrigger>
    <MenuOptions customStyles={{
      optionsContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        width: 150,
        elevation: 3,
      }
    }}>
      <MenuOption onSelect={() => navigation.navigate('EditCustomer', { customer })} style={styles.menuOption}>
        <Icon name="edit" size={20} color="#e91e63" />
        <Text style={styles.menuText}>Edit</Text>
      </MenuOption>
      <MenuOption onSelect={handleDelete} style={styles.menuOption}>
        <Icon name="delete" size={20} color="#e91e63" />
        <Text style={styles.menuText}>Delete</Text>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

const CustomerDetailScreen = ({ route, navigation }) => {
  const [customer, setCustomer] = useState(null);
  const { customerId } = route.params;

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    if (customer) {
      navigation.setOptions({
        title: customer.name,
        headerStyle: {
          backgroundColor: '#e91e63',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <ThreeDotMenu 
            navigation={navigation} 
            customer={customer} 
            handleDelete={handleDelete}
          />
        ),
      });
    }
  }, [customer]);

  const fetchCustomerDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `https://kami-backend-5rs0.onrender.com/Customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      Alert.alert('Error', 'Failed to fetch customer details');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              await axios.delete(
                `https://kami-backend-5rs0.onrender.com/Customers/${customerId}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete customer:', error);
              Alert.alert('Error', 'Failed to delete customer');
            }
          }
        }
      ]
    );
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Customer Detail"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  const calculateTotalSpent = () => {
    if (!customer.transactions) return 0;
    return customer.transactions.reduce((total, transaction) => {
      const transactionTotal = transaction.services?.reduce(
        (sum, service) => sum + (service.price * service.quantity),
        0
      ) || 0;
      return total + transactionTotal;
    }, 0);
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title={customer.name}
        onBack={() => navigation.goBack()}
        rightComponent={<ThreeDotMenu navigation={navigation} customer={customer} handleDelete={handleDelete}/>}
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{customer.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{customer.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total spent:</Text>
            <Text style={[styles.value, { color: '#e91e63' }]}>
              {calculateTotalSpent().toLocaleString()} đ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Last update:</Text>
            <Text style={styles.value}>
              {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction history</Text>
          {customer.transactions?.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <Text style={styles.transactionId}>HD{transaction._id}</Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
              </Text>
              {transaction.services?.map((service, sIndex) => (
                <View key={sIndex} style={styles.serviceRow}>
                  <Text style={styles.serviceName}>- {service.name}</Text>
                  <Text style={styles.servicePrice}>
                    {(service.price * service.quantity).toLocaleString()} đ
                  </Text>
                </View>
              ))}
            </View>
          ))}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#e91e63',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  transactionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 14,
    color: '#e91e63',
    marginLeft: 8,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default CustomerDetailScreen;
