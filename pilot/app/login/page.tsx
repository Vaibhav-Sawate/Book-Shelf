
// @ts-nocheck
"use client";


import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";

export default function LoginPage(){
    const router = useRouter();
    const [session, setSession] = useState(null);

    useEffect(() =>{
        //check if user is already logged in
        supabase.auth.getSession().then(({data: {session}}) =>{
            setSession(session);
            if(session){
                router.push('/'); //redirect to home if logged in
            }
        });

        //Listen for changes
        const{
            data: { subscription}, 
        } = supabase.auth.onAuthStateChange((_event: any, session: SetStateAction<null>) =>{
            setSession(session);
            if(session){
                router.push('/'); //redirect to home if logged in
        }
    });
     
    return() => subscription.unsubscribe();
    }, [router]);

    if(session){
        return null; // while redirecting, show nothing
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-900">
                    Welcome Back to Book-Shelf
                </h1>

                {/* /Compoennt for Supabase Auth UI/ */}

                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google']} //We can add more providers like github, facebook etc
                    theme="light"
                    />

            </div>
        </div>
    );
}