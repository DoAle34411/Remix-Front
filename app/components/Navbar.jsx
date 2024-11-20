import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            Mi Sitio
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/home" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Home
            </a>
            <a 
              href="/books/libros" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Libros
            </a>
            <a 
              href="/usuario" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Usuario
            </a>
            <a 
              href="/carrito" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
            >
              Carrito
            </a>
            <form action="/logout" method="post">
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/home"
            className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Home
          </a>
          <a
            href="/libros"
            className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Libros
          </a>
          <a
            href="/usuario"
            className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Usuario
          </a>
          <a
            href="/carrito"
            className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Carrito
          </a>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full text-left text-gray-300 hover:text-white hover:bg-red-600 px-3 py-2 rounded-md"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}