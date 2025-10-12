import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  console.log('pathname >>>', pathname);
  console.log('insets >>>', insets);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
  },
});
