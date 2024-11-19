// frontend/routes/bookDetails.$id.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rentalQuantity, setRentalQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await axios.get(`/api/books/${id}`);
      setBook(data);
    };

    fetchBook();
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ bookId: book._id, amountRented: rentalQuantity });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Book added to cart");
  };

  return book ? (
    <div>
      <h1>{book.name}</h1>
      <p>Author: {book.author}</p>
      <p>Available: {book.amountAvailable}</p>
      <p>Synopsis: {book.synopsis}</p>
      <input 
        type="number" 
        value={rentalQuantity} 
        min="1" 
        max={book.amountAvailable} 
        onChange={(e) => setRentalQuantity(Number(e.target.value))} 
      />
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  ) : <div>Loading...</div>;
};

export default BookDetails;
