import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { BookOpen, CirclePlus as PlusCircle, BookmarkCheck } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Books',
          headerTitle: 'My Library',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Book',
          headerTitle: 'Add New Book',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Reading',
          headerTitle: 'My Reading List',
          tabBarIcon: ({ color, size }) => (
            <BookmarkCheck size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    borderTopColor: '#E0E0E0',
    height: 60,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    elevation: 0,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#212121',
  },
});