import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

export default function GenreFilter({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.genreButton,
          !selectedGenre && styles.selectedGenreButton,
        ]}
        onPress={() => onSelectGenre(null)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.genreText,
            !selectedGenre && styles.selectedGenreText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {genres.map((genre) => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.genreButton,
            selectedGenre === genre && styles.selectedGenreButton,
          ]}
          onPress={() => onSelectGenre(genre)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.genreText,
              selectedGenre === genre && styles.selectedGenreText,
            ]}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedGenreButton: {
    backgroundColor: '#008080',
  },
  genreText: {
    fontSize: 14,
    color: '#757575',
  },
  selectedGenreText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});