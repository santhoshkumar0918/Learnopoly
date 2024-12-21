import { supabase } from "@/lib/supabase";
import { ifError } from "assert";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req:NextApiRequest,res:NextApiResponse) {

    const {follower_id,following_id} = req.body;
    
    const {error} = await supabase
    .from('followers')
    .delete()
    .eq('follower_id',follower_id)
    .eq('following_id',following_id)


    if(error){
        return res.status(400).json({error:error.message})
    }

    res.status(200).json({message : "Unfollowed Sucessfully"})
    
}