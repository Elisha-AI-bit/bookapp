import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { CircleCheck as CheckCircle, Circle, Clock } from 'lucide-react-native';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

export default function BookCard({ book, compact = false }: BookCardProps) {
  const router = useRouter();

  const statusIcon = () => {
    switch (book.status) {
      case 'Completed':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'Reading':
        return <Clock size={16} color="#FFC107" />;
      default:
        return <Circle size={16} color="#9E9E9E" />;
    }
  };

  const handlePress = () => {
    router.push(`/book/${book.id}`);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: book.coverUrl || 'https://via.placeholder.com/100x150' }}
          style={styles.compactCover}
          resizeMode="cover"
        />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.compactAuthor} numberOfLines={1}>{book.author}</Text>
          <View style={styles.statusContainer}>
            {statusIcon()}
            <Text style={styles.statusText}>{book.status}</Text>
          </View>
          {book.status === 'Reading' && book.currentPage && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(book.currentPage / book.pages) * 100}%` },
                ]}
              />
              <Text style={styles.progressText}>
                {Math.round((book.currentPage / book.pages) * 100)}%
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: book.coverUrl || 'https://via.placeholder.com/150x200' }}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={styles.genreContainer}>
          {book.genres.slice(0, 2).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
          {book.genres.length > 2 && (
            <Text style={styles.moreText}>+{book.genres.length - 2}</Text>
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            {statusIcon()}
            <Text style={styles.statusText}>{book.status}</Text>
          </View>
          <Text style={styles.pages}>{book.pages} pages</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    margin: 8,
  },
  cover: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#212121',
  },
  author: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 12,
    color: '#008080',
  },
  moreText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#616161',
    marginLeft: 4,
  },
  pages: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  compactCover: {
    width: 70,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  compactInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  compactAuthor: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    color: '#616161',
    paddingHorizontal: 4,
  },
});