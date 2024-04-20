import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (

    <div className='navbar'>
       <Link to={'/login'} style={{textDecoration:"none"}}>

       <img src={navProfile} className='nav-profile' />
       </Link>
      
      
    </div>

  )
}

export default Navbar