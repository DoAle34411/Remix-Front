import React, { useEffect, useState } from 'react';
import { useLoaderData } from "@remix-run/react";
import Navbar from "../components/Navbar";
import { redirect } from "@remix-run/node";
import { getSession } from "../utils/auth";
import axios from 'axios';
import styles from '../styles/generalStyles.module.css';
import { useNavigate } from "@remix-run/react";

// Loader function
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  console.log(session.get('userId'));
  if (!session.has("userId")) return redirect("/login");
  return { userId: session.get("userId"), UUID: session.get("UUID") };
};

const Home = () => {
  const { userId, UUID } = useLoaderData();
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventBooks, setEventBooks] = useState({});
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

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
        const historyResponse = await axios.get(`https://api-express-web.onrender.com/rent/rents/genres/user/${UUID}`);
        if (historyResponse.data.length === 0) {
          const allTimeRentedResponse = await axios.get('https://api-express-web.onrender.com/rent/rents/top-books/month');
          setRecommendedBooks(allTimeRentedResponse.data);
        } else {
          const userGenresResponse = await axios.get(`https://api-express-web.onrender.com/rent/rents/genres/user/${UUID}`);
          const topGenres = userGenresResponse.data.slice(0, 6).map(genre => genre[0]);
          const books = await axios.get('https://api-express-web.onrender.com/books/book/by-genres', {params: { genres: topGenres.join(',') },});
          setRecommendedBooks(books.data.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, UUID]);

  // Fetch trending books
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        // Fetch all-time rented books
        const allTimeRented = await axios.get('https://api-express-web.onrender.com/rent/rents/top-books/');
        console.log('All Time Rented:', allTimeRented.data);

        // Fetch recent month rented books
        const recentRented = await axios.get('https://api-express-web.onrender.com/rent/rents/top-books/month');
        console.log('Recent Rented:', recentRented.data);

        // Combine books and remove duplicates based on _id
        const combinedBooks = [...allTimeRented.data, ...recentRented.data];
        const uniqueBooks = combinedBooks.reduce((acc, book) => {
            if (!acc.some(existingBook => existingBook._id === book._id)) {
                acc.push(book); // Add book only if its _id is not already in the accumulator
            }
            return acc;
        }, []);

        console.log('Unique Trending Books:', uniqueBooks);

        // Update the state with the filtered books
        setTrendingBooks(uniqueBooks);

      } catch (error) {
        console.error('Error fetching trending books:', error);
      }
    };
    
    fetchTrendingBooks();
  }, []);

  useEffect(() => {
    const fetchEventsAndBooks = async () => {
      try {
        const eventsResponse = await axios.get('https://api-express-web.onrender.com/event/events/currentEvents');
        const eventsData = eventsResponse.data;
        setEvents(eventsData);

        // Map to store books for each event
        const booksMap = {};

        // Fetch books for each event
        await Promise.all(
          eventsData.map(async (event) => {
            const { genres } = event;
            const booksResponse = await axios.get('https://api-express-web.onrender.com/books/book/by-genres', {
              params: { genres: genres.join(',') },
            });
            booksMap[event._id] = booksResponse.data.slice(0, 6);
            console.log(booksMap[event._id])
          })
        );
        console.log(booksMap)
        setEventBooks(booksMap);
      } catch (error) {
        console.error('Error fetching events or books:', error);
      }
    };

    fetchEventsAndBooks();
  }, []);
  
  

  return (
    <div>
      <Navbar/>
      
      <br />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Bienvenido</h1>
      <br />

      {/* Recommended Books Section */}
      <div className="px-4 mx-12 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recomendados para Ti</h2>
        {recommendedBooks.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No hay libros recomendados en este momento.
          </div>
        ) : (
          <div className={styles.flexGrid}>
            {recommendedBooks.map(book => (
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
                    Por: {book.author}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Disponibles: {book.amountAvailable}
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

      {/* Trending Books Section */}
      <div className="px-4 mx-12 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Libros de Tendencia</h2>
        {trendingBooks.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No hay libros de tendencia en este momento.
          </div>
        ) : (
          <div className={styles.flexGrid}>
            {trendingBooks.map(book => (
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
                    Por: {book.author}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Disponibles: {book.amountAvailable}
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
      {/* Current Events Section */}
      <div className="px-4 mx-12 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Eventos Actuales</h2>
        {events.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No hay eventos actuales en este momento.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-4">{event.descripcion}</p>
              <div className={styles.flexGrid}>
                {eventBooks[event.id]?.length > 0 ? (
                  eventBooks[event.id].map((book) => (
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
                            e.target.src =
                              'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                          {book.name}
                        </h3>
                        <p className="text-gray-600">Por: {book.author}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Disponibles: {book.amountAvailable}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              book.status === 'Available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No hay libros disponibles para este evento.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;