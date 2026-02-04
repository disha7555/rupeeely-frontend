import { useEffect, useState,useRef } from "react"
import axios from "axios"
import helperConfig from '../components/helperConfig.js';

export function useAuth() {
  const fetched = useRef(false);

    const url = helperConfig();
     const [auth, setAuth] = useState({
    isAuthenticated: false,
    permissions: [],
    loading: true
  })

   useEffect(() => {
     if (fetched.current) return;
  fetched.current = true;
    axios.get(url+"/api/auth/status", { withCredentials: true })
      .then(res => {
       
        setAuth({
          isAuthenticated: res.data.isAuthenticated,
          //permissions: res.data.permissions || [],
          loading: false
        })
      })
      .catch(() => {
        //setAuth({ isAuthenticated: false, permissions: [], loading: false })
      })
  }, [])

  
  return auth;

}