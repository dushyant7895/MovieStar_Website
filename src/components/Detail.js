import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom'
import { dp } from '../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Vortex } from 'react-loader-spinner'
import Review from './Review'

const Detail = () => {
  const {id}=useParams();
  const[data,setData]=useState({
    title:"",
    year:"",
    image:"",
    description:"",
    rating:0,
    rated:0
  });
  const[loading,setLoading]=useState(false);
  useEffect(()=>{
    
    async function getData(){
      setLoading(true);
      const _doc=doc(dp,"movies",id)
      const _data=await getDoc(_doc);
      setData(_data.data());
      setLoading(false);
    }
    
    getData();
  },[])





  return (
    <div className='p-4 mt-4 flex flex-col md:flex-row items-center md:items-start w-full justify-center'>
      
      {
      loading ? <Vortex height={500} color="white"/>: 
      <>
      <img className='h-96 block md:sticky top-24' src={data.image} alt="" />
      <div className='md:ml-4  ml-0 w-full md:w-1/2'>
        <h1 className='text-3xl font-bold text-gray-400'>{data.title}<span className='text-xl ml-2'>({data.year})</span></h1>
        <ReactStars 
          size={20}
          half={true}
          value={data.rating/data.rated}
          edit={false}
        />
        <p className='mt-5'>{data.description}</p>
        <Review id={id} prevRating={data.rating} userRated={data.rated}/>
      </div>
      </>
}
    </div>
   
  )
}

export default Detail