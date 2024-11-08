import { useState, useEffect } from 'react';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api-express-web.onrender.com/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-6 justify-center">
        {books.map((book) => (
          <div 
            key={book._id}
            className="flex flex-col w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
    </div>
  );
}