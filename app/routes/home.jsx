// Home.jsx
import React from 'react';
import Navbar from "../components/Navbar";
import BookList from '../components/Booklist';
import { redirect } from "@remix-run/node";
import { getSession } from "../utils/auth"; // Adjust the path as necessary

// Check if the user is logged in
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  return null;
};

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <BookList />
    </div>
  );
}

