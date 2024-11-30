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
    const UUID = session.get("UUID")
    
    console.log('Carrito Loader - Cart Contents:', JSON.stringify(cart));

    return { cart };
  } catch (error) {
    console.error('Error in cart loader:', error);
    return { cart: [] , userId: UUID};
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
      const UUID = session.get("UUID");
      console.log(UUID)

      const cart = session.get("cart") || [];
      const books = cart.map(item => ({
        book_id: item.bookId,
        amountRented: item.amountRented
      }));

      try {
        console.log(books, 'here\n\n\n\n\n\n\n\n')
        const response = await axios.post('https://api-express-web.onrender.com/rent/rents', {
          user_id: UUID,
          books: books
        });

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
  const { cart, UUID } = useLoaderData();

  console.log('Client-side cart:', cart);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Carrito</h1>
        {cart.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.bookId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={item.bookName} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.bookName}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.amountRented}</p>
                  </div>
                </div>
                <Form method="post">
                  <input type="hidden" name="bookId" value={item.bookId} />
                  <button
                    type="submit"
                    name="_action"
                    value="remove"
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </Form>
              </div>
            ))}
            <Form method="post" className="mt-6 text-center">
              <button
                type="submit"
                name="_action"
                value="rent"
                className="bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Rentar Libros
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
