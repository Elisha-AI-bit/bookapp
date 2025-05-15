import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, BookStatus } from '@/types/book';
import { getBooks, saveBooks, addBook as addBookToStorage, updateBook as updateBookInStorage } from '@/utils/storage';

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'status'>) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBookStatus: (id: string, status: BookStatus) => Promise<void>;
  updateReadingProgress: (id: string, currentPage: number) => Promise<void>;
  filterByGenre: (genre: string | null) => Book[];
  getBookById: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const loadedBooks = await getBooks();
        setBooks(loadedBooks);
      } catch (err) {
        setError('Failed to load books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const addBook = async (bookData: Omit<Book, 'id' | 'dateAdded' | 'status'>) => {
    try {
      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
        dateAdded: Date.now(),
        status: 'To Read',
      };

      await addBookToStorage(newBook);
      setBooks((prevBooks) => [...prevBooks, newBook]);
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    try {
      await updateBookInStorage(updatedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      );
    } catch (err) {
      setError('Failed to update book');
      console.error(err);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const updatedBooks = books.filter((book) => book.id !== id);
      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    }
  };

  const updateBookStatus = async (id: string, status: BookStatus) => {
    try {
      const book = books.find((b) => b.id === id);
      if (book) {
        const updatedBook = { ...book, status };
        await updateBookInStorage(updatedBook);
        setBooks((prevBooks) =>
          prevBooks.map((b) => (b.id === id ? updatedBook : b))
        );
      }
    } catch (err) {
      setError('Failed to update book status');
      console.error(err);
    }
  };

  const updateReadingProgress = async (id: string, currentPage: number) => {
    try {
      const book = books.find((b) => b.id === id);
      if (book) {
        const updatedBook = { ...book, currentPage };
        await updateBookInStorage(updatedBook);
        setBooks((prevBooks) =>
          prevBooks.map((b) => (b.id === id ? updatedBook : b))
        );
      }
    } catch (err) {
      setError('Failed to update reading progress');
      console.error(err);
    }
  };

  const filterByGenre = (genre: string | null) => {
    if (!genre) return books;
    return books.filter((book) => book.genres.includes(genre));
  };

  const getBookById = (id: string) => {
    return books.find((book) => book.id === id);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        updateBookStatus,
        updateReadingProgress,
        filterByGenre,
        getBookById,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};