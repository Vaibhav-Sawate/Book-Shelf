"use client";

import {useState} from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Link from 'next/link'; // to make search results clickable

//Define a type for our book data
type Book={
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
};


export default function Home() {

  const [query, setQuery] = useState(' ');

  // Add new state for loading resulta n erroe
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange=(e: ChangeEvent<HTMLInputElement>) =>{
    setQuery(e.target.value);
  }

  const handleSearch = async(e: FormEvent) => {
    e.preventDefault();
    //alert(`You searched for: ${query}`);
    if (!query) return;
    
    // Start loading and clear old
    setLoading(true);
    setError(null);
    setResults([]);

    try{
      // this is api call!
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if(!response.ok){
        throw new Error('Network error. PLease try again')
      }

      const data = await response.json();
      setResults(data);
    }
    catch(err){
      if(err instanceof Error){
        setError(err.message);
      }
      else{
        setError('An unknow error occurred.');
      }
    }
      finally{
        setLoading(false); // stop loading always
      }
    
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-20 bg-gray-50">
      <main className="w-full max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Book-Shelf</h1>
        <p className="mt-3 text-xl text-gray-600"> Find and review</p>
    
    
    <form onSubmit={handleSearch}  className="flex w-full max-w-full px-4 md:px-20 mt-10">
      <input 
          type="text" 
          placeholder="Search for anything......" 
          className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded-l-md focus:outline-none  focus:ring-2 text-gray-800 focus:ring-blue-500"
          value={query}
          onChange={handleQueryChange}
      />

      <button 
        type="submit" 
        //disable button while loading
        disabled={loading}
        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700">
        {loading ? '...': 'Search'}
      </button>
    </form>

        {/* //here we will show results, loading and error */}
    <div className="mt-10 text-left">
      {loading && <p className='text-center'>Loading...</p>}
      {error && <p className='text-cneter text-red-500'>{error}</p>}
      {results.length>0 &&(
        <ul className='space-y-4'>
          {results.map((book) => (

            //Wrap the <li> in a Link to make it clickable link to book details page
            <Link href ={`/book/${book.id}`} key={book.id}>
              <li key={book.id} className='flex p-4 bg-white border rounded-md shadow-sm gap-4 items-start'>
              <img src= {book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
                    alt = {`Cover of ${book.volumeInfo.title}`}
                    className='w-20 shadow-md'
              />
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{book.volumeInfo.title}</h3>
                <p className='text-sm text-gray-600'>{book.volumeInfo.authors?.join(', ')}</p>
                <p className='mt-2 text-sm text-gray-700'>
                  {book.volumeInfo.description?.substring(0, 150)}....
                </p>
              </div>
              </li>
            </Link>        
          ))}
        </ul>
      )}
    </div>

      </main>
    </div>
  );
}
