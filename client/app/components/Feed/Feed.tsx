import { supabase } from "@/app/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";



async function fetchPosts(){
   const {error,data}  = await supabase
   .from("posts")
   .select('*, profiles(username)')
   .order('created_at',{ascending :false})

   if (error) throw new Error(error.message)

   return data
}


export default function Feed(){

    const queryClient = useQueryClient();

    const {data:posts,isLoading,isError,error} = useQuery({
        queryKey:['posts'],
        queryFn:fetchPosts,
        staleTime:1000 * 60 * 5,
        retry:2,
    })

    useEffect({
        
    }.[])

}