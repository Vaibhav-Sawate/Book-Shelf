//This would be the page that shows details for a specific book based on its ID
//This would be Server compoent.. Fetches book details from database or external API based on the ID from URL params
//So doesnt need 'use client' directive


// @ts-nocheck
// incase you see the "type error" for fetch in nextjs 13 server component
//the vscode just wants to make sure you are using ts correctly
import { get } from "http";
import ReviewForm from "@/components/ReviewForm";


//It fetched data for one specific book
async function getBookDetails(bookId){
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    if(!API_KEY){
        throw new Error('Google Books API key is not defined in environment variables.');
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`);
    
    if(!response.ok){
        throw new Error('Failed to fetch book details');
    }

    const book= await response.json();
    return book;
}

//THe main component for the book details page

export default async function BookDetailsPage({ params }) {
    const resolvedParams= await params;
    const bookId = resolvedParams.id;  //from the folder name [id]

    try {
        const book = await getBookDetails(bookId);
        const info = book.volumeInfo;
        return(
            <div className="flex justify-center min-h-screen py-10 bg-gray-50">
                <main className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                    
                    {/* Book Cover & Info Section */}
                    
                    

                    <div className="flex flex-col md:flex-row gap-8">

                        {/* //Book Cover */}
                        <div className="flex-shrink-0">
                            <img
                            src={info.imageLinks?.thumbnail.replace('zoom=1', 'zoom=0') || 'https://via.placeholder.com/256x384?text=No+Cover'}
                            alt={`Cover of ${info.title}`}
                            className="w-48 shadow-lg"
                            />
                        </div>

                        {/* //Book Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{info.title}</h1>
                            <h2 className="text-xl text-gray-600 mt-1">{info.authors?.join(', ')}</h2>

                            <div className="mt-4 text-sm text-gray-500">
                                <p>Publisher: {info.publisher}</p>
                                <p>Published: {info.publishedDate}</p>
                                <p>Pages: {info.pageCount}</p>
                            </div>


                {/* //description */}

                            <div className="mt-6 prose">
                                <h3 className="text-lg font-semibold">Descriptions</h3>

                                {/* //Render description as HTML from google */}
                                <div dangerouslySetInnerHTML={{ __html: info.description || 'No description available'}}/>

                            </div>

                            <div className="mt-12 border-t pt-8">
                                <ReviewForm bookId={bookId} />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return(
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-red-500 text-xl">Error loading book details: {(error as Error).message}</h1>
            </div>
        );
    }
}