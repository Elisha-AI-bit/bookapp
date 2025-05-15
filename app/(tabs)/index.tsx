import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useBooks } from '@/context/BookContext';
import BookCard from '@/components/BookCard';
import GenreFilter from '@/components/GenreFilter';
import { Book } from '@/types/book';

const { width } = Dimensions.get('window');

export default function BooksScreen() {
  const { books, loading } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach((book) => {
      book.genres.forEach((genre) => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!selectedGenre) return books;
    return books.filter((book) => book.genres.includes(selectedGenre));
  }, [books, selectedGenre]);

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#008080" />
          <Text style={styles.emptyText}>Loading your books...</Text>
        </View>
      );
    }
    
    if (selectedGenre) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books found in this category</Text>
          <Text style={styles.emptySubtext}>Try another genre or add some books</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your library is empty</Text>
        <Text style={styles.emptySubtext}>Add books to get started</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Book }) => (
    <BookCard book={item} />
  );

  return (
    <View style={styles.container}>
      {books.length > 0 && (
        <GenreFilter
          genres={allGenres}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      )}
      
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  list: {
    padding: 8,
    minHeight: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
});