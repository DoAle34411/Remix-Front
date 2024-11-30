// frontend/routes/carrito.jsx
import React from 'react';
import { useLoaderData, Form } from "@remix-run/react";
import { getSession, commitSession } from "../../utils/auth";
import axios from 'axios';
import { redirect } from "@remix-run/node";
import Navbar from '../../components/Navbar';

export const loader = async ({ request }) => {
    try {
      const session = await getSession(request.headers.get("Cookie"));
      const cart = session.get("cart") || [];
      
      console.log('Carrito Loader - Cart Contents:', JSON.stringify(cart));
  
      return { cart };
    } catch (error) {
      console.error('Error in cart loader:', error);
      return { cart: [] };
    }
  };
  
  export const action = async ({ request }) => {
    try {
      const session = await getSession(request.headers.get("Cookie"));
      const formData = await request.formData();
      const action = formData.get("_action");
  
      console.log('Session before action:', session.data);
  
      if (action === "remove") {
        const bookIdToRemove = formData.get("bookId");
        const cart = session.get("cart") || [];
        const updatedCart = cart.filter(item => item.bookId !== bookIdToRemove);
       
        console.log('Cart before removal:', cart);
        console.log('Cart after removal:', updatedCart);
  
        session.set("cart", updatedCart);
        const cookie = await commitSession(session);
        return redirect("/carrito", {
          headers: {
            "Set-Cookie": cookie
          }
        });
      } else if (action === "rent") {
        // Get the user ID from the session
        const UUID = session.get("UUID");
        console.log(UUID)
  
        // Prepare books for rent
        const cart = session.get("cart") || [];
        const books = cart.map(item => ({
          book_id: item.bookId,
          amountRented: item.amountRented
        }));
  
        try {
          // Call the rent API
          console.log(books,'here\n\n\n\n\n\n\n\n')
          const response = await axios.post('https://api-express-web.onrender.com/rent/rents', {
            user_id: UUID,
            books: books
          });
  
          // Clear the cart after successful rent
          session.set("cart", []);
          const cookie = await commitSession(session);
  
          return redirect("/home", {
            headers: {
              "Set-Cookie": cookie
            }
          });
        } catch (error) {
          console.error('Rent error:', error);
          return { error: error.response?.data?.message || "An error occurred while renting" };
        }
      }
    } catch (error) {
      console.error('Action error:', error);
      return { error: "An unexpected error occurred" };
    }
  };

export default function Carrito() {
  const { cart } = useLoaderData();

  // Additional debugging
  console.log('Client-side cart:', cart);

  return (
    <div>
    <Navbar/>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.bookId} className="flex items-center justify-between">
              <div>
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/100'} 
                  alt={item.bookName} 
                  className="w-20 h-20 object-cover" 
                />
                <h3>{item.bookName}</h3>
                <p>Quantity: {item.amountRented}</p>
              </div>
              <Form method="post">
                <input type="hidden" name="bookId" value={item.bookId} />
                <button
                  type="submit"
                  name="_action"
                  value="remove"
                  className="text-red-500"
                >
                  Remove
                </button>
              </Form>
            </div>
          ))}
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="rent"
              className="bg-green-500 text-white p-2 rounded"
            >
              Rent Books
            </button>
          </Form>
        </div>
      )}
    </div>
  );
}