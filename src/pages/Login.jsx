import React, { useEffect,useState } from 'react';
import logo from '../assets/logo.png';
import Background_final from '../assets/Background_final.png';
import WalletIcon from '@mui/icons-material/Wallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { TextField, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import ToastMessages from '../components/ToastMessages.jsx';
import axios from 'axios';
import helperConfig from '../components/helperConfig.js';
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
const navigate = useNavigate();
  const url = helperConfig();
  //  console.log("url",url);
  const [loading, setLoading] = useState(false);
  const [toasting,setToasing]=useState(false);
  const [toastMsg,setToastMsg]=useState({type:"",msg:""});
  
const loaderWrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
   
};

const loaderStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    borderBottom: '3px solid #006F76',
    animation: 'spin 1s linear infinite',
};

  const LogoBlock = () => (
    <div className="logo-block">
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <img src={logo} alt="Logo" width={50} height={50} />
        <span style={{ fontSize: "2rem", marginLeft: "1rem", fontWeight: "bold" }} className='primary-color'>
          Rupeeely
        </span>
      </div>
    </div>
  );

  function handleToast(type,msg){
      setToasing(true);
  setToastMsg({type:type,msg:msg});
  setTimeout(() => {
  setToasing(false);
}, 1000);
}
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
        setLoading(true);
       
      const res = await axios.post(
        url + "/api/auth/google/login",
        { accessToken : tokenResponse.access_token },
        { withCredentials: true }
      );
     if(res.data.success){
      
      localStorage.setItem("accesstoken", res.data.accessToken);
      setToasing(true);
      handleToast("success", "Logged in with successfully");
     setTimeout(()=>{
           navigate("/dashboard");
        },3000); // or wherever you want
     }
     else{
      setToasing(true);
      handleToast("error", res.data?.message || "Google login failed");
     }
    } catch (err) {
      setLoading(false);
      setToasing(true)
        handleToast(
        "error",
        err.response?.data?.message || "Google login failed"
      );
      //handleToast("error", "Google login failed");
    }
  },
  onError: () => {
    setToasing(true);
    handleToast("error", "Google login failed");
  }
});



  const applyValidation = () => {
 

if (!formData.email) {

  handleToast("error","Email is required");
  return;
}

if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    handleToast("error","Email is not valid");
    return;
}
 
if (!formData.password) {
  handleToast("error","Password is required");
  return;
}

