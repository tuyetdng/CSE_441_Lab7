import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';

const AddTransactionScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedServices, setSelectedServices] = useState([{ serviceId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomersAndServices();
  }, []);

  const fetchCustomersAndServices = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [customersResponse, servicesResponse] = await Promise.all([
        axios.get('https://kami-backend-5rs0.onrender.com/Customers', { headers }),
        axios.get('https://kami-backend-5rs0.onrender.com/Services', { headers })
      ]);

      setCustomers(customersResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load customers and services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setSelectedServices([...selectedServices, { serviceId: '', quantity: 1 }]);
  };

  const handleRemoveService = (index) => {
    const newServices = selectedServices.filter((_, i) => i !== index);
    setSelectedServices(newServices);
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...selectedServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setSelectedServices(newServices);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || selectedServices.some(s => !s.serviceId)) {
      Alert.alert('Error', 'Please select a customer and at least one service');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const selectedServicesData = selectedServices
        .filter(s => s.serviceId) // Remove any empty service selections
        .map(s => {
          const serviceInfo = services.find(srv => srv._id === s.serviceId);
          return {
            name: serviceInfo.name,
            price: serviceInfo.price,
            quantity: parseInt(s.quantity) || 1
          };
        });

      await axios.post(
        'https://kami-backend-5rs0.onrender.com/Transactions',
        {
          customerId: selectedCustomer,
          services: selectedServicesData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Add Transaction"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Add Transaction"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Customer *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={setSelectedCustomer}
              style={styles.picker}
            >
              <Picker.Item label="Select a customer" value="" />
              {customers.map(customer => (
                <Picker.Item 
                  key={customer._id} 
                  label={customer.name} 
                  value={customer._id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Services *</Text>
          {selectedServices.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.servicePickerContainer}>
                <Picker
                  selectedValue={service.serviceId}
                  onValueChange={(value) => handleServiceChange(index, 'serviceId', value)}
                  style={styles.servicePicker}
                >
                  <Picker.Item label="Select a service" value="" />
                  {services.map(s => (
                    <Picker.Item 
                      key={s._id} 
                      label={`${s.name} (${s.price} đ)`} 
                      value={s._id} 
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Qty:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={service.quantity.toString()}
                  onChangeText={(value) => handleServiceChange(index, 'quantity', value)}
                  keyboardType="numeric"
                />
              </View>

              {index > 0 && (
                <TouchableOpacity 
                  onPress={() => handleRemoveService(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity 
            style={styles.addServiceButton} 
            onPress={handleAddService}
          >
            <Text style={styles.addServiceButtonText}>Add Another Service</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  servicePickerContainer: {
    marginBottom: 8,
  },
  servicePicker: {
    height: 50,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  quantityInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#e91e63',
    fontSize: 14,
  },
  addServiceButton: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e91e63',
    marginTop: 8,
  },
  addServiceButtonText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#e91e63',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddTransactionScreen;
