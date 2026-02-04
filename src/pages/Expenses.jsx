import { Button, TextField, InputAdornment, TableFooter,Box } from '@mui/material'
import React, { useState } from 'react'
import Select from "react-select";
import { useEffect,useRef } from "react"
import dayjs from "dayjs";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

// Explicitly attach it (sometimes needed in strict environments)



import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@mui/material";
import axios from 'axios';
const Expenses = () => {

  const url = helperConfig();
  const [deleteId, setDeleteId] = useState();
  const [formVal, setFormVal] = React.useState({
    amount: '',
    description: '',
    expense_date: ''
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [isView, setIsView] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEdit, setIsEdit] = React.useState(false);
  const [toasting, setToasing] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState({ type: "", msg: "" });
  const [editId, setEditId] = React.useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [grandTotal, setGrandTotal] = useState();
  const [filteredTotal, setFilteredTotal] = useState();
  const hasFetched = useRef(false);
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

  // useEffect(() => {
  //   getAllData();
  // }, [])

  // Debounce helper
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     getAllData(searchTerm);
  //   }, 400);

  //   return () => clearTimeout(delay);
  // }, [searchTerm]);

  useEffect(() => {
    const delay = setTimeout(() => {
      getAllData(searchTerm, startDate, endDate);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

 useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  getCategoriesList();
}, []);

  const columns = [
    {
      id: 'category',
      label: 'Category',
      //minWidth: "40%",
      width: "8%",
      align: 'left',

    },
    {
      id: 'amount',
      label: 'Amount',
      align: "right",
      //  minWidth: "30%"
      width: "7%",
      format: (value) => value ?  ` ₹${parseFloat(value).toFixed(2)}` : "-"
    },
    {
      id: 'expense_date',
      label: 'Expense Date',
      // minWidth: "8%",
      width: "11%",
      align: 'left',
      format: (value) => value ? dayjs(value).format("DD-MM-YYYY") : "-"
    },
    {
      id: 'description',
      label: 'Description',
      //minWidth: "150%",
      width: "16%",
      align: 'left',
      //format: (value) => value.toLocaleString('en-US'),
    },



    // {
    //     id: 'actions',
    //     label: 'Actions',
    //     minWidth: 80,
    //     align: 'right',
    //     // format: (value) => value.toLocaleString('en-US'),
    // },

  ];



  // const downloadPDF = () => {
  //   if (!rows || rows.length === 0) {
  //     handleToast("error", "No data to download");
  //     return;
  //   }

  //   try {
  //     const doc = new jsPDF();

  //     // Optional: better title positioning
  //     doc.setFontSize(16);
  //     doc.text("Expense Report", 14, 15);

  //     const tableColumn = ["Category", "Amount", "Expense Date", "Description"];

  //     const tableRows = rows.map((row) => [
  //       row?.category?.name || "-",
  //       row?.amount ? parseFloat(row.amount).toFixed(2) : "0.00",
  //       row?.expense_date ? dayjs(row.expense_date).format("DD-MM-YYYY") : "-",
  //       row?.description || "-",

  //     ]);

  //     // ─── Preferred modern call ────────────────────────────────
  //     autoTable(doc, {
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 20,
  //       theme: "striped",           // optional: 'striped' | 'grid' | 'plain'
  //       styles: {
  //         fontSize: 8,
  //         cellPadding: 3,
  //       },
  //       headStyles: {
  //         fillColor: [220, 220, 220], // light gray
  //         textColor: [0, 0, 0],
  //         fontStyle: "bold",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 50 },     // Category
  //         1: { cellWidth: 35 },     // Amount
  //         2: { cellWidth: 40 },     // Date
  //         3: { cellWidth: "auto" }, // Description
  //       },
  //       margin: { top: 25, left: 14, right: 14 },
  //     });

  //     doc.save("expense_report.pdf");
  //   } catch (error) {
  //     console.error("PDF generation failed:", error);
  //     handleToast("error", "Failed to generate PDF – check console");
  //   }
  // };

  // const downloadPDF = () => {
  //   if (!rows || rows.length === 0) {
  //     handleToast("error", "No data to download");
  //     return;
  //   }

  //   try {
  //     const doc = new jsPDF();

  //     // Optional: better title positioning
  //     doc.setFontSize(16);
  //     doc.text("Expense Report", 14, 15);

  //     const tableColumn = ["Category", "Amount", "Expense Date", "Description"];

  //     const tableRows = rows.map((row) => [
  //       row?.category?.name || "-",
  //       row?.amount ? parseFloat(row.amount).toFixed(2) : "0.00",
  //       row?.expense_date ? dayjs(row.expense_date).format("DD-MM-YYYY") : "-",
  //       row?.description || "-",

  //     ]);

  //     // ─── Preferred modern call ────────────────────────────────
  //     autoTable(doc, {
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 20,
  //       theme: "striped",           // optional: 'striped' | 'grid' | 'plain'
  //       styles: {
  //         fontSize: 8,
  //         cellPadding: 3,
  //       },
  //       headStyles: {
  //         fillColor: [220, 220, 220], // light gray
  //         textColor: [0, 0, 0],
  //         fontStyle: "bold",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 50 },     // Category
  //         1: { cellWidth: 35 },     // Amount
  //         2: { cellWidth: 40 },     // Date
  //         3: { cellWidth: "auto" }, // Description
  //       },
  //       margin: { top: 25, left: 14, right: 14 },
  //     });

  //     doc.save("expense_report.pdf");
  //   } catch (error) {
  //     console.error("PDF generation failed:", error);
  //     handleToast("error", "Failed to generate PDF – check console");
  //   }
  // };

  const downloadPDF = () => {
    if (!rows || rows.length === 0) {
      handleToast("error", "No data to download");
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Expense Report", 14, 15);

      const tableColumn = ["Category", "Amount", "Expense Date", "Description"];

      const dataRows = rows.map((row) => [
        row?.category?.name || "-",
        row?.amount ? parseFloat(row.amount).toFixed(2) : "0.00",
        row?.expense_date ? dayjs(row.expense_date).format("DD-MM-YYYY") : "-",
        row?.description || "-",
      ]);

      // ── Add total rows ───────────────────────────────────────
      const totalRows = [];

      // Filtered Total (only if filter is active)
      if (filteredTotal !== undefined && filteredTotal !== null) {
        totalRows.push([
          "Filtered Total" +
          (startDate && endDate
            ? ` (${dayjs(startDate).format("DD-MM-YYYY")} to ${dayjs(endDate).format("DD-MM-YYYY")})`
            : ""),
          parseFloat(filteredTotal).toFixed(2),
          "",
          "",
        ]);
      }

      // Grand Total (always shown)
      totalRows.push([
        "Grand Total",
        parseFloat(grandTotal || 0).toFixed(2),
        "",
        "",
      ]);

      const tableRows = [...dataRows, ...totalRows];

      // autoTable(doc, {
      //   head: [tableColumn],
      //   body: tableRows,
      //   startY: 20,
      //   theme: "striped",
      //   styles: {
      //     fontSize: 8,
      //     cellPadding: 3,
      //   },
      //   headStyles: {
      //     fillColor: [220, 220, 220],
      //     textColor: [0, 0, 0],
      //     fontStyle: "bold",
      //   },
      //   columnStyles: {
      //     0: { cellWidth: 50 },     // Category
      //     1: { cellWidth: 35},     // Amount – right aligned by default
      //     2: { cellWidth: 40 },     // Date
      //     3: { cellWidth: "auto" }, // Description
      //   },
      //   margin: { top: 25, left: 14, right: 14 },

      //   // ── Style the total rows differently ────────────────────────
      //   didParseCell(data) {
      //     if (data.row.index >= dataRows.length) {
      //       // This is a total row
      //       data.cell.styles.fontStyle = "bold";
      //       data.cell.styles.fillColor = [240, 240, 240]; // light gray background
      //       if (data.column.index === 0) {
      //         data.cell.styles.halign = "left";
      //       }
      //       if (data.column.index === 1) {
      //         data.cell.styles.halign = "right";
      //       }
      //     }
      //   },
      // });
      // autoTable(doc, {
      //   head: [tableColumn],
      //   body: tableRows,
      //   startY: 20,
      //   theme: "striped",
      //   styles: {
      //     fontSize: 8,
      //     cellPadding: 3,
      //     overflow: 'linebreak',          // ← helps long text wrap instead of overflow
      //   },
      //   headStyles: {
      //     fillColor: [220, 220, 220],
      //     textColor: [0, 0, 0],
      //     fontStyle: "bold",
      //   },
      //   columnStyles: {
      //     0: { 
      //       cellWidth: 'wrap',            // ← key change: auto-size based on content
      //       halign: 'left',
      //     },
      //     1: { 
      //       cellWidth: 38,                // slightly wider than 35 — adjust if needed
      //       halign: 'right',              // ← explicitly right-align numbers + totals
      //     },
      //     2: { cellWidth: 42 },
      //     3: { cellWidth: 'auto' },
      //   },
      //   margin: { top: 25, left: 14, right: 14 },

      //   didParseCell(data) {
      //     // Style total rows
      //     if (data.row.index >= dataRows.length) {
      //       data.cell.styles.fontStyle = 'bold';
      //       data.cell.styles.fillColor = [240, 240, 240];

      //       // Force right align on amount cell in total rows (safety)
      //       if (data.column.index === 1) {
      //         data.cell.styles.halign = 'right';
      //       }
      //     }
      //   },

      //   // Optional: better handling for very long wrapped text
      //   rowPageBreak: 'avoid',   // try to keep totals on same page as last data
      // });
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: {
            cellWidth: 'wrap',
            halign: 'left',
          },
          1: {
            cellWidth: 38,
            halign: 'right',           // numbers + totals right-aligned
          },
          2: { cellWidth: 42 },
          3: { cellWidth: 'auto' },
        },
        margin: { top: 25, left: 14, right: 14 },

        didParseCell(data) {
          // ── NEW: right-align the "Amount" header ───────────────────────
          if (data.row.section === 'head' && data.column.index === 1) {
            data.cell.styles.halign = 'right';
          }

          // Style total rows
          if (data.row.index >= dataRows.length) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];

            if (data.column.index === 1) {
              data.cell.styles.halign = 'right';
            }
          }
        },

        rowPageBreak: 'avoid',
      });
      doc.save("expense_report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      handleToast("error", "Failed to generate PDF – check console");
    }
  };

  const handleApplyFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      handleToast("error", "Start date cannot be greater than end date");
      return;
    }

    getAllData(searchTerm, startDate, endDate);
  };


  const getCategoriesList = () => {
    apiRequest({
      method: "get",
      url: `${url}/api/categories/list`,
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.success) {

          // handleToast("success", response.data.message);
          const categoryOptions = response.data?.data?.map(cat => ({
            value: cat.id,
            label: cat.name
          }));

          setCategoryList(categoryOptions);


        }
        else {
          handleToast("error", "Data not found");
        }
      })
      .catch((error) => {
        handleToast("error", "Something went wrong");
      });
  }

  const handleEdit = (id) => {
    setEditId(id);
    setIsEdit(true);
    setOpen(true);
    callReadOne(id);
  }
  const handleView = (id) => {
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
      url: `${url}/api/expenses/${deleteId}`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          handleToast("success", res.data.message);
          setFormVal({ name: '', description: '' })
          setDeleteDialogOpen(false);
          getAllData(searchTerm, startDate, endDate);
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

  const handleCategoryChange = (selectedOption) => {

    setSelectedCategory({
      value: selectedOption.value,
      label: selectedOption.label,

    });
  };


  const handleCreate = () => {
    if (!selectedCategory) {
      handleToast("error", "Please select a category");
      return;
    }
    if (!formVal.amount) {
      handleToast("error", "Please enter amount");
      return;
    }

    apiRequest({
      method: "post",
      url: `${url}/api/expenses`,
      data: { ...formVal, category_id: selectedCategory.value },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          handleToast("success", res.data.message);
          setFormVal({ name: '', description: '' })
          handleClose();
          getAllData(searchTerm, startDate, endDate);
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
    if (!selectedCategory) {
      handleToast("error", "Please select a category");
      return;
    }
    if (!formVal.amount) {
      handleToast("error", "Please enter amount");
      return;
    }

    apiRequest({
      method: "put",
      url: `${url}/api/expenses/${editId}`,   // include ID in URL for update
      data: { ...formVal, category_id: selectedCategory.value },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.success) {
          handleToast("success", res.data.message);
          setFormVal({ name: '', description: '' })
          handleClose();
          getAllData(searchTerm, startDate, endDate);
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


  // function getAllData(search = '') {
  //   apiRequest({
  //     method: "get",
  //     url: url + "/api/expenses",
  //     params: { search },
  //     withCredentials: true,
  //   })
  //     .then((res) => {
  //       setRows(res.data.data);
  //     })
  //     .catch((err) => {
  //       if (err.response && err.response.data && err.response.data.message) {
  //         handleToast("error", err.response.data.message);
  //       } else {
  //         handleToast("error", "Something went wrong");
  //       }
  //     });

  // }
  function getAllData(search = "", start = "", end = "") {
     setLoading(true);
    apiRequest({
      method: "get",
      url: url + "/api/expenses",
      params: {
        search,
        startDate: start,
        endDate: end,
      },
      withCredentials: true,
    })
      .then((res) => {
        //console.log("res.data.totals.grand_total",res.data.totals.grand_total)
        setRows(res.data.data);
        setFilteredTotal(res.data.totals.filtered_total);
        setGrandTotal(res.data.totals.grand_total);
         setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleToast("error", err.response?.data?.message || "Something went wrong");
      });
  }


  function callReadOne(id) {
    apiRequest({
      method: "get",
      url: url + `/api/expenses/${id}`,
      withCredentials: true,
    })
      .then((res) => {
        const data = res.data.data;
        // console.log('data', data)
        setSelectedCategory({
          value: data.category.id,
          label: data.category.name
        });

        setFormVal({
          amount: data.amount,
          description: data.description,
          expense_date: dayjs(data?.expense_date).format("YYYY-MM-DD")

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
    setSelectedCategory(null);
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
            >    <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{}} className='head-color'>Expense Management</h2>

          <div className='head-color'>Manage your expenses</div>
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
            style={{ width: "240px", marginRight: "15px" }}
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
            placeholder='Search Expenses...'
            onChange={(e) => setSearchTerm(e.target.value)}

          />



          <Button className='custom-button common-btn' variant="contained" style={{ height: "35px" }} onClick={handleOpen}>
            Add Expense
          </Button>
</div>
          <Dialog open={open} onClose={handleClose} 
          //PaperProps={{
            // sx: {
            //   minHeight: 250, // 👈 increase height
            //   width: 470,     // optional, for better balance
            // }
          //}}
            PaperProps={{
                            sx: {
                                overflowX: "hidden",
                                minHeight: 250,
                                width: {
                                    xs: "80%",   // mobile
                                    sm: 420,     // tablet
                                    md: 470,     // desktop
                                },
                                maxWidth: "95%",
                            },
                        }}
          >
            <DialogTitle style={{ textAlign: "center", padding: "14px 22px" }} className="prinamry-bgcolor">
              {isView ? "View Expense" : isEdit ? "Edit Expense" : "Add Expense"}

              <CloseIcon onClick={handleClose} sx={{ color: 'white', float: "right", cursor: "pointer" }} />
            </DialogTitle>

            <DialogContent style={{ fontSize: "1.2rem", textAlign: "center", marginTop: "5px", color: "black" }}>
              <div className="form-field">
                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "20px" }}>Category</label>
<Box
  sx={{
    width: {
      xs: "80%",
      sm: 360,
      md: 425,
    },
    mt: "5px",
  }}
>
                <Select
                
                  options={categoryList}
                  placeholder="Select Category"
                  value={selectedCategory}
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
                      width: 425,
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
                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "5px" }}>Amount</label>

                <TextField
                 sx={{
                                        width: {
                                            xs: "80%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
                 // style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
                  variant="outlined"
                  name="amount"
                  className="custom-textfield"
                  placeholder="Enter Amount"
                  // fullWidth
                  type="number"
                  value={formVal.amount}
                  margin="normal"
                  onChange={handleChange}
                  disabled={isView}
                />
              </div>
              <div className="form-field">
                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", marginTop: "5px" }}>
                  Expense Date
                </label>

                <TextField
                 sx={{
                                        width: {
                                            xs: "80%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
                  //style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
                  variant="outlined"
                  name="expense_date"
                  className="custom-textfield"
                  type="date"
                  value={formVal.expense_date}
                  onChange={handleChange}
                  disabled={isView}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>



              <div className="form-field" style={{}}>
                <label style={{ textAlign: "left", alignItems: "left", fontSize: "0.9rem", }}>Description</label>

                <TextField
                 sx={{
                                        width: {
                                            xs: "80%",   // mobile: take available width
                                            sm: 360,      // tablet
                                            md: 425,      // desktop
                                        },
                                    }}
                  id="outlined-multiline-flexible"
                  multiline
                  maxRows={2}
                  name="description"
                  //style={{ width: "425px", marginRight: "15px", marginTop: "5px" }}
                  // variant="outlined"
                  //className="custom-textfield"
                  className='custom-textarea'
                  value={formVal.description}
                  placeholder="Enter Expense Description"
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
   <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                        }}
                    >
      <TextField
        type="date"
        value={startDate}
        className='custom-textfield'
        onChange={(e) => setStartDate(e.target.value)}
        style={{ width: "150px", marginRight: "10px", height: "35px", marginTop: "15px" }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type="date"
        value={endDate}
        className='custom-textfield'
        onChange={(e) => setEndDate(e.target.value)}
        style={{ width: "150px", marginRight: "10px", height: "35px", marginTop: "15px" }}
        InputLabelProps={{ shrink: true }}
      />
</div>
   <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px",
                        }}
                    >
      <Button
        variant="contained"
        className="custom-button common-btn"
        style={{ height: "35px", marginTop: "15px", marginRight: "10px" }}
        onClick={handleApplyFilter}
      >
        Apply
      </Button>
      <Button
        variant="contained"
        className="custom-button common-btn"
        style={{ height: "35px", marginRight: "10px", marginTop: "15px" }}
        onClick={() => {
          setStartDate("");
          setEndDate("");
          getAllData(searchTerm);
        }}
      >
        Reset
      </Button>
      <Button
        variant="contained"
        className="custom-button common-btn"
        style={{ height: "35px", marginTop: "15px" }}
        onClick={downloadPDF}
      >
        Download PDF
      </Button>
</div>

      <div style={{ marginTop: "50px", marginRight: "2.8%" }}>
        <TableContainer sx={{ maxHeight: 440,overflowX: "auto" }}>
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
                      //minWidth: column.minWidth,
                      width: column.width,
                      backgroundColor: "#eeeeee",
                      paddingLeft: column.id == "category" ? "22px" : "description" ? "100px" : "0px",
                      //width:column.id=="amount"?"150":"auto",
                      maxWidth: column.id == "amount" ? "100" : "auto",
                      paddingRight: column.id == "amount" ? "150px" : "0px",


                    }}
                  >
                    {column.label}
                  </TableCell>


                ))}
                <TableCell
                  key="actions"
                  label="Actions"
                  align="right"
                  //minwidth={50}
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "550",
                    paddingRight: "22px",
                    //minWidth: 50,
                    width: "5%",
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
                        let value;

                        // console.log("row",row[column.id])

                        column.id != "category" ? (value = row[column.id]) : (value = row[column.id].name);

                        return (
                          <>
                            <TableCell key={column.id} align={column.align} style={{
                              paddingLeft: column.id == "category" ? "22px" : "description" ? "100px" : "0px",
                              paddingRight: column.id == "amount" ? "150px" : "0px"
                            }}>
                              {column.format
                                ? column.format(value)
                                : (value != null && value !== "" ? value : "-")
                              }

                            </  TableCell>

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
                    No Expenses yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter style={{ color: "#333333" }}>
              {filteredTotal && (
                <TableRow style={{ height: "23px" }}>
                  <TableCell style={{
                    backgroundColor: "#eeeeee", fontSize: "0.95rem",
                    fontWeight: "550", paddingLeft: "22px", width: "7%"
                  }}>Filtered Total<br />({dayjs(startDate).format("DD-MM-YYYY")} to {dayjs(endDate).format("DD-MM-YYYY")})</TableCell>
                  <TableCell style={{ backgroundColor: "#eeeeee", width: "7%", textAlign: "right", paddingRight: "150px",fontSize:"0.85rem" }}> ₹{parseFloat(filteredTotal).toFixed(2)}</TableCell>
                  <TableCell style={{ backgroundColor: "#eeeeee", width: "11%", }}></TableCell>
                  <TableCell style={{ backgroundColor: "#eeeeee", width: "16%" }}></TableCell>
                  <TableCell style={{ backgroundColor: "#eeeeee", width: "7%" }}></TableCell>
                </TableRow>
              )}

              <TableRow style={{ height: "23px" }}>
                <TableCell style={{
                  backgroundColor: "#eeeeee", fontSize: "0.95rem",
                  fontWeight: "550", paddingLeft: "22px", width: "7%"
                }}>Grand Total</TableCell>
                <TableCell style={{ backgroundColor: "#eeeeee", width: "7%", textAlign: "right", paddingRight: "150px",fontSize:"0.85rem"  }}> ₹{parseFloat(grandTotal).toFixed(2)}</TableCell>
                <TableCell style={{ backgroundColor: "#eeeeee", width: "11%", }}></TableCell>
                <TableCell style={{ backgroundColor: "#eeeeee", width: "16%" }}></TableCell>
                <TableCell style={{ backgroundColor: "#eeeeee", width: "7%" }}></TableCell>
              </TableRow>
            </TableFooter>
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

export default Expenses