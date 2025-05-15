import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Book, BookStatus } from '@/types/book';
import { useBooks } from '@/context/BookContext';
import BookCard from '@/components/BookCard';

export default function ReadingScreen() {
  const { books } = useBooks();
  const [activeStatus, setActiveStatus] = useState<BookStatus>('Reading');

  const statusFilteredBooks = useMemo(() => {
    return books.filter((book) => book.status === activeStatus);
  }, [books, activeStatus]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No books {activeStatus.toLowerCase()}</Text>
      <Text style={styles.emptySubtitle}>
        {activeStatus === 'To Read'
          ? "Books you want to read will appear here"
          : activeStatus === 'Reading'
          ? "Books you're currently reading will appear here"
          : "Books you've completed will appear here"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusFilterContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            activeStatus === 'To Read' && styles.activeStatusButton,
          ]}
          onPress={() => setActiveStatus('To Read')}
        >
          <Text
            style={[
              styles.statusButtonText,
              activeStatus === 'To Read' && styles.activeStatusButtonText,
            ]}
          >
            To Read
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            activeStatus === 'Reading' && styles.activeStatusButton,
          ]}
          onPress={() => setActiveStatus('Reading')}
        >
          <Text
            style={[
              styles.statusButtonText,
              activeStatus === 'Reading' && styles.activeStatusButtonText,
            ]}
          >
            Reading
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            activeStatus === 'Completed' && styles.activeStatusButton,
          ]}
          onPress={() => setActiveStatus('Completed')}
        >
          <Text
            style={[
              styles.statusButtonText,
              activeStatus === 'Completed' && styles.activeStatusButtonText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={statusFilteredBooks}
        renderItem={({ item }) => <BookCard book={item} compact />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  statusFilterContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#F1F1F1',
  },
  activeStatusButton: {
    backgroundColor: '#008080',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  activeStatusButtonText: {
    color: '#FFF',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});