import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBooks } from '@/context/BookContext';
import { X } from 'lucide-react-native';

export default function AddBookScreen() {
  const router = useRouter();
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [pages, setPages] = useState('');
  const [currentGenre, setCurrentGenre] = useState('');

  const addGenre = () => {
    if (currentGenre.trim() && !genres.includes(currentGenre.trim())) {
      setGenres([...genres, currentGenre.trim()]);
      setCurrentGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
  };

  const handleAddBook = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!author.trim()) {
      Alert.alert('Error', 'Please enter an author');
      return;
    }
    if (!coverUrl.trim()) {
      Alert.alert('Error', 'Please enter a cover image URL');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (genres.length === 0) {
      Alert.alert('Error', 'Please add at least one genre');
      return;
    }
    if (!pages || isNaN(Number(pages)) || Number(pages) <= 0) {
      Alert.alert('Error', 'Please enter a valid number of pages');
      return;
    }

    await addBook({
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim(),
      description: description.trim(),
      genres,
      pages: Number(pages),
    });

    Alert.alert('Success', 'Book added successfully', [
      {
        text: 'OK',
        onPress: () => router.navigate('/'),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Author *</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cover Image URL *</Text>
          <TextInput
            style={styles.input}
            value={coverUrl}
            onChangeText={setCoverUrl}
            placeholder="Enter cover image URL"
            placeholderTextColor="#9E9E9E"
          />
          {coverUrl.trim() !== '' && (
            <View style={styles.coverPreviewContainer}>
              <Image
                source={{ uri: coverUrl }}
                style={styles.coverPreview}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter book description"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Genres *</Text>
          <View style={styles.genreInputContainer}>
            <TextInput
              style={styles.genreInput}
              value={currentGenre}
              onChangeText={setCurrentGenre}
              placeholder="Add genre"
              placeholderTextColor="#9E9E9E"
              onSubmitEditing={addGenre}
            />
            <TouchableOpacity
              style={styles.addGenreButton}
              onPress={addGenre}
            >
              <Text style={styles.addGenreButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.genresContainer}>
            {genres.map((genre) => (
              <View key={genre} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
                <TouchableOpacity
                  onPress={() => removeGenre(genre)}
                  style={styles.removeGenreButton}
                >
                  <X size={12} color="#616161" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Pages *</Text>
          <TextInput
            style={styles.input}
            value={pages}
            onChangeText={setPages}
            placeholder="Enter number of pages"
            placeholderTextColor="#9E9E9E"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBook}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  textArea: {
    minHeight: 100,
  },
  genreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genreInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    marginRight: 8,
  },
  addGenreButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGenreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  genreTag: {
    backgroundColor: '#E0F2F1',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 14,
    color: '#008080',
  },
  removeGenreButton: {
    marginLeft: 6,
  },
  addButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  coverPreviewContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  coverPreview: {
    width: 100,
    height: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});