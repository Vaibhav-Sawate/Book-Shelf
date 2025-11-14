

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen py-20 bg-gray-50">
      <main className="w-full max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Book-Shelf</h1>
        <p className="mt-3 text-xl text-gray-600"> Find and review</p>
    <form className="flex w-full max-w-full px-4 md:px-20 mt-10">
      <input type="text" placeholder="Search for anything......" className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded-l-md focus:outline-none  focus:ring-2 text-gray-600 focus:ring-blue-500"/>
      <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-r-md hover:bg-blue-700">Search</button>
    </form>

    <div className="mt-10 text-left">
      <p className="text-gray-500 text-center">Here are the results</p>
    </div>

      </main>
    </div>
  );
}
