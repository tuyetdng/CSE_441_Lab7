import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import CustomerScreen from '../screens/CustomerScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';
import TransactionScreen from '../screens/TransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import DeleteCustomerScreen from '../screens/DeleteCustomerScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import DeleteTransactionScreen from '../screens/DeleteTransactionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ServiceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ServicesList" component={HomeScreen} />
    <Stack.Screen name="AddService" component={AddServiceScreen} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
    <Stack.Screen name="EditService" component={EditServiceScreen} />
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomersList" component={CustomerScreen} />
    <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
    <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
    <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
    <Stack.Screen name="DeleteCustomer" component={DeleteCustomerScreen} />
    <Stack.Screen name="DeleteTransaction" component={DeleteTransactionScreen} />
  </Stack.Navigator>
);

const TransactionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TransactionsList" component={TransactionScreen} />
    <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Services') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Customers') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Transactions') {
          iconName = focused ? 'receipt' : 'receipt-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Services" component={ServiceStack} />
    <Tab.Screen name="Customers" component={CustomerStack} />
    <Tab.Screen name="Transactions" component={TransactionStack} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
