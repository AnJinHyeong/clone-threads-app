import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  description: string;
  profileImageUrl: string;
}

export const AuthContext = createContext<{
  user?: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
}>({
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const login = async () => {
    console.log('login >>> 🔥');

    return fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'Denji',
        password: '1234',
      }),
    })
      .then(res => {
        console.log('response >>>', res, res.status);
        if (res.status >= 401) {
          return Alert.alert('Error', 'Invalid username or password');
        }
        return res.json();
      })
      .then(data => {
        console.log('data >>> 🚨', data);
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync('accessToken', data.accessToken),
          SecureStore.setItemAsync('refreshToken', data.refreshToken),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]);
      })
      .catch(error => console.error(error));
  };

  const logout = () => {
    setUser(null);
    return Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      AsyncStorage.removeItem('user'),
    ]);
  };

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      setUser(user ? JSON.parse(user) : null);
    });
    //TODO: accessToken 유효성 검사
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthContext.Provider>
  );
}
