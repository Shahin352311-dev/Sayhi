import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch
} from 'react-native';
import { registerRootComponent } from 'expo';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { io } from 'socket.io-client';

// ==========================================
// CONFIGURATION
// ==========================================
// Change to your production VPS URL or keep localhost/LAN IP for testing
const SOCKET_SERVER_URL = "http://10.0.2.2:5000";

// ==========================================
// SEED & MOCK DATA (Enables instant plug & play)
// ==========================================
const INITIAL_ROOMS = [
  {
    id: 'room_1',
    name: 'Global Hangout 🌍',
    topic: 'General',
    country: 'Global',
    description: 'Welcome everyone! Chat in English and meet worldwide friends.',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80',
    onlineCount: 42,
    isPinned: true
  },
  {
    id: 'room_2',
    name: 'Language Exchange 🗣️',
    topic: 'Learning',
    country: 'United States',
    description: 'Practice English, Spanish, French, and Asian languages together.',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=200&q=80',
    onlineCount: 28,
    isPinned: false
  },
  {
    id: 'room_3',
    name: 'Music & Vibes 🎵',
    topic: 'Music',
    country: 'United Kingdom',
    description: 'Share your favorite songs, chill tracks, and indie music.',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
    onlineCount: 19,
    isPinned: false
  },
  {
    id: 'room_4',
    name: 'Tech & Startups 💻',
    topic: 'Tech',
    country: 'Germany',
    description: 'Coding, AI, software engineering, and startup ideas.',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80',
    onlineCount: 35,
    isPinned: false
  }
];

const VIRTUAL_GIFTS = [
  { id: 'gift_rose', name: 'Red Rose', price: 10, icon: 'flower' },
  { id: 'gift_coffee', name: 'Warm Coffee', price: 25, icon: 'cafe' },
  { id: 'gift_diamond', name: 'Diamond Ring', price: 100, icon: 'diamond' },
  { id: 'gift_car', name: 'Sports Car', price: 500, icon: 'car-sport' },
  { id: 'gift_rocket', name: 'Rocket Launch', price: 1000, icon: 'rocket' }
];

