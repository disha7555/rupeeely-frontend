import React, { useEffect,useState } from 'react';
import logo from '../assets/logo.png';
import Background_final from '../assets/Background_final.png';
import WalletIcon from '@mui/icons-material/Wallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import ToastMessages from '../components/ToastMessages.jsx';
import axios from 'axios';
import helperConfig from '../components/helperConfig.js';
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  
  const navigate = useNavigate();
  const url = helperConfig();
  console.log("url",url); 
  const [toasting,setToasing]=useState(false);
  const [toastMsg,setToastMsg]=useState({type:"",msg:""});
   const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    username: "",
    password: "",
    mobileNumber: ""
  })
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
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await axios.post(
        url + "/api/auth/google/login",
        { accessToken : tokenResponse.access_token },
        { withCredentials: true }
      );
       if(res.data.success){
      setToasing(true);
      handleToast("success", "Logged in with Google");
       setTimeout(()=>{
           navigate("/dashboard");
        },1000);
 // or wherever you want
       }
         else{
          setToasing(true);
          handleToast("error",res.data.message ||  "Login failed");
        }

    } catch (err) {
      setToasing(true);
      handleToast("error", err.response?.data?.message || "Google login failed");
    }
  },
  onError: () => {
    handleToast("error", "Google login failed");
  }
});


// const googleLogin = useGoogleLogin({
//   flow: "auth-code", // get a code for backend exchange 
//   scope: "openid email profile",
//   onSuccess: async (tokenResponse) => {
//     try {
//       const res = await axios.post(
//         url + "/auth/google/login",
//         { accessToken: tokenResponse.access_token }, // or code if using auth-code flow
//         { withCredentials: true }
//       );

//       handleToast("success", "Logged in with Google");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       handleToast("error", "Google login failed");
//     }
//   },
//   onError: () => {
//     handleToast("error", "Google login failed");
//   },
// });
// const googleLogin = useGoogleLogin({
//   flow: "auth-code",  // important
//   onSuccess: async (codeResponse) => {
//     try {
//       // codeResponse.code is what you send to backend
//       const res = await axios.post(
//         url + "/auth/google/login",
//         { code: codeResponse.code },
//         { withCredentials: true }
//       );
//       handleToast("success", "Logged in with Google");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       handleToast("error", "Google login failed");
//     }
//   },
//   onError: () => handleToast("error", "Google login failed"),
// });

  function handleToast(type,msg){
      setToasing(true);
  setToastMsg({type:type,msg:msg});
  setTimeout(() => {
  setToasing(false);
}, 3000);
  }

  const applyValidation = () => {
     if (!formData.name) {
   handleToast("error","Full name is required");
  return;
}

if (!formData.email) {

  handleToast("error","Email is required");
  return;
}

if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    handleToast("error","Email is not valid");
    return;
}
  if (!formData.username) {
       handleToast("error","Username is required");
  return;
}
  if (!formData.password) {

  handleToast("error","Password is required");
  return;
}

if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
.test(formData.password)){
   
  handleToast("error","Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number");
  return;
}
 
if(!formData.mobileNumber){
  
  handleToast("error","Mobile number is required");
  return;
}

if(!/^\d{10}$/.test(formData.mobileNumber)){
   handleToast("error","Mobile number must be 10 digits");
  return;
}
 
if(isNaN(formData.mobileNumber)){
   handleToast("error","Mobile number must be numeric");
  return;
}
return true;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    if(applyValidation()){
      const body ={
        name:formData.name,
        email:formData.email,
        username:formData.username,
        password:formData.password,
        mobile_number:formData.mobileNumber
      }
      axios.post(url + "/api/auth/register",body)
      .then((res)=>{
        if(res.data.success){
        handleToast("success","User registered successfully");
        setTimeout(()=>{
           navigate("/login");
        },2000);
        }
      })
      .catch((err)=>{
        handleToast("error",err.response.data.message ||  "Registration failed");
      });
    }
  }
  return (
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
            Smart Money Management Starts Here
          </div>

          <div style={{ fontSize: "1.2rem", transform: "translate(0%,5%)", alignItems: "center" }} className='auth-image'>
            <img src={Background_final} alt="img" height={440} width={490} style={{ borderRadius: "30px" }} />
          </div>
          <div style={{ textAlign: "center", gap: "2rem", fontWeight: "normal", marginTop: "40px", display: "flex", flexDirection: "row", alignItems: "center" }} className='auth-text'>

            <div style={{ display: "flex", gap: "1rem", flexDirection: "column", textAlign: "center" }}>
              <div style={{  display: "flex", alignItems: "center" }}>
                <WalletIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Track expenses effortlessly

              </div>
              <div style={{  display: "flex", alignItems: "center" }}>
                <TrendingUpIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Set and achieve financial goals
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <div style={{  display: "flex", alignItems: "center" }}>
                <BarChartIcon style={{ fontSize: "1.1rem", color: "#006F76", marginRight: "5px" }} />
                Get personalized insights

              </div>
              <div style={{  display: "flex", alignItems: "center" }}>
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
          transform: "translateY(1%)",
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

          <div style={{ display: "flex" }} className='register-head'>
            <span style={{}} className="primary-color register-title">
              Create your account</span>
          </div>
          <div style={{ fontSize: "0.9rem", textAlign: "left" }} className='sub-register-title'>Start your journey to financial freedom
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
              <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "20px" }}>Full Name</label>
              <div style={{ height: "5vh" }}>
                <TextField
                  variant="outlined"
                  className="custom-textfield"
                  placeholder='Enter your full name'
                  name="name"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-field">
              <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem" }}>Email Address</label>
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
              <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem" }}>User name</label>
              <div style={{ height: "5vh" }}>
                <TextField
                  variant="outlined"
                  className="custom-textfield"
                  placeholder='Enter your user name'
                  name="username"
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
            <div className="form-field">
              <label style={{ textAlign: "left", fontSize: "0.9rem" }}>Mobile number</label>
              <div style={{ height: "5vh" }}>
                <TextField
                  variant="outlined"
                  className="custom-textfield"
                  placeholder='Enter your mobile number'
                  name="mobileNumber"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button variant="contained" className="custom-button" style={{ marginTop: "20px", width: "100%", maxWidth: "360px" }}
            onClick={handleSubmit}
            >
              Create Account
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
            onClick={() => googleLogin()}
            >
              <GoogleIcon style={{ marginRight: "8px" }} /> Continue with Google
            </Button>
            <Link  to="/login" style={{ textDecoration: "none",fontSize:"0.9rem",color:"#213547",marginTop:"5%" }} >
            Already have an account? <span className='primary-color' style={{ fontWeight: "bold", cursor: "pointer" }} >Login</span>
            </Link>

          </div>
        </div>

      </div>
     
    
    </div>

  );
}


export default Register;
