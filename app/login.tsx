import { Redirect, router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const insets = useSafeAreaInsets();
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const onLoginPress = () => {
    console.log('LOGIN');

    fetch('/login', {
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
        console.log('data >>>', data);
      })
      .catch(error => {
        console.error('error >>>', error);
      });
  };

  return (
    <View style={{ paddingTop: insets.top }}>
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <Pressable onPress={onLoginPress} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
