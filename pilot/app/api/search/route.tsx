import { NextResponse } from "next/server";

export async function GET(request: Request){

    // get the search query from url  (e.g., /api/search?q=dune)
    const {searchParams} = new URL(request.url);
    const q = searchParams.get('q');

    if(!q){
        return NextResponse.json({ error: 'Seach query is required'}, { status: 400});
    }

    //Get secret api key
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    if(!API_KEY){
        console.error('API key not found');
        return NextResponse.json({error: 'Server configuration error'}, { status : 500});
    }

    //Build the google api url
    const GOOGLE_API_URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)} &key=${API_KEY}`;
    
    try {
        //fetch the data from google
        const response = await fetch(GOOGLE_API_URL);
        if(!response.ok){
            throw new Error(`Google API failed with status ${response.status}`);
        }
        
        const data = await response.json();

        // send the items array back to fronterd
        return NextResponse.json(data.items || []);
    }
    catch(error){
        console.error('Error in search API: ', error);
        return NextResponse.json({error: 'Failed to fetch data'}, {status: 500});
    }

}