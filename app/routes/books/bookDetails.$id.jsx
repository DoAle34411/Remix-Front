// frontend/routes/books/bookDetails.$id.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, useNavigation } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "../../utils/auth"; // adjust path as needed

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const amountRented = formData.get("amountRented");
 
  try {
    // Get the book details
    const bookResponse = await axios.get(`https://api-express-web.onrender.com/books/${params.id}`);
    const book = bookResponse.data;
    
    // Get current session
    const session = await getSession(request.headers.get("Cookie"));
    
    // Retrieve existing cart or initialize as empty array
    const cart = session.get("cart") || [];
    
    console.log('Existing Cart BEFORE Update:', JSON.stringify(cart));
    
    // Check if book is already in cart, update or add
    const existingBookIndex = cart.findIndex(item => item.bookId === book._id);
    
    if (existingBookIndex > -1) {
      // If book exists, update its rental amount
      cart[existingBookIndex].amountRented = Number(amountRented);
    } else {
      // If book is not in cart, add it
      cart.push({
        bookId: book._id,
        bookName: book.name,
        amountRented: Number(amountRented),
        imageUrl: book.imageUrl
      });
    }
    
    console.log('Cart AFTER Update:', JSON.stringify(cart));
    
    // Set the updated cart in the session
    session.set("cart", cart);
    
    // Commit the session
    const cookie = await commitSession(session);
    
    // Redirect to Libros page
    return redirect("/books/libros", {
      headers: {
        "Set-Cookie": cookie
      }
    });
  } catch (error) {
    console.error('BookDetails Action Error:', error);
    return { error: "Failed to add book to cart" };
  }
};

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rentalQuantity, setRentalQuantity] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`https://api-express-web.onrender.com/books/${id}`);
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, [id]);

  // Ensure max rental quantity doesn't exceed available books
  const maxRentalQuantity = book ? book.amountAvailable : 1;

  return book ? (
    <div>
      <h1>{book.name}</h1>
      <p>Author: {book.author}</p>
      <p>Available: {book.amountAvailable}</p>
      <p>Synopsis: {book.synopsis}</p>
      
      <Form method="post">
        <input
          type="number"
          name="amountRented"
          value={rentalQuantity}
          min="1"
          max={maxRentalQuantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            setRentalQuantity(Math.min(value, maxRentalQuantity));
          }}
        />
        <button 
          type="submit" 
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Adding to Cart..." : "Add to Cart"}
        </button>
      </Form>
    </div>
  ) : <div>Loading...</div>;
}