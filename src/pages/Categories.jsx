import { Button, TextField, InputAdornment } from '@mui/material'
import React, { useState } from 'react'
import dayjs from "dayjs";
import { useEffect } from "react"
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToastMessages from '../components/ToastMessages.jsx';
import helperConfig from '../components/helperConfig.js';
import { apiRequest } from "../components/api.js";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from "@mui/material";
import axios from 'axios';
const Categories = () => {

    const url = helperConfig();
    const [deleteId, setDeleteId] = useState();
    const [formVal, setFormVal] = React.useState({
        name: '',
        description: ''
    })

    const [isView, setIsView] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEdit, setIsEdit] = React.useState(false);
    const [toasting, setToasing] = React.useState(false);
    const [toastMsg, setToastMsg] = React.useState({ type: "", msg: "" });
    const [editId, setEditId] = React.useState();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const delay = setTimeout(() => {
            getAllData(searchTerm);
        }, 400);

        return () => clearTimeout(delay);
    }, [searchTerm]);


    const columns = [
        { id: 'name', label: 'Name', minWidth: 200 },
        {
            id: 'description',
            label: 'Description',
            minWidth: 300,
            align: 'left',
            //format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'created_at',
            label: 'Created Date',
            minWidth: 110,
            align: 'left',
            format: (value) => value ? dayjs(value).format("DD-MM-YYYY") : "-"
        },
        // {
        //     id: 'actions',
        //     label: 'Actions',
        //     minWidth: 80,
        //     align: 'right',
        //     // format: (value) => value.toLocaleString('en-US'),
        // },

    ];

    // const rows = [
    //     createData('Category 1', 'This is a description for category 1', '2022-01-01'),
    //     createData('Category 2', 'This is a description for category 2', '2022-01-02'),
    //     createData('Category 3', 'This is a description for category 3', '2022-01-03'),
    //     createData('Category 4', 'This is a description for category 4', '2022-01-04'),
    //     createData('Category 5', 'This is a description for category 5', '2022-01-05'),
    // ];


    const handleEdit = (id) => {
        setEditId(id);
        setIsView(false);
        setIsEdit(true);
        setOpen(true);
        callReadOne(id);
    }
    const handleView = (id) => {
        setIsEdit(false);
        setIsView(true);
        setOpen(true);
        callReadOne(id);
    }

    function handleToast(type, msg) {
        setToasing(true);
        setToastMsg({ type: type, msg: msg });
        setTimeout(() => {
            setToasing(false);
        }, 3000);
    }


    const handleDelete = () => {
        apiRequest({
            method: "delete",
            url: `${url}/api/categories/${deleteId}`,
            withCredentials: true,
        })
            .then((res) => {
                if (res.data.success) {
                    handleToast("success", res.data.message);
                    setFormVal({ name: '', description: '' })
                    setDeleteDialogOpen(false);
                    getAllData();
                }
                else {
                    handleToast("error", res.data.message);
                }
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.message) {
                    handleToast("error", err.response.data.message);
                } else {
                    handleToast("error", "Something went wrong");
                }
            });

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormVal({ ...formVal, [name]: value })
    }

    const handleCreate = () => {
        apiRequest({
            method: "post",
            url: `${url}/api/categories`,
            data: formVal,
            withCredentials: true,
        })
            .then((res) => {
                if (res.data.success) {
                    handleToast("success", res.data.message);
                    setFormVal({ name: '', description: '' })
                    handleClose();
                    getAllData();
                }
                else {
                    handleToast("error", res.data.message);
                }
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.message) {
                    handleToast("error", err.response.data.message);
                } else {
                    handleToast("error", "Something went wrong");
                }
            });

    }
    const handleEditSubmit = () => {
        apiRequest({
            method: "put",
            url: `${url}/api/categories/${editId}`,   // include ID in URL for update
            data: formVal,
            withCredentials: true,
        })
            .then((res) => {
                if (res.data.success) {
                    handleToast("success", res.data.message);
                    setFormVal({ name: '', description: '' })
                    handleClose();
                    getAllData();
                }
                else {
                    handleToast("error", res.data.message);
                }
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.message) {
                    handleToast("error", err.response.data.message);
                } else {
                    handleToast("error", "Something went wrong");
                }
            });

    }

    const handleSubmit = () => {


        if (!formVal.name) {
            handleToast("error", "Please enter category name");
        }

        //         axios.post(url + '/api/categories', formVal,{
        //         withCredentials: true,
        //     headers: {
        //     authorization: `Bearer ${localStorage.getItem("accesstoken")}`
        //     }
        //   },)
        if (isEdit) {
            handleEditSubmit();
        }
        else {
            handleCreate();
        }
    }


    function getAllData(search = '') {
        setLoading(true);
        apiRequest({
            method: "get",
            url: url + "/api/categories",
            params: { search },
            withCredentials: true,
        })
            .then((res) => {
                setRows(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.message) {
                    handleToast("error", err.response.data.message);
                } else {
                    handleToast("error", "Something went wrong");
                }
            });

    }

    function callReadOne(id) {
        apiRequest({
            method: "get",
            url: url + `/api/categories/${id}`,
            withCredentials: true,
        })
            .then((res) => {
                const data = res.data.data;
                console.log('data', data)
                setFormVal({
                    name: data.name,
                    description: data.description,
                    // created_date: data.created_date,
                })
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.message) {
                    handleToast("error", err.response.data.message);
                } else {
                    handleToast("error", "Something went wrong");
                }
            });

    }


    // function createData(name, description, created_date) {

    //     return { name, description, created_date };
    // }
    const [open, setOpen] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {

        setOpen(false);
        setFormVal({ name: '', description: '' })
        setIsView(false);
        setIsEdit(false);
    }
    return (
        <div
            className='page-container'
            style={{
                width: "100%",
                minHeight: "100vh", // keeps extra height
                textAlign: "left",
                //  marginTop:"25px",
                // display: "flex",
                // flexDirection: "row",
                // position: "relative",
                // alignItems: "center", // vertical centering
            }}
        >
            {loading && (<div style={loaderWrapperStyle}>
                <div style={loaderStyle} />
                <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                </style>
            </div>)}
            {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}> */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{}} className='head-color'>Category Management</h2>

                    <div className='head-color'>Manage your expense categories</div>
                </div>
                <div style={{ marginRight: "2.8%", paddingTop: "12px" }}>
                    {toasting && (
                        <ToastMessages
                            type={toastMsg.type}
                            msg={toastMsg.msg}
                            onClose={() => setToasing(false)}
                        />
                    )}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                        }}
                    >

                        <TextField
                            style={{ marginRight: "15px" }}
                            sx={{
                                width: {
                                    xs: "100%",   // mobile
                                    sm: "100%",
                                    md: "225px",  // desktop
                                },
                            }}
                            variant="outlined"
                            className="custom-textfield"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#b1b1b1' }} />
                                    </InputAdornment>
                                ),
                            }}
                            // id="outlined-basic"
                            // label="Search Categories"
                            placeholder='Search Categories...'
                            onChange={(e) => setSearchTerm(e.target.value)}

                        />

                        <Button className='custom-button common-btn' variant="contained" style={{ height: "35px" }} onClick={handleOpen}>
                            Add Category
                        </Button>
                    </div>
                    <Dialog open={open} onClose={handleClose}
                        PaperProps={{
                            sx: {
                                minHeight: 250,
                                overflowX: "hidden",
                                width: {
                                    xs: "80%",   // mobile
                                    sm: 420,     // tablet
                                    md: 470,     // desktop
                                },
                                maxWidth: "95%",
                            },
                        }}
                        style={{overflowx:"none"}}
                    >
                        <DialogTitle style={{ textAlign: "center", padding: "14px 22px" }} className="prinamry-bgcolor">
                            {isView ? "View Category" : isEdit ? "Edit Category" : "Add Category"}
                            <CloseIcon onClick={handleClose} sx={{ color: 'white', float: "right", cursor: "pointer" }} />
                        </DialogTitle>

                        <DialogContent style={{ fontSize: "1.2rem", textAlign: "center", marginTop: "5px", color: "black",overflowX:"none" }} >
                            <div className="form-field">
                                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "20px" }}>Category Name</label>

                                <TextField
                                    sx={{
                                        width: {
                                            xs: "70%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
                                    //style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
                                    variant="outlined"
                                    name="name"
                                    className="custom-textfield"
                                    placeholder="Enter Category Name"
                                    // fullWidth
                                    value={formVal.name}
                                    margin="normal"
                                    onChange={handleChange}
                                    disabled={isView}
                                />
                            </div>


                            <div className="form-field" style={{}}>
                                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "5px" }}>Description</label>

                                <TextField
                                    id="outlined-multiline-flexible"
                                    multiline
                                    maxRows={2}
                                    name="description"
                                    //
                                    sx={{
                                        width: {
                                            xs: "70%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
                                    //style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
                                    // variant="outlined"
                                    //className="custom-textfield"
                                    className='custom-textarea'
                                    value={formVal.description}
                                    placeholder="Enter Category Description"
                                    //   sx={{
                                    //     width: "240px",
                                    //     mr: "15px",
                                    //     "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    //     borderColor: "#006F76",
                                    //     },
                                    // }}
                                    //  type="number"
                                    // fullWidth
                                    disabled={isView}
                                    margin="normal"
                                    onChange={handleChange}
                                />
                            </div>
                        </DialogContent>
                        {!isView && (
                            <DialogActions>
                                <Button className='custom-button common-btn' variant="contained" style={{ width: "70px" }} onClick={handleClose}>Cancel</Button>
                                <Button className='custom-button common-btn' variant="contained" style={{ width: "70px" }} onClick={handleSubmit}>Save</Button>
                            </DialogActions>
                        )}

                    </Dialog>

                </div>
            </div>
            <div style={{ marginTop: "50px", marginRight: "2.8%" }}>
                <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
                    <Table stickyHeader aria-label="sticky table" className='table-style' size='small'>
                        <TableHead style={{ color: "#333333" }}>
                            <TableRow >
                                {columns.map((column) => (

                                    <TableCell

                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            fontSize: "0.95rem",
                                            fontWeight: "550",
                                            minWidth: column.minWidth,
                                            backgroundColor: "#eeeeee",
                                            //paddingLeft: column.id == "name" ? "22px" : "0px"
                                            paddingLeft: column.id === "name" ? { xs: "8px", sm: "22px" } : 0,
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>


                                ))}
                                <TableCell
                                    key="actions"
                                    label="Actions"
                                    align="right"
                                    minwidth={50}
                                    style={{
                                        fontSize: "0.95rem",
                                        fontWeight: "550",
                                        paddingRight: "22px",
                                        minWidth: 80,
                                        backgroundColor: "#eeeeee",
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {rows.length > 0 ? rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                // console.log("col",column.id)
                                                // console.log("row",row[column.id])
                                                const value = row[column.id];
                                                return (
                                                    <>
                                                        <TableCell key={column.id} align={column.align} style={{ paddingLeft: column.id == "name" ? "22px" : "0px" }}>
                                                            {column.format ? column.format(value) : value}

                                                        </TableCell>

                                                    </>
                                                );
                                            })}
                                            <TableCell style={{ textAlign: "right" }}>
                                                <VisibilityIcon style={{ color: "#006F76", fontSize: "20px" }} onClick={() => handleView(row.id)} />
                                                <EditIcon style={{ color: "#006F76", fontSize: "20px", marginLeft: "10px" }} onClick={() => handleEdit(row.id)} />
                                                <DeleteIcon style={{ color: "#A53A33", fontSize: "20px", marginLeft: "10px" }} onClick={() => {
                                                    setDeleteDialogOpen(true)
                                                    setDeleteId(row.id)
                                                }} />

                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                <TableRow>
                                    <TableCell colSpan={4} style={{ justifyContent: "center", textAlign: 'center', border: "none", fontSize: "1rem", fontWeight: "550" }}>
                                        No categories yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    style={{ marginTop: "25px" }}
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{
                    sx: {
                        minHeight: 210, //  increase height
                        width: 360,     // optional, for better balance
                    },
                }}>
                    <DialogTitle style={{ textAlign: "center", padding: "14px 22px" }} className="prinamry-bgcolor">Delete
                        <CloseIcon onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'white', float: "right", cursor: "pointer" }} />

                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ fontSize: "1rem", textAlign: "center", marginTop: "20px", color: "black" }}>
                            Are you sure you want to Delete?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className='cancel-button common-btn' variant="contained" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button className='delete-button  common-btn' variant="contained" color="error" style={{ backgroundColor: "#A53A33" }} onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Categories