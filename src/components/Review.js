import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { reviewsRef, dp } from '../firebase/firebase';
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import {Appstate} from '../App';
import { useNavigate } from 'react-router-dom';

const Review = ({id, prevRating, userRated}) => {
    const navigate =useNavigate();
    const useAppstate=useContext(Appstate);
    const [rating, setRating]=useState(0);
    const [loading, setLoading]=useState(false);
    const [form,setForm]=useState("");
    const [data,setData]=useState([]);
    const [reviewsLoading,setReviewsLoading]=useState(false);
    const [newAdded,setNewAdded]=useState(0);

    const sentReview = async ()=>{
        try {
            if(useAppstate.login)
            {
            setLoading(true);
            await addDoc(reviewsRef,{
                movieid:id,
                name:useAppstate.userName,
                rating:rating,
                through:form,
                timestamp:new Date().getTime()
            })

            const ref= doc(dp,"movies",id);
            await updateDoc(ref,{
                rating: prevRating + rating,
                rated: userRated + 1
            })

            swal({
                title:"Review Added",
                icon:"success",
                button:false,
                timer:3000
            })
            setRating(0);
            setForm("");
            setNewAdded(newAdded+1);
        }else{
            swal({
                title:"Please Login first",
                icon:"info",
                button:false,
                timer:3000
            })
            navigate('/login');
        }
        } catch (error) {
            swal({
                title:error.message,
                icon:"error",
                button:false,
                timer:3000
            })
        }
        setLoading(false);
    }
    useEffect(()=>{
        async function getData(){
            setData([]);
            setReviewsLoading(true);
            let quer= query(reviewsRef, where('movieid','==',id));
            const querySnap=await getDocs(quer);
            querySnap.forEach((doc)=>{
                setData((prev)=>[...prev,doc.data()])
            })
            setReviewsLoading(false);
        }
        getData();
    },[newAdded])

  return (
    <div className='mt-4 w-full border-t-2 border-gray-700'>
        <ReactStars
            size={30}
            half={true}
            value={rating}
            onChange={(rate)=>{setRating(rate)}}
        />    
        <input 
            value={form}
            onChange={(e) => setForm(e.target.value)}
            type='text' placeholder='Share Your Reviews'
            className='w-full p-2 outline-none card' />
        <button onClick={sentReview} className='bg-green-600 w-full p-2 flex justify-center'>
            {loading ? <TailSpin height={30} color='white '/> :'Share'}</button> 
            {
                reviewsLoading ? <div className='mt-8 flex justify-center'><ThreeDots height={10} color='white' /></div>
                :
                <div className='mt-4'>
                    {
                        data.map((e,i)=>{
                            return(
                                <div key={i} className='p-2 w-full mt-2 card'>
                                    <div className='flex'>
                                        <p className='text-red-800'>{e.name}</p>
                                        <p className='ml-2 text-xs'>({new Date(e.timestamp).toLocaleString()})</p>
                                    </div>
                                    <ReactStars
                                       size={15}
                                       half={true}
                                       edit={false}
                                       value={e.rating}
                                       
                                    />
                                    <p>{e.through}</p>
                                </div>
                            )
                        })
                    }
                </div>
            }   
    </div>
  )
}

export default Review