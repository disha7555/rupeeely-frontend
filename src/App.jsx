import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories  from './pages/Categories';
import Expenses  from './pages/Expenses';
import  Budget  from './pages/Budget';
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/Navbar';
import MainLayout from "./layouts/MainLayout";
import DashboardDemo from './pages/DashboardDemo';
import { apiRequest } from './components/api';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
    {/* <ToastContainer position="top-right" autoClose={3000} className="custom-toast-container" /> */}
    <BrowserRouter>
      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDemo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
       
         <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
