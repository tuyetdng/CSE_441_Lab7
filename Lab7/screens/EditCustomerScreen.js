import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';

const EditCustomerScreen = ({ route, navigation }) => {
  const { customer } = route.params;
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        `https://kami-backend-5rs0.onrender.com/Customers/${customer._id}`,
        { name, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update customer:', error);
      Alert.alert('Error', 'Failed to update customer');
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Edit Customer"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Customer name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter customer name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#e91e63',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditCustomerScreen;
