import { NextApiRequest,NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";



export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const {follower_id , following_id} = req.body;

  const {error} = await supabase
  .from('followers')
  .insert([{follower_id,following_id}]);

  if(error){
   return  res.status(400).json({error:error.message})
  }

  res.status(200).json({message:'Followed Sucessfully'})
}