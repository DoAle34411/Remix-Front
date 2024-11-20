// Home.jsx
import React from 'react';
import Navbar from "../components/Navbar";
import BookList from '../components/Booklist';
import { redirect } from "@remix-run/node";
import { getSession } from "../utils/auth"; 
import { useEffect, useState } from 'react';
import axios from 'axios';

// Check if the user is logged in
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  return null;
};

const Home = ({ userId }) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // Check if window is defined to avoid sessionStorage access on the server
    if (typeof window !== "undefined") {
      const storedCarrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
      setCarrito(storedCarrito);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }, [carrito]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const historyResponse = await axios.get(`https://api-express-web.onrender.com/rents/user/${userId}`);
        if (historyResponse.data.length === 0) {
          // No history, get top 6 most rented books of all time
          const allTimeRentedResponse = await axios.get('https://api-express-web.onrender.com/rents/genres/most-rented');
          const topGenres = allTimeRentedResponse.data.slice(0, 6).map(genre => genre[0]);
          const books = await axios.get('/books', { params: { genres: topGenres } });
          setRecommendedBooks(books.data);
        } else {
          // Get most rented genres by user and recommend books based on those genres
          const userGenresResponse = await axios.get(`https://api-express-web.onrender.com/rents/genres/user/${userId}`);
          const topGenres = userGenresResponse.data.slice(0, 6).map(genre => genre[0]);
          const books = await axios.get('https://api-express-web.onrender.com/books', { params: { genres: topGenres } });
          setRecommendedBooks(books.data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchRecommendations();
  }, [userId]);

  // Fetch trending books
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const allTimeRented = await axios.get('https://api-express-web.onrender.com/rents/genres/most-rented');
        const topAllTimeBooks = allTimeRented.data.slice(0, 3).map(book => book[0]);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const recentRented = await axios.get('https://api-express-web.onrender.com/rents/genres/most-rented/time', {
          params: { startDate: lastMonth.toISOString(), endDate: new Date().toISOString() }
        });
        const topRecentBooks = recentRented.data.slice(0, 3).map(book => book[0]);

        // Combine and fetch book details
        const trendingBookIds = [...topAllTimeBooks, ...topRecentBooks];
        const books = await axios.get('https://api-express-web.onrender.com/books', { params: { ids: trendingBookIds } });
        setTrendingBooks(books.data);
      } catch (error) {
        console.error('Error fetching trending books:', error);
      }
    };
    fetchTrendingBooks();
  }, []);

  return (
    <div>
      <Navbar/>
      <h1>Welcome to the Home Page</h1>
      <h2>Recommended for You</h2>
      <div className="recommendations">
        {recommendedBooks.map(book => (
          <div key={book._id}>{book.title}</div>
        ))}
      </div>

      <h2>Trending Books</h2>
      <div className="trending">
        {trendingBooks.map(book => (
          <div key={book._id}>{book.title}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;
