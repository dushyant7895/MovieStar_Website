import React, { useContext } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';
import { Login } from '@mui/icons-material';

const Header = () => {
  const useAppstate = useContext(Appstate);

  return (
    <div className='text-yellow-600 flex justify-between items-center text-3xl p-3 border-b-4 border-gray-500'>
       <Link to={'/'}><span> Movie<span className='text-white'>Star</span></span></Link>
      { useAppstate.login ? 
      <Link to={'/addmovie'}>
       <h1 className='text-lg text-white flex items-center cursor-pointer'>
         <Button>
            <AddCircleOutlineIcon className={'mr-1 text-yellow-600 '}/>
            <span className='text-white'>Add Item</span>
         </Button>
        </h1>
      </Link>
      :
      <Link to={'/login'}>
       <h1 className='text-lg text-white flex items-center cursor-pointer'>
         <Button>
            <Login className={'mr-1 text-yellow-600 '}/>
            <span className='text-white font-medium capitalize'>Login</span>
         </Button>
        </h1>
      </Link>
      }
    </div>
  )}

export default Header