// ==========================================
// CONTEXT PROVIDERS
// ==========================================
const AppContext = createContext();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeScreen, setActiveScreen] = useState('AUTH'); // AUTH, PROFILE_SETUP, HOME, GROUP_CHAT, DM_CHAT, WALLET, SETTINGS
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeDmUser, setActiveDmUser] = useState(null);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [userCoins, setUserCoins] = useState(250);

  // Initialize Socket.io Connection
  useEffect(() => {
    const s = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false,
      reconnectionAttempts: 5,
      timeout: 5000
    });

    s.on('connect', () => {
      console.log('Connected to Chat Server via Socket ID:', s.id);
    });

    s.on('connect_error', () => {
      // Graceful fallback to offline/standalone mock mode
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    if (socket) {
      socket.auth = { userId: userData.id, token: 'mock_jwt_auth_token' };
      socket.connect();
    }
    if (!userData.name || userData.name.trim() === '') {
      setActiveScreen('PROFILE_SETUP');
    } else {
      setActiveScreen('HOME');
    }
  };

  const logoutUser = () => {
    if (socket) socket.disconnect();
    setCurrentUser(null);
    setActiveRoom(null);
    setActiveDmUser(null);
    setActiveScreen('AUTH');
  };

  const blockUser = (userId, userName) => {
    if (!blockedUsers.includes(userId)) {
      setBlockedUsers([...blockedUsers, userId]);
      Alert.alert('User Blocked', `${userName} has been added to your blocked list.`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        socket,
        rooms,
        setRooms,
        activeRoom,
        setActiveRoom,
        activeDmUser,
        setActiveDmUser,
        blockedUsers,
        blockUser,
        userCoins,
        setUserCoins,
        setActiveScreen
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
        {activeScreen === 'AUTH' && <AuthScreen />}
        {activeScreen === 'PROFILE_SETUP' && <ProfileSetupScreen />}
        {activeScreen === 'HOME' && <HomeScreen />}
        {activeScreen === 'GROUP_CHAT' && <GroupChatScreen />}
        {activeScreen === 'DM_CHAT' && <DirectMessageScreen />}
        {activeScreen === 'WALLET' && <WalletScreen />}
        {activeScreen === 'SETTINGS' && <SettingsScreen />}
      </SafeAreaView>
    </AppContext.Provider>
  );
}

// ==========================================
// 1. AUTH SCREEN (PHONE + OTP SIMULATION)
// ==========================================
function AuthScreen() {
  const { loginUser } = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState('+14155552671');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.trim().length < 8) {
      Alert.alert('Invalid Input', 'Please enter a valid mobile phone number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      Alert.alert('Verification Code Sent', 'Use test OTP code: 123456');
    }, 900);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== '123456' && otpCode !== '') {
      Alert.alert('Invalid Code', 'The OTP code is incorrect. For testing enter 123456.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser({
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        phone: phoneNumber,
        name: '', // Empty triggers Profile Setup screen
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        country: 'United States',
        age: '24',
        gender: 'Female',
        language: 'English',
        isVIP: true
      });
    }, 900);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser({
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        phone: '+18005550199',
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        country: 'Canada',
        age: '27',
        gender: 'Male',
        language: 'English',
        isVIP: false
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
    >
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.authHeader}>
          <View style={styles.authLogoCircle}>
            <Ionicons name="chatbubbles" size={44} color="#6366F1" />
          </View>
          <Text style={styles.brandTitle}>SayHi</Text>
          <Text style={styles.brandSubtitle}>Connect with the world through real-time voice & chat</Text>
        </View>

        <View style={styles.card}>
          {!isOtpSent ? (
            <>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Continue with Phone</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Enter Verification Code (6-digit)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="123456"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} onPress={() => setIsOtpSent(false)}>
                <Text style={styles.linkButtonText}>Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} color="#EF4444" style={{ marginRight: 10 }} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// 2. PROFILE SETUP SCREEN
// ==========================================
function ProfileSetupScreen() {
  const { currentUser, setCurrentUser, setActiveScreen } = useContext(AppContext);
  const [displayName, setDisplayName] = useState(currentUser?.name || 'Taylor Jenkins');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedGender, setSelectedGender] = useState('Female');
  const [userAge, setUserAge] = useState('23');
  const [selectedLang, setSelectedLang] = useState('English');
  const [avatarUri, setAvatarUri] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  ];

  const handleSaveProfile = () => {
    if (!displayName.trim()) {
      Alert.alert('Required Field', 'Please enter your public display name.');
      return;
    }
    setCurrentUser({
      ...currentUser,
      name: displayName.trim(),
      country: selectedCountry,
      gender: selectedGender,
      age: userAge,
      language: selectedLang,
      avatar: avatarUri
    });
    setActiveScreen('HOME');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.screenHeading}>Profile Setup</Text>
      <Text style={styles.screenSubheading}>Set up your personal identity for group chats</Text>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Choose Avatar</Text>
        <View style={styles.avatarPickerRow}>
          {avatarOptions.map((uri, idx) => (
            <TouchableOpacity key={idx} onPress={() => setAvatarUri(uri)}>
              <Image
                source={{ uri }}
                style={[
                  styles.avatarChoice,
                  avatarUri === uri && styles.avatarChoiceSelected
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Display Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="e.g. Alex Hunter"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.flexRow}>
          <View style={[styles.flexOne, { marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Country</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={selectedCountry}
                onChangeText={setSelectedCountry}
                placeholder="Country"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>
          <View style={[styles.flexOne, { marginLeft: 8 }]}>
            <Text style={styles.fieldLabel}>Age</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={userAge}
                onChangeText={setUserAge}
                keyboardType="numeric"
                placeholder="Age"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>
        </View>

        <View style={styles.flexRow}>
          <View style={[styles.flexOne, { marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={selectedGender}
                onChangeText={setSelectedGender}
                placeholder="Gender"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>
          <View style={[styles.flexOne, { marginLeft: 8 }]}>
            <Text style={styles.fieldLabel}>Language</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={selectedLang}
                onChangeText={setSelectedLang}
                placeholder="Language"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
          <Text style={styles.primaryButtonText}>Save & Enter Platform</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==========================================
// 3. HOME SCREEN (ROOMS, FILTERS, CREATE ROOM)
// ==========================================
function HomeScreen() {
  const { rooms, setRooms, setActiveRoom, setActiveScreen, currentUser, userCoins } = useContext(AppContext);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // New room inputs
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('General');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const topics = ['All', 'General', 'Learning', 'Music', 'Tech'];

  const filteredRooms = rooms.filter((r) => {
    const matchesTopic = selectedTopic === 'All' || r.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchesQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesQuery;
  });

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      Alert.alert('Required', 'Please enter a room name.');
      return;
    }
    const created = {
      id: 'room_' + Date.now(),
      name: newRoomName.trim(),
      topic: newRoomTopic,
      country: currentUser?.country || 'Global',
      description: newRoomDesc || 'Active public discussion group.',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
      onlineCount: 1,
      isPinned: false
    };
    setRooms([created, ...rooms]);
    setNewRoomName('');
    setNewRoomDesc('');
    setCreateModalVisible(false);
  };

  return (
    <View style={styles.flexOne}>
      {/* Top Navbar */}
      <View style={styles.topNavbar}>
        <View style={styles.flexRowCenter}>
          <Image source={{ uri: currentUser?.avatar }} style={styles.navUserAvatar} />
          <View style={{ marginLeft: 10 }}>
            <View style={styles.flexRowCenter}>
              <Text style={styles.navUserName}>{currentUser?.name || 'User'}</Text>
              {currentUser?.isVIP && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={styles.navUserCountry}>{currentUser?.country || 'Global'}</Text>
          </View>
        </View>

        <View style={styles.flexRowCenter}>
          <TouchableOpacity style={styles.coinPill} onPress={() => setActiveScreen('WALLET')}>
            <Ionicons name="wallet-outline" size={16} color="#F59E0B" />
            <Text style={styles.coinPillText}>{userCoins}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconIconButton} onPress={() => setActiveScreen('SETTINGS')}>
            <Ionicons name="settings-outline" size={22} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search rooms by name or country..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Topic Horizontal Filter */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicScrollView}>
          {topics.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedTopic(t)}
              style={[
                styles.topicChip,
                selectedTopic === t && styles.topicChipActive
              ]}
            >
              <Text
                style={[
                  styles.topicChipText,
                  selectedTopic === t && styles.topicChipTextActive
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Room List */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomCard}
            onPress={() => {
              setActiveRoom(item);
              setActiveScreen('GROUP_CHAT');
            }}
          >
            <Image source={{ uri: item.avatar }} style={styles.roomImage} />
            <View style={styles.roomDetails}>
              <View style={styles.flexRowBetween}>
                <Text style={styles.roomTitle} numberOfLines={1}>{item.name}</Text>
                {item.isPinned && (
                  <Ionicons name="pin" size={16} color="#F59E0B" />
                )}
              </View>
              <Text style={styles.roomDescription} numberOfLines={2}>{item.description}</Text>
              <View style={styles.roomFooter}>
                <View style={styles.topicBadge}>
                  <Text style={styles.topicBadgeText}>{item.topic}</Text>
                </View>
                <View style={styles.flexRowCenter}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineCountText}>{item.onlineCount} online</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Create Room Action Button */}
      <TouchableOpacity style={styles.fabButton} onPress={() => setCreateModalVisible(true)}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Room Modal */}
      <Modal visible={createModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.flexRowBetween}>
              <Text style={styles.modalTitle}>Create New Room</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Room Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={newRoomName}
                onChangeText={setNewRoomName}
                placeholder="e.g. World Travelers Lounge"
                placeholderTextColor="#64748B"
              />
            </View>

            <Text style={styles.fieldLabel}>Topic</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={newRoomTopic}
                onChangeText={setNewRoomTopic}
                placeholder="General / Music / Tech"
                placeholderTextColor="#64748B"
              />
            </View>

            <Text style={styles.fieldLabel}>Short Description</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={newRoomDesc}
                onChangeText={setNewRoomDesc}
                placeholder="What is this room about?"
                placeholderTextColor="#64748B"
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateRoom}>
              <Text style={styles.primaryButtonText}>Publish Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// 4. GROUP CHAT SCREEN (REAL-TIME, TRANSLATE, GIFTS, REPLIES)
// ==========================================
function GroupChatScreen() {
  const {
    activeRoom,
    currentUser,
    setActiveScreen,
    setActiveDmUser,
    blockedUsers,
    blockUser,
    socket,
    userCoins,
    setUserCoins
  } = useContext(AppContext);

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      senderId: 'usr_sarah',
      senderName: 'Sarah Connor',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      text: 'Hello everyone! Welcome to our room.',
      translatedText: null,
      isTranslating: false,
      timestamp: '10:00 AM',
      replyTo: null
    },
    {
      id: 'm2',
      senderId: 'usr_kenji',
      senderName: 'Kenji Sato',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      text: 'こんにちは！お元気ですか？',
      translatedText: 'Hello! How are you doing today?',
      isTranslating: false,
      timestamp: '10:02 AM',
      replyTo: null
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [replyMessage, setReplyMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [targetMessageForReport, setTargetMessageForReport] = useState(null);
  const [reportReason, setReportReason] = useState('Harassment or spam');

  const flatListRef = useRef(null);

  // Socket room joining & listeners
  useEffect(() => {
    if (socket && activeRoom) {
      socket.emit('join_room', { roomId: activeRoom.id, user: currentUser });

      socket.on('receive_message', (incoming) => {
        if (!blockedUsers.includes(incoming.senderId)) {
          setMessages((prev) => [...prev, incoming]);
        }
      });

      socket.on('user_typing_status', (data) => {
        if (data.userId !== currentUser.id) {
          setPartnerTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socket && activeRoom) {
        socket.emit('leave_room', { roomId: activeRoom.id, userId: currentUser.id });
        socket.off('receive_message');
        socket.off('user_typing_status');
      }
    };
  }, [activeRoom, blockedUsers]);

  const handleSend = (mediaUrl = null) => {
    if (!inputText.trim() && !mediaUrl) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      mediaUrl: mediaUrl,
      translatedText: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyMessage ? { name: replyMessage.senderName, text: replyMessage.text } : null
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setReplyMessage(null);

    if (socket && socket.connected) {
      socket.emit('send_message', { roomId: activeRoom.id, message: newMsg });
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleToggleTranslate = (item) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === item.id) {
          if (m.translatedText) {
            return { ...m, translatedText: null }; // Toggle off
          } else {
            // Simulated Translation Engine
            return { ...m, translatedText: `[Auto-Translated]: "${m.text}"` };
          }
        }
        return m;
      })
    );
  };

  const handleSendGift = (gift) => {
    if (userCoins < gift.price) {
      Alert.alert('Insufficient Coins', 'Please refill your wallet to send this gift.');
      return;
    }
    setUserCoins((prev) => prev - gift.price);
    setGiftModalVisible(false);

    const giftMsg = {
      id: 'gift_msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: `Sent a virtual gift: ${gift.name} 🎁`,
      giftData: gift,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, giftMsg]);
    Alert.alert('Gift Delivered', `You sent ${gift.name} for ${gift.price} coins!`);
  };

  const handleSendSampleImage = () => {
    handleSend('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80');
  };

  const handleReportSubmit = () => {
    Alert.alert('Report Received', 'Thank you. Our moderation team will investigate this message within 24 hours.');
    setReportModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flexOne}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
    >
      {/* Group Room Header */}
      <View style={styles.topNavbar}>
        <View style={styles.flexRowCenter}>
          <TouchableOpacity onPress={() => setActiveScreen('HOME')} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#CBD5E1" />
          </TouchableOpacity>
          <Image source={{ uri: activeRoom?.avatar }} style={styles.chatRoomAvatar} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.chatRoomTitle} numberOfLines={1}>{activeRoom?.name}</Text>
            <Text style={styles.chatRoomSubtitle}>
              {partnerTyping ? 'Someone is typing...' : `${activeRoom?.onlineCount || 1} members active`}
            </Text>
          </View>
        </View>

        <View style={styles.flexRowCenter}>
          <TouchableOpacity style={styles.iconIconButton} onPress={() => setGiftModalVisible(true)}>
            <Ionicons name="gift-outline" size={22} color="#EC4899" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages.filter((m) => !blockedUsers.includes(m.senderId))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUser.id;
          return (
            <View style={[styles.messageRow, isMine ? styles.messageRowRight : styles.messageRowLeft]}>
              {!isMine && (
                <TouchableOpacity
                  onPress={() => {
                    setActiveDmUser({
                      id: item.senderId,
                      name: item.senderName,
                      avatar: item.senderAvatar
                    });
                    setActiveScreen('DM_CHAT');
                  }}
                >
                  <Image source={{ uri: item.senderAvatar }} style={styles.messageAvatar} />
                </TouchableOpacity>
              )}

              <View style={[styles.messageBubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
                {!isMine && (
                  <View style={styles.flexRowBetween}>
                    <Text style={styles.senderDisplayName}>{item.senderName}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setTargetMessageForReport(item);
                        setReportModalVisible(true);
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={14} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Reply indicator */}
                {item.replyTo && (
                  <View style={styles.replyPreviewInsideBubble}>
                    <Text style={styles.replySenderText}>{item.replyTo.name}</Text>
                    <Text style={styles.replyBodyText} numberOfLines={1}>{item.replyTo.text}</Text>
                  </View>
                )}

                {/* Media Image */}
                {item.mediaUrl && (
                  <Image source={{ uri: item.mediaUrl }} style={styles.messageImageContent} />
                )}

                {/* Text Body */}
                {item.text ? <Text style={styles.messageBodyText}>{item.text}</Text> : null}

                {/* Translated text if toggled */}
                {item.translatedText ? (
                  <View style={styles.translatedContainer}>
                    <Text style={styles.translatedText}>{item.translatedText}</Text>
                  </View>
                ) : null}

                {/* Footer of message */}
                <View style={styles.messageMetaFooter}>
                  <Text style={styles.messageTimeText}>{item.timestamp}</Text>
                  {!isMine && (
                    <View style={styles.flexRowCenter}>
                      <TouchableOpacity onPress={() => handleToggleTranslate(item)} style={{ marginRight: 8 }}>
                        <Ionicons
                          name="language-outline"
                          size={14}
                          color={item.translatedText ? '#10B981' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setReplyMessage(item)}>
                        <Ionicons name="arrow-undo-outline" size={14} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Reply Banner */}
      {replyMessage && (
        <View style={styles.replyBanner}>
          <View style={styles.flexOne}>
            <Text style={styles.replyBannerTitle}>Replying to {replyMessage.senderName}</Text>
            <Text style={styles.replyBannerContent} numberOfLines={1}>{replyMessage.text}</Text>
          </View>
          <TouchableOpacity onPress={() => setReplyMessage(null)}>
            <Ionicons name="close" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Input Bar */}
      <View style={styles.chatInputBar}>
        <TouchableOpacity style={styles.inputIconButton} onPress={handleSendSampleImage}>
          <Ionicons name="image-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputIconButton} onPress={() => setGiftModalVisible(true)}>
          <Ionicons name="gift-outline" size={22} color="#EC4899" />
        </TouchableOpacity>

        <TextInput
          style={styles.chatInputField}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#64748B"
        />

        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend(null)}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Virtual Gifts Modal */}
      <Modal visible={giftModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.flexRowBetween}>
              <Text style={styles.modalTitle}>Send a Virtual Gift</Text>
              <TouchableOpacity onPress={() => setGiftModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.screenSubheading}>Your Balance: {userCoins} Coins</Text>

            <View style={styles.giftGrid}>
              {VIRTUAL_GIFTS.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={styles.giftCard}
                  onPress={() => handleSendGift(gift)}
                >
                  <Ionicons name={gift.icon} size={32} color="#EC4899" />
                  <Text style={styles.giftName}>{gift.name}</Text>
                  <View style={styles.giftPriceBadge}>
                    <Text style={styles.giftPriceText}>{gift.price} Coins</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Report & Safety Modal */}
      <Modal visible={reportModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Safety & Moderation</Text>
            <Text style={styles.screenSubheading}>Report offensive message or block user</Text>

            <Text style={styles.fieldLabel}>Select Reason</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={reportReason}
                onChangeText={setReportReason}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleReportSubmit}>
              <Text style={styles.primaryButtonText}>Submit Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => {
                if (targetMessageForReport) {
                  blockUser(targetMessageForReport.senderId, targetMessageForReport.senderName);
                  setReportModalVisible(false);
                }
              }}
            >
              <Text style={styles.dangerButtonText}>Block User Permanently</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => setReportModalVisible(false)}>
              <Text style={styles.linkButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// 5. DIRECT 1-TO-1 MESSAGE SCREEN (SEEN / DELIVERED)
// ==========================================
function DirectMessageScreen() {
  const { activeDmUser, currentUser, setActiveScreen } = useContext(AppContext);
  const [messages, setMessages] = useState([
    {
      id: 'dm_1',
      senderId: activeDmUser?.id,
      text: 'Hey! Nice meeting you in the group room.',
      status: 'seen',
      timestamp: '11:15 AM'
    },
    {
      id: 'dm_2',
      senderId: currentUser.id,
      text: 'Thanks! Loved the discussion.',
      status: 'delivered',
      timestamp: '11:17 AM'
    }
  ]);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = {
      id: 'dm_' + Date.now(),
      senderId: currentUser.id,
      text: text.trim(),
      status: 'sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setText('');

    // Simulate "Delivered" and "Seen" receipt transitions
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 1200);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'seen' } : m))
      );
    }, 2800);
  };

  return (
    <View style={styles.flexOne}>
      {/* Top Bar */}
      <View style={styles.topNavbar}>
        <View style={styles.flexRowCenter}>
          <TouchableOpacity onPress={() => setActiveScreen('GROUP_CHAT')} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#CBD5E1" />
          </TouchableOpacity>
          <Image source={{ uri: activeDmUser?.avatar }} style={styles.chatRoomAvatar} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.chatRoomTitle}>{activeDmUser?.name}</Text>
            <Text style={styles.chatRoomSubtitle}>Online</Text>
          </View>
        </View>
      </View>

      {/* DM List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUser.id;
          return (
            <View style={[styles.messageRow, isMine ? styles.messageRowRight : styles.messageRowLeft]}>
              <View style={[styles.messageBubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
                <Text style={styles.messageBodyText}>{item.text}</Text>
                <View style={styles.messageMetaFooter}>
                  <Text style={styles.messageTimeText}>{item.timestamp}</Text>
                  {isMine && (
                    <Ionicons
                      name={
                        item.status === 'seen'
                          ? 'checkmark-done'
                          : item.status === 'delivered'
                          ? 'checkmark-done-outline'
                          : 'checkmark-outline'
                      }
                      size={15}
                      color={item.status === 'seen' ? '#38BDF8' : '#94A3B8'}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={styles.chatInputBar}>
        <TextInput
          style={styles.chatInputField}
          value={text}
          onChangeText={setText}
          placeholder="Send a private message..."
          placeholderTextColor="#64748B"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==========================================
// 6. WALLET SCREEN (COINS, GIFTS, VIP PASS)
// ==========================================
function WalletScreen() {
  const { userCoins, setUserCoins, setActiveScreen, currentUser, setCurrentUser } = useContext(AppContext);

  const coinPacks = [
    { id: 'pack_100', amount: 100, price: '$0.99' },
    { id: 'pack_500', amount: 550, price: '$4.99' },
    { id: 'pack_1200', amount: 1400, price: '$9.99' },
    { id: 'pack_3000', amount: 3500, price: '$24.99' }
  ];

  const handleBuyCoins = (pack) => {
    setUserCoins((prev) => prev + pack.amount);
    Alert.alert('Purchase Successful', `Added ${pack.amount} Coins to your account!`);
  };

  const handleToggleVip = () => {
    const nextStatus = !currentUser?.isVIP;
    setCurrentUser({ ...currentUser, isVIP: nextStatus });
    Alert.alert('VIP Status', nextStatus ? 'VIP subscription activated!' : 'VIP subscription canceled.');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.flexRowBetween}>
        <TouchableOpacity onPress={() => setActiveScreen('HOME')} style={{ marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E1" />
        </TouchableOpacity>
        <Text style={styles.screenHeading}>Wallet & Coins</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <View style={styles.flexRowCenter}>
          <Ionicons name="diamond" size={28} color="#F59E0B" style={{ marginRight: 8 }} />
          <Text style={styles.balanceAmount}>{userCoins}</Text>
          <Text style={styles.balanceCurrency}>Coins</Text>
        </View>
      </View>

      <Text style={styles.sectionHeaderTitle}>Refill Coin Packages</Text>
      {coinPacks.map((pack) => (
        <TouchableOpacity
          key={pack.id}
          style={styles.coinPackRow}
          onPress={() => handleBuyCoins(pack)}
        >
          <View style={styles.flexRowCenter}>
            <Ionicons name="logo-bitcoin" size={24} color="#F59E0B" style={{ marginRight: 12 }} />
            <Text style={styles.coinPackAmount}>{pack.amount} Coins</Text>
          </View>
          <View style={styles.buyBadge}>
            <Text style={styles.buyBadgeText}>{pack.price}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>VIP Membership</Text>
      <View style={styles.card}>
        <View style={styles.flexRowBetween}>
          <View>
            <Text style={styles.cardTitle}>VIP Crown Status</Text>
            <Text style={styles.screenSubheading}>Special chat badge & priority highlights</Text>
          </View>
          <Switch
            value={currentUser?.isVIP || false}
            onValueChange={handleToggleVip}
            trackColor={{ false: '#334155', true: '#6366F1' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ==========================================
// 7. SETTINGS SCREEN (NOTIFICATIONS, PRIVACY, ACCOUNT)
// ==========================================
function SettingsScreen() {
  const { setActiveScreen, logoutUser, currentUser } = useContext(AppContext);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [dmPrivacy, setDmPrivacy] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? All messages and coin balances will be removed permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => logoutUser()
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.flexRowBetween}>
        <TouchableOpacity onPress={() => setActiveScreen('HOME')} style={{ marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E1" />
        </TouchableOpacity>
        <Text style={styles.screenHeading}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionHeaderTitle}>Chat Preferences</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingSub}>Alerts for DMs, mentions, and room events</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#334155', true: '#6366F1' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Auto-Translate</Text>
            <Text style={styles.settingSub}>Instantly translate chats to your native language</Text>
          </View>
          <Switch
            value={autoTranslate}
            onValueChange={setAutoTranslate}
            trackColor={{ false: '#334155', true: '#6366F1' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Allow Direct Messages</Text>
            <Text style={styles.settingSub}>Enable other members to message you directly</Text>
          </View>
          <Switch
            value={dmPrivacy}
            onValueChange={setDmPrivacy}
            trackColor={{ false: '#334155', true: '#6366F1' }}
          />
        </View>
      </View>

      <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Account Management</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.menuRow} onPress={() => setActiveScreen('PROFILE_SETUP')}>
          <View style={styles.flexRowCenter}>
            <Ionicons name="person-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
            <Text style={styles.menuRowText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={logoutUser}>
          <View style={styles.flexRowCenter}>
            <Ionicons name="log-out-outline" size={20} color="#F59E0B" style={{ marginRight: 12 }} />
            <Text style={[styles.menuRowText, { color: '#F59E0B' }]}>Log Out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
          <View style={styles.flexRowCenter}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" style={{ marginRight: 12 }} />
            <Text style={[styles.menuRowText, { color: '#EF4444' }]}>Delete Account Permanently</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==========================================
// 8. GLOBAL STYLES (DARK MODERN THEME)
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19'
  },
  flexOne: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  // Auth Screen Styles
  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 28
  },
  authLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20
  },
  card: {
    backgroundColor: '#161F30',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#232F46',
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A3854',
    paddingHorizontal: 12,
    marginBottom: 14
  },
  inputIcon: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 15
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700'
  },
  linkButton: {
    marginTop: 14,
    alignItems: 'center'
  },
  linkButtonText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '600'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A3854'
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700'
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155'
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  // Profile Setup
  screenHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  screenSubheading: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16
  },
  avatarPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12
  },
  avatarChoice: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  avatarChoiceSelected: {
    borderColor: '#6366F1',
    transform: [{ scale: 1.08 }]
  },
  // Navbar
  topNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121A2B',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  navUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  navUserName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  navUserCountry: {
    color: '#94A3B8',
    fontSize: 12
  },
  vipBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6
  },
  vipText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800'
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 10
  },
  coinPillText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5
  },
  iconIconButton: {
    padding: 6
  },
  // Search & Filter
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161F30',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#232F46'
  },
  searchBarInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14
  },
  topicScrollView: {
    paddingHorizontal: 16,
    marginVertical: 8
  },
  topicChip: {
    backgroundColor: '#161F30',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#232F46'
  },
  topicChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1'
  },
  topicChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600'
  },
  topicChipTextActive: {
    color: '#FFFFFF'
  },
  // Room Card
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#161F30',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#232F46'
  },
  roomImage: {
    width: 65,
    height: 65,
    borderRadius: 12
  },
  roomDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1
  },
  roomDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  topicBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  topicBadgeText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '700'
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 5
  },
  onlineCountText: {
    color: '#94A3B8',
    fontSize: 11
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 18
  },
  modalCard: {
    backgroundColor: '#161F30',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A3854'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  // Chat Screen
  chatRoomAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19
  },
  chatRoomTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 200
  },
  chatRoomSubtitle: {
    fontSize: 11,
    color: '#10B981'
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  messageRowLeft: {
    justifyContent: 'flex-start'
  },
  messageRowRight: {
    justifyContent: 'flex-end'
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  bubbleMine: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 2
  },
  bubbleOther: {
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 2
  },
  senderDisplayName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4
  },
  messageBodyText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 19
  },
  messageImageContent: {
    width: 200,
    height: 140,
    borderRadius: 8,
    marginBottom: 6
  },
  translatedContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#10B981'
  },
  translatedText: {
    fontSize: 12,
    color: '#A7F3D0',
    fontStyle: 'italic'
  },
  messageMetaFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4
  },
  messageTimeText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    marginRight: 6
  },
  replyPreviewInsideBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 6,
    borderRadius: 4,
    marginBottom: 6
  },
  replySenderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B'
  },
  replyBodyText: {
    fontSize: 11,
    color: '#E2E8F0'
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155'
  },
  replyBannerTitle: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '700'
  },
  replyBannerContent: {
    fontSize: 12,
    color: '#CBD5E1'
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#121A2B',
    borderTopWidth: 1,
    borderTopColor: '#1E293B'
  },
  inputIconButton: {
    padding: 6
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
    color: '#FFFFFF',
    fontSize: 14,
    marginHorizontal: 6
  },
  sendButton: {
    backgroundColor: '#6366F1',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#334155'
  },
  // Gifts Modal
  giftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12
  },
  giftCard: {
    width: '30%',
    backgroundColor: '#0B0F19',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#232F46'
  },
  giftName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6
  },
  giftPriceBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4
  },
  giftPriceText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700'
  },
  // Wallet
  balanceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155'
  },
  balanceLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600'
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  balanceCurrency: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '700',
    marginLeft: 6,
    marginTop: 8
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10
  },
  coinPackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161F30',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#232F46'
  },
  coinPackAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  buyBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  buyBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  // Settings
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232F46'
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  settingSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#232F46'
  },
  menuRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});

// Register root component for standard Expo execution
registerRootComponent(App);