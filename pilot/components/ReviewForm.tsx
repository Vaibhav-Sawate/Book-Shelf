"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function ReviewForm({bookId}: {bookId: string}) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    //check if user is logged in
    useEffect(() => {
        supabase.auth.getSession().then(({data:{session}}) =>{
            setUser(session?.user ??null);
        });
    }, []);

    //handle submit review
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) {
            setMessage("You must be logged in to submit a review.");
            return;
        }
        setIsSubmitting(true);
        setMessage("");

        //Insert review into database
        const {error} = await supabase
        .from("reviews")
        .insert([
            {
                book_id: bookId,
                user_id: user.id,
                rating: rating,
                review_text: reviewText,
                // created_at will be set automatically by the database
            },
        ]);

    setIsSubmitting(false);

    if(error) {
        setMessage(`Error: ${error.message}`);
    }
    else{
        setMessage("Review submitted successfully! Reload to see your review.");
        setReviewText("");

        router.refresh();
    }

    };

    //Render form : If not logged in, show login button
    if(!user){
        return (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 mbb-4">Login to submit a review.</p>
                <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Login to Review 
                    </Link>
            </div>
        );
    }

    //REnder: If logged in, show review form
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4"> Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* /StarRating Input  */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-2">
                        {[1,2,3,4,5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setRating(num)}
                            className={`text-2xl focus:outline-none ${num<=rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            
                            >⭐</button>
                        ))}
                    </div>
                </div>

                {/* Text Input  */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="What do you think about this book?"
                        required
                    />
                </div>

                {/* Submit Button  */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                    {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
                

                {/* /Success/Error Message  / */}
                {message && (
                    <p className={`text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                    </p>
                )}
                </form>
        </div>
    );
}
