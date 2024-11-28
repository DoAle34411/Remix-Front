//routes/books/libros
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "@remix-run/react";
import Navbar from '../../components/Navbar';
import styles from '../../styles/generalStyles.module.css';

export default function Libros() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('https://api-express-web.onrender.com/books');
        setBooks(data);
       
        // Extract genres from books
        const uniqueGenres = [...new Set(data.map(book => book.genre))];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Filter function to handle both genre and search filtering
  const filteredBooks = books.filter(book => 
    (selectedGenre === '' || book.genre === selectedGenre) &&
    (searchTerm === '' || 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Navbar/>
      <h1>Libros</h1>
      
      <div className="flex gap-4 mb-4 px-4">
        {/* Search Input */}
        <input 
          type="text" 
          placeholder="Search by title or author" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Genre Dropdown */}
        <select 
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genres</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No books found matching your search criteria.
        </div>
      ) : (
        <div className={styles.flexGrid}>
          {filteredBooks.map(book => (
            <div
              key={book._id}
              onClick={() => navigate(`/books/bookDetails/${book._id}`)}
              className="flex flex-col w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={book.imageUrl}
                  alt={book.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                  {book.name}
                </h3>
                <p className="text-gray-600">
                  by {book.author}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Available: {book.amountAvailable}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}