import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ListFooter({
  canAddThread,
  addThread,
}: {
  canAddThread: boolean;
  addThread: () => void;
}) {
  return (
    <View style={styles.listFooter}>
      <View style={styles.listFooterAvatar}>
        <Image
          source={require('../assets/images/denji.jpg')}
          style={styles.avatarSmall}
        />
      </View>
      <View>
        <Pressable onPress={addThread} style={styles.input}>
          <Text style={{ color: canAddThread ? '#999' : '#aaa' }}>
            Add to Thread
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

interface Thread {
  id: string;
  text: string;
  hashtag?: string;
  location?: [number, number];
  imageUris: string[];
}

export default function Modal() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([
    { id: Date.now().toString(), text: '', imageUris: [] },
  ]);

  const insets = useSafeAreaInsets();
  const [replyOption, setReplyOption] = useState<string>('Anyone');
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [replyOptions, setReplyOptions] = useState<string[]>([
    'Anyone',
    'Followers',
    'Custom',
  ]);

  const handleCancel = () => {
    setIsPosting(false);
    router.back();
  };

  const handlePost = () => {
    setIsPosting(true);
  };

  const removeThread = (id: string) => {
    setThreads((prevThreads: Thread[]) =>
      prevThreads.filter(thread => thread.id !== id)
    );
  };

  const updateThreadText = (id: string, text: string) => {
    setThreads((prevThreads: Thread[]) =>
      prevThreads.map(thread =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  };

  const removeImageFromThread = (id: string, uriToRemove: string) => {
    setThreads((prevThreads: Thread[]) =>
      prevThreads.map(thread =>
        thread.id === id
          ? {
              ...thread,
              imageUris: thread.imageUris.filter(url => url !== uriToRemove),
            }
          : thread
      )
    );
  };

  const pickImage = async (id: string) => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Error getting photos',
        'Please grant permission to access photos',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel' },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setThreads((prevThreads: Thread[]) =>
        prevThreads.map(thread =>
          thread.id === id
            ? {
                ...thread,
                imageUris: thread.imageUris.concat(
                  result.assets?.map(asset => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
    }
  };

  const takePhoto = async (id: string) => {
    let { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Error getting camera',
        'Please grant permission to access camera',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel' },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'livePhotos', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    /**
     * 이미지 저장하는 로직 해결 필요
     * */
    status = (await MediaLibrary.requestPermissionsAsync()).status;
    if (status === 'granted' && result.assets?.[0]?.uri) {
      await MediaLibrary.saveToLibraryAsync(result.assets?.[0]?.uri ?? '');
    }

    if (!result.canceled) {
      setThreads((prevThreads: Thread[]) =>
        prevThreads.map(thread =>
          thread.id === id
            ? {
                ...thread,
                imageUris: thread.imageUris.concat(
                  result.assets?.map(asset => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
    }
  };

  const getMyLocation = async (id: string) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Error getting location',
        'Please grant permission to access location',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel' },
        ]
      );

      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setThreads((prevThreads: Thread[]) =>
      prevThreads.map(thread =>
        thread.id === id
          ? {
              ...thread,
              location: [location.coords.latitude, location.coords.longitude],
            }
          : thread
      )
    );
  };

  const canAddThread =
    (threads.at(-1)?.text.trim().length ?? 0) > 0 ||
    (threads.at(-1)?.imageUris.length ?? 0) > 0;
  const canPost = threads.every(
    thread => thread.text.trim().length > 0 || thread.imageUris.length > 0
  );

  const renderThreadItem = ({
    item,
    index,
  }: {
    item: Thread;
    index: number;
  }) => {
    return (
      <View style={styles.threadContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/images/denji.jpg')}
            style={styles.avatar}
          />
          <View style={styles.threadLine} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>Denji</Text>
            {index > 0 && (
              <TouchableOpacity
                onPress={() => {
                  removeThread(item.id);
                }}
                style={styles.removeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-outline" size={20} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="What's new?"
            placeholderTextColor="#999"
            value={item.text}
            onChangeText={text => updateThreadText(item.id, text)}
            multiline
          />
          {item.imageUris && item.imageUris.length > 0 && (
            <FlatList
              data={item.imageUris}
              renderItem={({ item: uri, index: imgIndex }) => (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    onPress={() =>
                      !isPosting && removeImageFromThread(item.id, uri)
                    }
                    style={styles.removeImageButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="rgba(0,0,0,0.7"
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(uri, imgIndex) =>
                `${item.id}-img-${imgIndex}-${uri}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageFlatList}
            />
          )}
          {item.location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                {item.location[0]}, {item.location[1]}
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <Pressable
              style={styles.actionButton}
              onPress={() => !isPosting && pickImage(item.id)}
            >
              <Ionicons name="image-outline" size={24} color="#777" />
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => !isPosting && takePhoto(item.id)}
            >
              <Ionicons name="camera-outline" size={24} color="#777" />
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => getMyLocation(item.id)}
            >
              <FontAwesome name="map-marker" size={24} color="#777" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel} disabled={isPosting}>
          <Text style={[styles.cancel, isPosting && styles.disabledText]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={styles.title}>New Thread</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={renderThreadItem}
        ListFooterComponent={
          <ListFooter
            canAddThread={canAddThread}
            addThread={() => {
              if (canAddThread) {
                setThreads((prevThreads: Thread[]) => [
                  ...prevThreads,
                  { id: Date.now().toString(), text: '', imageUris: [] },
                ]);
              }
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={{ backgroundColor: '#ddd' }}
        keyboardShouldPersistTaps="handled"
      />

      <RNModal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View
            style={[styles.dropdownContainer, { bottom: insets.bottom + 30 }]}
          >
            {replyOptions.map(option => (
              <Pressable
                key={option}
                style={[
                  styles.dropdownOption,
                  option === replyOption && styles.selectedOption,
                ]}
                onPress={() => {
                  setReplyOption(option);
                  setIsDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    option === replyOption && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </RNModal>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Pressable onPress={() => setIsDropdownVisible(true)}>
          <Text style={styles.cancel}>anyone can reply & {replyOption}</Text>
        </Pressable>
        <Pressable
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          disabled={!canPost}
          onPress={handlePost}
        >
          <Text style={[styles.postButtonText]}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerRightPlaceholder: {
    width: 60,
  },
  cancel: {
    color: '#8e8e93',
    fontSize: 16,
  },
  disabledText: {
    color: '#ccc',
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    backgroundColor: '#eee',
  },
  threadContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#555',
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#555',
  },
  threadLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: '#aaa',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 6,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
  },
  input: {
    fontSize: 15,
    color: '#000',
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 15,
  },
  imageFlatList: {
    marginTop: 12,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: '#8e8e93',
    fontSize: 14,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#000',
    borderRadius: 18,
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  selectedOption: {},
  dropdownOptionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
  listFooter: {
    paddingLeft: 26,
    paddingTop: 10,
    flexDirection: 'row',
  },
  listFooterAvatar: {
    marginRight: 20,
    paddingTop: 2,
  },
  locationContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#8e8e93',
  },
});
