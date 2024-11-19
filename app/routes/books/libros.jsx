// frontend/routes/libros.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Libros = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await axios.get('/api/books');
      setBooks(data);
      
      // Extract genres from books
      const uniqueGenres = [...new Set(data.map(book => book.genre))];
      setGenres(uniqueGenres);
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Libros</h1>
      <select onChange={(e) => setSelectedGenre(e.target.value)}>
        <option value="">All Genres</option>
        {genres.map((genre, index) => (
          <option key={index} value={genre}>{genre}</option>
        ))}
      </select>
      <div className="books">
        {books
          .filter(book => selectedGenre === '' || book.genre === selectedGenre)
          .map(book => (
            <div key={book._id}>{book.name}</div>
          ))}
      </div>
    </div>
  );
};

export default Libros;