// if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
// .test(formData.password)){
//   handleToast("error","Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number");
//   return;
// }
return true;
  }


 const handleSubmit = () => {
    setLoading(true);
    if(applyValidation()){
      const body ={
      
        email:formData.email,
        password:formData.password,
      }
      axios.post(url + "/api/auth/login",body,{
        withCredentials: true})
      .then((res)=>{
        if(res.data.success){
          //setLoading(false);
          //console.log("res.data.accessToken",res.data.accessToken)
         localStorage.setItem("accesstoken", res.data.accessToken);
         setToasing(true);
        handleToast("success","Logged in successfully");
        setTimeout(()=>{
           navigate("/dashboard");
        },1000);
        }
        else{
         // setLoading(false);
          setToasing(true);
          handleToast("error",res.data.message ||  "Login failed");
        }
      })
      .catch((err)=>{
       // setLoading(false);
        setToasing(true)
        handleToast("error",err.response.data.message ||  "Registration failed");
      })
       .finally(() => {
      setLoading(false); // ✅ ONLY here
    });
    }
    setLoading(false);
  }
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    username: "",
    password: "",
    mobileNumber: ""
  })
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  return (
    <>
       {loading && (   <div style={loaderWrapperStyle}>
                <div style={loaderStyle} />
                <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                </style>
            </div>)}
    <div
      className='page-background'
      id="mainContainer"
      style={{
        width: "100%",
        minHeight: "100vh", // keeps extra height
        display: "flex",
        flexDirection: "row",
        // position: "relative",
        // alignItems: "center", // vertical centering
      }}
    >
    
      <div
        id="subContainer"
        style={{
          width: "50%",
          minHeight: "100vh",
          textAlign: "center",
          //borderRight: "1px solid black",
          fontSize: "5rem",
          position: "relative",

        }}
      >
        <div
          style={{
            position: "absolute",
            //top: "40%",
            transform: "translateY(6%)",
            left: "5%",
            display: "flex",
            flexDirection: "column",
            //alignItems: "flex-start",
            gap: "0.4rem"
          }}
          className='desktop-logo'
        >

          <LogoBlock />


          <div style={{ fontSize: "0.9rem", fontWeight: "normal", textAlign: "left" }}>
            Managing personal finances has never been easier
          </div>

          <div style={{ fontSize: "1.2rem", transform: "translate(0%,5%)", alignItems: "center" }} className='auth-image'>
            <img src={Background_final} alt="img" height={440} width={490} style={{ borderRadius: "30px" }} />
          </div>
          <div style={{ textAlign: "center", gap: "2rem", fontSize: "1rem", fontWeight: "normal", marginTop: "40px", display: "flex", flexDirection: "row", alignItems: "center",  }} className='auth-text'>

            <div style={{ display: "flex", gap: "1rem", flexDirection: "column", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <WalletIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Track expenses effortlessly

              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TrendingUpIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Set and achieve financial goals
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Get personalized insights

              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <RocketLaunchIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Build your financial freedom
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="subContainer2"
        style={{
          width: "50%",
          minHeight: "100vh",
          textAlign: "center",
          //borderRight: "1px solid black",
          fontSize: "5rem",
          position: "relative",
          //backgroundColor: "#F5F8F8"
        }}
        className="right-panel"
      >
        <div style={{marginLeft:"30%"}}>
          {toasting && (
  <ToastMessages
    type={toastMsg.type}
    msg={toastMsg.msg}
    onClose={() => setToasing(false)}
  />
)}
        <div style={{
          textAlign: "center",
          position: "absolute",
          top: "5%",
          transform: "translateY(18%)",
          left: "28%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.3rem"
        }}

        >
          <div className="mobile-logo">
            <LogoBlock />
          </div>

          <div style={{ display: "flex" }} className='login-head'>
            <span style={{}} className="primary-color login-title">
              Welcome back
            </span>
          </div>
          <div style={{ fontSize: "0.9rem", textAlign: "left" }} className='sub-register-title'>Log in to manage your finances
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch"
            }}
          >

           
            <div className="form-field">
              <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem",marginTop:"7%" }}>Email Address</label>
              <div style={{ height: "5vh" }}>
                <TextField
                  variant="outlined"
                  className="custom-textfield"
                  placeholder='name@email.com'
                  name="email"
                  onChange={handleInputChange}
                />
              </div>
            </div>
           
            <div className="form-field">
              <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem" }}>Password</label>
              <div style={{ height: "5vh" }}>
                <TextField
                  variant="outlined"
                  className="custom-textfield"
                  placeholder='Enter your password'
                  name="password"
                  onChange={handleInputChange}
                />
              </div>
            </div>
           

            <Button variant="contained" className="custom-button" style={{ marginTop: "20px", width: "100%", maxWidth: "360px" }}
             onClick={handleSubmit}
            >
             Login
            </Button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "2%",
                // margin: "20px 0"
                height: "20px"
              }}
            >
              <hr style={{ width: "40px", border: "0.5px solid #ccc" }} />
              <span style={{ fontSize: "0.9rem", color: "#666" }}>or</span>
              <hr style={{ width: "40px", border: "0.5px solid #ccc" }} />
            </div>
            <Button className="google-button" style={{ marginTop: "2%", width: "100%", maxWidth: "360px" }}
            onClick={() => googleLogin()}>
              <GoogleIcon style={{ marginRight: "8px" }} /> Continue with Google
            </Button>
            <Link  to="/register" style={{ textDecoration: "none",fontSize:"0.9rem",color:"#213547",marginTop:"5%" }} >
             Don't have an account? <span className='primary-color' style={{ fontWeight: "bold", cursor: "pointer" }} >Sign up</span>
            </Link>

          </div>
        </div>
      </div>
      </div>
      </div>
    </>

  );
};


export default Login;
