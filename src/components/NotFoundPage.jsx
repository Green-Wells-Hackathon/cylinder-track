import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      
      <h1 className="text-6xl md:text-9xl font-bold text-green-600">
        404
      </h1>
      
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-gray-800">
        Page Not Found
      </h2>
      
      <p className="mt-4 text-lg text-gray-600 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you simply mistyped the URL.
      </p>
      
      <Link
        to="/" // This links to your homepage
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
