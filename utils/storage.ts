import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '@/types/book';

const BOOKS_STORAGE_KEY = 'books';

export const saveBooks = async (books: Book[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving books:', error);
  }
};

export const getBooks = async (): Promise<Book[]> => {
  try {
    const booksJson = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    return booksJson ? JSON.parse(booksJson) : [];
  } catch (error) {
    console.error('Error getting books:', error);
    return [];
  }
};

export const addBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks();
    books.push(book);
    await saveBooks(books);
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

export const updateBook = async (updatedBook: Book): Promise<void> => {
  try {
    const books = await getBooks();
    const index = books.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      await saveBooks(books);
    }
  } catch (error) {
    console.error('Error updating book:', error);
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    const books = await getBooks();
    const filteredBooks = books.filter((book) => book.id !== id);
    await saveBooks(filteredBooks);
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};