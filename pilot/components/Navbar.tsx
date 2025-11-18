"use client";

import { supabase } from '../app/utils/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        //check active session
        supabase.auth.getSession().then(({data: {session}}) =>{
            setUser(session?.user || null);
        });


        // Listen for login/logout events
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) =>{
            setUser(session?.user || null);
        });

        return ()  => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();;
    };

    return (
        <nav className='bg-white border-b border-gray-200'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-6'>
                <div className='flex justify-between h-16'>

                {/* //Logo */}
                <div className='flex items-center'>
                    <Link href='/' className='text-2xl font-bold text-blue-600'>
                        Book-Shelf
                    </Link>
                </div>

                {/* /Right SLide Menu */}
                <div className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <span className='text-sm text-gray-600 hidden sm:block'>
                                {user.email}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className='px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50'
                                >
                                    Logout
                                </button>
                        </>
                    ) : (
                        <Link
                        href='/login'
                        className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
                        >
                            Login
                        </Link>
                    )}
                </div>

                </div>
            </div>
        </nav>
    );
}