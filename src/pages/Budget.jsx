import React, { useEffect, useState,useRef } from "react";
import {
  Button,
  TextField,
  LinearProgress,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@mui/material";
import Select from "react-select";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToastMessages from "../components/ToastMessages.jsx";
import helperConfig from "../components/helperConfig.js";
import { apiRequest } from "../components/api.js";

const Budget = () => {
  const url = helperConfig();

  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [categories, setCategories] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [isView, setIsView] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [toasting, setToasing] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: "", msg: "" });
  const hasFetched = useRef(false);
  const hasFetchedCat = useRef(false);
  const [formVal, setFormVal] = useState({
    id: null,
    category: null,
    amount: "",
  });
  const [editId, setEditId] = React.useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  

  
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


  const handleClose = () => {
    setEditId("");
    setOpen(false);
    setFormVal({ name: '', description: '' })
    setSelectedCategory(null);
    setIsView(false);
    setIsEdit(false);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  /* ---------------- TOAST ---------------- */
  function handleToast(type, msg) {
    setToasing(true);
    setToastMsg({ type: type, msg: msg });
    setTimeout(() => {
      setToasing(false);
    }, 3000);
  }

  /* ---------------- FETCH ---------------- */
  function callReadOne(id) {
   
    apiRequest({
      method: "get",
      url: url + `/api/budgets/${id}`,
      withCredentials: true,
    })
      .then((res) => {
        const data = res.data.data;
        // console.log('data', data)
        setFormVal({
          ///id: row.id,
          //category: { label: row.category_name, value: row.category_id },
          amount: data.amount,
        });
        setSelectedCategory({
          value: data.category.id,
          label: data.category.name,
        });
        
      })
      .catch((err) => {
       
        if (err.response && err.response.data && err.response.data.message) {
          handleToast("error", err.response.data.message);
        } else {
          handleToast("error", "Something went wrong");
        }
      });

  }
  const fetchCategories = () => {
    apiRequest({
      method: "get",
      url: `${url}/api/categories/list`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          const categoryOptions = res.data?.data?.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }));
          setCategories(categoryOptions);
        } else {
          handleToast("error", "Categories not found");
        }
      })
      .catch(() => {
        handleToast("error", "Failed to load categories");
      });
  };

  const fetchBudgetSummary = (search = "") => {
     setLoading(true);
    apiRequest({
      method: "get",
      url: `${url}/api/budgets/summary`,
      params: { month, year, search },
      withCredentials: true,
    })
      .then((res) => {
        //console.log("res.data",res.data)
        setBudgetList(res.data?.summary || []);
         setLoading(false);
      })
      .catch(() => {
        setLoading(false)
        if (err.response && err.response.data && err.response.data.message) {
          handleToast("error", err.response.data.message);
        } else {
          handleToast("error", "Something went wrong");
        }
      });
  };

  useEffect(() => {
     if(hasFetchedCat.current) return;
    hasFetchedCat.current=true;
    fetchCategories();
  }, []);

  useEffect(() => {
    if(hasFetched.current) return;
    hasFetched.current=true;
    fetchBudgetSummary(searchTerm);
  }, [month, year]);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     fetchBudgetSummary(searchTerm);
  //   }, 400);

  //   return () => clearTimeout(delay);
  // }, [searchTerm]);

  /* ---------------- ACTIONS ---------------- */

  const handleCategoryChange = (selectedOption) => {

    setSelectedCategory({
      value: selectedOption.value,
      label: selectedOption.label,

    });
  };

  const handleOpen = () => {
    setIsEdit(false);
    setFormVal({ id: null, category: null, amount: "" });
    setOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setEditId(row.id);
    callReadOne(row.id);
    //   setFormVal({
    //     id: row.id,
    //     //category: { label: row.category_name, value: row.category_id },
    //     amount: row.amount,
    //   });
    //   setSelectedCategory({
    //     value: row.category.id,
    //     label: row.category.name,
    // });
    setOpen(true);
  };

  const handleView = (row) => {
    setIsView(true);
    setOpen(true);
    callReadOne(row.id);
  };

  const handleDelete = (row) => {
    apiRequest({
      method: "delete",
      url: `${url}/api/budgets/${deleteId}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          handleToast("success", res.data.message);
          setDeleteDialogOpen(false);
          setFormVal({ name: '', description: '' })
          setSelectedCategory(null);
          fetchBudgetSummary(searchTerm);
          
        } else {
          handleToast("error", res.data.message);
        }
      })
      .catch(() => {
        handleToast("error", "Failed to delete budget");
      });
  };

  const handleSave = () => {
    if (!formVal.amount) {
      handleToast("error", "Category and amount are required");
      return;
    }

    const payload = {
      category_id: selectedCategory.value,
      amount: formVal.amount,
      month,
      year,
    };

    if (isEdit) {
      apiRequest({
        method: "put",
        url: `${url}/api/budgets/${editId}`,
        data: payload,
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.success) {
            handleToast("success", res.data.message);
            setOpen(false);
            fetchBudgetSummary(searchTerm);
          } else {
            handleToast("error", res.data.message);
          }
        })
        .catch((err) => {
          handleToast("error", err.response?.data?.message || "Failed to update");
        });
    } else {
      apiRequest({
        method: "post",
        url: `${url}/api/budgets`,
        data: payload,
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.success) {
            handleToast("success", res.data.message);
            setOpen(false);
            fetchBudgetSummary(searchTerm);
          } else {
            handleToast("error", res.data.message);
          }
        })
        .catch((err) => {
          handleToast("error", err.response?.data?.message || "Failed to save");
        });
    }
  };

  const getProgress = (spent, budget) => {
    if (!budget) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const filteredBudgets = budgetList
  // .filter((item) =>
  //   item.category?.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  //console.log("filteredBudgets", filteredBudgets)
  /* ---------------- UI ---------------- */

  return (
    <div className="page-container" style={{ width: "100%", minHeight: "100vh", textAlign: "left" }}>
      {loading && (   <div style={loaderWrapperStyle}>
                <div style={loaderStyle} />
                <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                </style>
            </div>)}
       <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >        <div>
          <h2 className="head-color">Budget Planning</h2>
          <div className="head-color">Plan and track your monthly budgets</div>
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
            placeholder="Search Budget ..."
            value={searchTerm}
            className="custom-textfield"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "240px", marginRight: "15px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#b1b1b1" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            className="custom-button common-btn"
            variant="contained"
            onClick={handleOpen}
            style={{ height: "36px" }}
          >
            Add Budget
          </Button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <TextField
          type="number"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ width: "120px" }}
          className="custom-textfield"
        />
        <TextField
          type="number"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ width: "120px" }}
          className="custom-textfield"
        />
      </div>


      {/* ------------- BUDGET TABLE ------------- */}
      <div style={{ marginTop: "50px", marginRight: "2.8%" }}>
        <TableContainer sx={{ maxHeight: 440,overflowX: "auto" }}>
          <Table stickyHeader aria-label="sticky table" className='table-style' size='small'>
            <TableHead style={{ color: "#333333" }}>
              <TableRow>
                <TableCell style={{
                  fontSize: "0.95rem",
                  fontWeight: "550",
                  //minWidth: column.minWidth,
                  width: "3%",
                  backgroundColor: "#eeeeee",
                  paddingLeft: "22px",
                  //width:column.id=="amount"?"150":"auto",
                  maxWidth: "auto",
                  //paddingRight: "0px",


                }}>Category
                </TableCell>

                <TableCell
                  align="right"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "550",
                    //minWidth: column.minWidth,
                    width: "8%",
                    backgroundColor: "#eeeeee",
                    //paddingLeft: "22px",
                    //width:column.id=="amount"?"150":"auto",
                    maxWidth: "100",
                    paddingRight: "0px",


                  }}>Budget
                </TableCell>

                <TableCell
                  align="right"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "550",
                    //minWidth: column.minWidth,
                    width: "8%",
                    backgroundColor: "#eeeeee",
                    paddingLeft: "0px",
                    //width:column.id=="amount"?"150":"auto",
                    maxWidth: "auto",
                    paddingRight: "0px",


                  }}>Expense
                </TableCell>

                <TableCell
                  align="right"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "550",
                    //minWidth: column.minWidth,
                    width: "8%",
                    backgroundColor: "#eeeeee",
                    paddingLeft: "22px",
                    //width:column.id=="amount"?"150":"auto",
                    maxWidth: "auto",
                    paddingRight: "100px",


                  }}>Remaining
                </TableCell>

                <TableCell style={{
                  fontSize: "0.95rem",
                  fontWeight: "550",
                  //minWidth: column.minWidth,
                  width: "8%",
                  backgroundColor: "#eeeeee",
                  paddingLeft: "22px",
                  //width:column.id=="amount"?"150":"auto",
                  maxWidth: "auto",
                  //paddingRight: "0px",


                }}>Progress
                </TableCell>

                <TableCell align="right" style={{
                  fontSize: "0.95rem",
                  fontWeight: "550",
                  paddingRight: "22px",
                  //minWidth: 50,
                  width: "5%",
                  backgroundColor: "#eeeeee",
                }}>Actions
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBudgets.length > 0 ? (
                filteredBudgets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    const progress = getProgress(item.spent || 0, Number(item.amount));
                    const exceeded = (item.spent || 0) > Number(item.amount);

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                        <TableCell style={{ paddingLeft: "22px" }}>
                          {item.category?.name}
                        </TableCell>

                        <TableCell style={{ paddingRight: "0px" }} align="right">
                          ₹{parseFloat(item.amount).toFixed(2)}
                        </TableCell>

                        <TableCell style={{ paddingRight: "0px" }} align="right">
                          ₹{parseFloat(item.spent || 0).toFixed(2)}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            color: exceeded ? "#A53A33" : "#006F76",
                            paddingRight: "100px",

                          }}
                        >
                          ₹{parseFloat(Number(item.amount) - (item.spent || 0)).toFixed(2)}
                        </TableCell>

                        <TableCell style={{ width: "220px",paddingLeft:"20px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 8,
                              borderRadius: 5,
                              backgroundColor: "#eee",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: exceeded ? "#A53A33" : "#006F76",
                              },
                            }}
                          />
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          <VisibilityIcon style={{ color: "#006F76", fontSize: "20px" }} onClick={() => handleView(item)} />

                          <EditIcon style={{ color: "#006F76", fontSize: "20px", marginLeft: "10px" }} onClick={() => handleEdit(item)} />



                          <DeleteIcon style={{ color: "#A53A33", fontSize: "20px", marginLeft: "10px" }} onClick={() => {
                            setDeleteDialogOpen(true)
                            setDeleteId(item.id)
                          }} />

                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: "550",
                    }}
                  >
                    No Budgets yet
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
          count={filteredBudgets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}
         PaperProps={{
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
      {/* ------------- BUDGET CARDS ------------- */}
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
          marginTop: "35px",
        }}
      >
        {filteredBudgets.length > 0 ? (
          filteredBudgets.map((item) => {
            const progress = getProgress(item.spent || 0, item.budget);
            const exceeded = (item.spent || 0) > item.budget;

            return (
              <div
                key={item.budget_id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  backgroundColor: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>{item.category_name}</div>
                  <div>
                    <IconButton size="small" onClick={() => handleEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.budget_id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                <div style={{ fontSize: "0.85rem", marginTop: "5px" }}>Budget: ₹{item.budget}</div>
                <div style={{ fontSize: "0.85rem" }}>Spent: ₹{item.spent || 0}</div>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    marginTop: "10px",
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#eee",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: exceeded ? "#A53A33" : "#006F76",
                    },
                  }}
                />

                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "0.8rem",
                    color: exceeded ? "#A53A33" : "#006F76",
                  }}
                >
                  {exceeded
                    ? `Exceeded by ₹${(item.spent || 0) - item.budget}`
                    : `Remaining ₹${item.budget - (item.spent || 0)}`}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ marginTop: "20px", fontWeight: 500 }}></div>
        )}
      </div> */}

      {/* ------------- DIALOG ------------- */}
      <Dialog open={open} onClose={() => setOpen(false)} 
         PaperProps={{
                            sx: {
                                overflowX: "hidden",
                                minHeight: 250,
                                width: {
                                    xs: "73%",   // mobile
                                    sm: 420,     // tablet
                                    md: 470,     // desktop
                                },
                                maxWidth: "95%",
                            },
                        }}
                                    >
        <DialogTitle className="prinamry-bgcolor" style={{ textAlign: "center" }}>
          {isView ? "View Budget" : isEdit ? "Edit Budget" : "Add Budget"}
          <CloseIcon onClick={handleClose} sx={{ color: 'white', float: "right", cursor: "pointer" }} />
        </DialogTitle>

        <DialogContent style={{ fontSize: "1.2rem", textAlign: "center", marginTop: "5px", color: "black" }}>

          <div className="form-field">
            <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "20px" }}>Category</label>
<Box
  sx={{
    width: {
      xs: "100%",
      sm: 360,
      md: 425,
    },
    mt: "5px",
  }}
>
            <Select
              options={categories}
              placeholder="Select Category"
              value={selectedCategory}
              // onChange={(val) => setFormVal({ ...formVal, category: val })}
              onChange={handleCategoryChange}
              isDisabled={isView}
              styles={{
                // control: (base, state) => ({
                //   ...base,
                //   width: 425,
                //   minHeight: 35,
                //   height: 35,
                //   fontSize: "14px",
                //   marginTop: "5px",
                //   // keep default border color
                //   borderColor: state.isFocused ? "#006F76" : base.borderColor,

                //   // borderColor: state.isFocused ? "#006F76" : "hsl(0, 0%, 20%)",
                //   boxShadow: state.isFocused ? "0 0 0 1px #006F76" : "none",
                //   "&:hover": {
                //     borderColor: "black"
                //   }
                // }),
                // menu: (base) => ({
                //   ...base,
                //   width: 425,
                // }),
                control: (base, state) => ({
        ...base,
        width: "100%",
        minHeight: 35,
        height: 35,
        fontSize: "14px",
        borderColor: state.isFocused ? "#006F76" : base.borderColor,
        boxShadow: state.isFocused ? "0 0 0 1px #006F76" : "none",
        "&:hover": { borderColor: "black" }
      }),
      menu: (base) => ({
        ...base,
        width: "100%",
      }),

                menuList: (base) => ({
                  ...base,
                 // width: 425,
                }),

                valueContainer: (base) => ({
                  ...base,
                  width: 425,
                  height: 35,
                  padding: "0 8px",
                  fontSize: "14px"
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "black",
                  fontWeight: 500
                }),


                option: (base, state) => ({
                  ...base,
                  width: 425,
                  fontSize: "14px",
                  backgroundColor: state.isSelected
                    ? "#006F76"
                    : state.isFocused
                      ? "#BFE9EA"
                      : "white",
                  color: state.isSelected ? "white" : "black",
                  ":active": {
                    backgroundColor: "#BFE9EA"
                  }
                }),

                indicatorSeparator: () => ({
                  display: "none"
                }),

                dropdownIndicator: (base, state) => ({
                  ...base,
                  color: state.selectProps.menuIsOpen ? "#006F76" : base.color,

                  //color: state.isFocused ? "0 0 0 1px #006F76" : "hsl(0, 0%, 20%)",
                  // color: "#006F76",
                  "&:hover": {
                    color: "black"
                  }
                })
              }}
            />
            </Box>
          </div>

          <div className="form-field">
            <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "20px" }}>Budget</label>

            <TextField
             sx={{
                                        width: {
                                            xs: "100%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
              //style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
              variant="outlined"
              fullWidth
              type="number"
              value={formVal.amount}
              placeholder="Enter Budget"
              margin="normal"
              onChange={(e) => setFormVal({ ...formVal, amount: e.target.value })}
              className="custom-textfield"
              disabled={isView}
            />
          </div>
        </DialogContent>

        {!isView && (
          <DialogActions>
            <Button className='custom-button common-btn' variant="contained" style={{ width: "70px" }} onClick={handleClose}>Cancel</Button>
            <Button className='custom-button common-btn' variant="contained" style={{ width: "70px" }} onClick={handleSave}>Save</Button>
          </DialogActions>
        )}

      </Dialog>
    </div>
  );
};

export default Budget;
