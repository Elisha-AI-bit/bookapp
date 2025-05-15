export type BookStatus = 'To Read' | 'Reading' | 'Completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genres: string[];
  pages: number;
  status: BookStatus;
  currentPage?: number;
  rating?: number;
  dateAdded: number;
}

export interface BookFormData {
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genres: string[];
  pages: number;
}