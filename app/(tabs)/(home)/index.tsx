import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isLoggedIn = false;

  console.log('pathname >>>', pathname);
  console.log('insets >>>', insets);

  const { width, height } = Dimensions.get('window');
  console.log('화면 너비 / 화면 높이 >>>> width / height', width / height);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BlurView intensity={70} style={styles.header}>
        <Image
          source={require('../../../assets/images/react-logo.png')}
          style={styles.headerLogo}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push(`/login`)}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </BlurView>

      {isLoggedIn && (
        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.replace(`/`)}>
              <Text style={{ color: pathname === '/' ? 'red' : 'black' }}>
                For You
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.replace(`/following`)}>
              <Text style={{ color: pathname === '/' ? 'black' : 'red' }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View>
        <TouchableOpacity onPress={() => router.push(`/@notjin/post/1`)}>
          <Text>게시글1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@notjin/post/2`)}>
          <Text>게시글2</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@notjin/post/3`)}>
          <Text>게시글3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },
  headerLogo: {
    width: 42, //DP, DIP 단위
    height: 42,
  },
  loginButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
});
