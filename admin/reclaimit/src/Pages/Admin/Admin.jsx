import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import FoundLostItem from '../../Components/FoundLostItem/FoundLostItem'
import LoginSignup from '../../Components/LoginSignup/LoginSignup'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/listproduct' element={<ListProduct/>} />
        <Route path='/foundlostitem' element={<FoundLostItem/>} />
        <Route path='/login' element={<LoginSignup/>} />
      </Routes>
    </div>
  )
}

export default Admin