import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "@mui/material";
import helperConfig from './helperConfig.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import ToastMessages from './ToastMessages.jsx'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const Navbar = () => {
    const url = helperConfig();
    const [open, setOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasting, setToasing] = useState(false);
    const [toastMsg, setToastMsg] = useState({ type: "", msg: "" });
    const navigate = useNavigate();
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
    function handleToast(type, msg) {
        setToasing(true);
        setToastMsg({ type: type, msg: msg });
        setTimeout(() => {
            setToasing(false);
        }, 1000);
    }


    const LogoBlock = () => (
        <div className="logo-block">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={logo} alt="Logo" width={40} height={40} />
                <span
                    style={{ fontSize: "1.8rem", marginLeft: "1rem", fontWeight: "bold" }}
                    className="primary-color"
                >
                    Rupeeely
                </span>
            </div>
        </div>
    );

    const handleLogout = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                url + "/api/auth/logout",
                {},
                { withCredentials: true }
            );

            setToasing(true);
            handleToast("success", "Logged out successfully");
            setOpen(false); // close menu
            setTimeout(() => {
                navigate("/login"); // redirect
            },1000);
        } catch (err) {
            console.error("Logout failed", err);
            setLoading(false);
            setToasing(true)
            handleToast(
                "error",
                err.response?.data?.message || "logout failed"
            );
        }
    };
    return (<>
        
        <nav className="navbar">
            <LogoBlock />

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </button>

            <ul className={`menu ${open ? "open" : ""}`}>
                <NavLink className="nav-link" to="/dashboard" style={({ isActive }) => ({
                    color: isActive ? "#006F76" : "#335F61",
                    fontWeight: isActive ? "bold" : "normal"
                })}>Dashboard</NavLink>
                <NavLink className="nav-link" to="/categories" style={({ isActive }) => ({
                    color: isActive ? "#006F76" : "#335F61",
                    fontWeight: isActive ? "bold" : "normal"
                })}>Categories</NavLink>
                <NavLink className="nav-link" to="/expenses" style={({ isActive }) => ({
                    color: isActive ? "#006F76" : "#335F61",
                    fontWeight: isActive ? "bold" : "normal"
                })}>Expenses</NavLink>
                <NavLink className="nav-link" to="/budget" style={({ isActive }) => ({
                    color: isActive ? "#006F76" : "#335F61",
                    fontWeight: isActive ? "bold" : "normal"
                })}>Budget</NavLink>
                <Button
                    className="logout-button"
                    onClick={() => setLogoutOpen(true)}

                >
                    Logout
                </Button>
                 {toasting && (
  <ToastMessages
    type={toastMsg.type}
    msg={toastMsg.msg}
    onClose={() => setToasing(false)}
  />
)}
                <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} PaperProps={{
                    sx: {
                        minHeight: 210, // 👈 increase height
                        width: 360,     // optional, for better balance
                    },
                }}>
                    
                    <DialogTitle style={{ textAlign: "center", padding: "14px 22px" }} className="prinamry-bgcolor">Logout
                        <CloseIcon onClick={() => setLogoutOpen(false)} sx={{ color: 'white', float: "right", cursor: "pointer" }} />

                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ fontSize: "1rem", textAlign: "center", marginTop: "20px", color: "black" }}>
                            Are you sure you want to logout?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className='cancel-button common-btn' variant="contained" onClick={() => setLogoutOpen(false)}>Cancel</Button>
                        <Button className='custom-button common-btn' variant="contained" color="error" style={{ backgroundColor: "#888" }} onClick={handleLogout}  disabled={loading}>
                             {loading ? "Logging out..." : "Logout"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </ul>
        </nav>
    </>
    );
};

export default Navbar;
