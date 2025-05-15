import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooks } from '@/context/BookContext';
import { BookStatus } from '@/types/book';
import { BookOpen, Star, ArrowLeft, Trash2 } from 'lucide-react-native';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBookById, updateBookStatus, updateReadingProgress, deleteBook } = useBooks();

  const book = getBookById(id);
  const [currentPage, setCurrentPage] = useState<string>(book?.currentPage?.toString() || '');
  const [isEditingProgress, setIsEditingProgress] = useState(false);

  if (!book) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Book not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const readingProgress = book.currentPage ? (book.currentPage / book.pages) * 100 : 0;

  const handleStatusChange = (status: BookStatus) => {
    updateBookStatus(book.id, status);
  };

  const handleSaveProgress = () => {
    const pageNum = parseInt(currentPage, 10);
    if (isNaN(pageNum) || pageNum < 0 || pageNum > book.pages) {
      Alert.alert('Invalid Page Number', `Please enter a number between 0 and ${book.pages}`);
      return;
    }
    updateReadingProgress(book.id, pageNum);
    setIsEditingProgress(false);
  };

  const handleDeleteBook = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(book.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#212121" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButtonContainer} onPress={handleDeleteBook}>
          <Trash2 size={24} color="#F44336" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bookInfoHeader}>
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>
            <View style={styles.genresContainer}>
              {book.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <BookOpen size={16} color="#757575" />
                <Text style={styles.statText}>{book.pages} pages</Text>
              </View>
              {book.rating && (
                <View style={styles.statItem}>
                  <Star size={16} color="#FFC107" />
                  <Text style={styles.statText}>{book.rating}/5</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                book.status === 'To Read' && styles.activeStatusButton,
              ]}
              onPress={() => handleStatusChange('To Read')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  book.status === 'To Read' && styles.activeStatusButtonText,
                ]}
              >
                To Read
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                book.status === 'Reading' && styles.activeStatusButton,
              ]}
              onPress={() => handleStatusChange('Reading')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  book.status === 'Reading' && styles.activeStatusButtonText,
                ]}
              >
                Reading
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                book.status === 'Completed' && styles.activeStatusButton,
              ]}
              onPress={() => handleStatusChange('Completed')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  book.status === 'Completed' && styles.activeStatusButtonText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {book.status === 'Reading' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${readingProgress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(readingProgress)}% ({book.currentPage || 0} of {book.pages} pages)
              </Text>
              {isEditingProgress ? (
                <View style={styles.progressEditContainer}>
                  <TextInput
                    style={styles.progressInput}
                    value={currentPage}
                    onChangeText={setCurrentPage}
                    keyboardType="numeric"
                    placeholder="Current page"
                    placeholderTextColor="#9E9E9E"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProgress}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => setIsEditingProgress(true)}
                >
                  <Text style={styles.updateButtonText}>Update Progress</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButtonContainer: {
    padding: 8,
  },
  deleteButtonContainer: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bookInfoHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  genreText: {
    fontSize: 12,
    color: '#008080',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    borderRadius: 4,
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
    color: '#FFFFFF',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  progressEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
});