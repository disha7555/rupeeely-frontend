import React from "react";

const ToastMessages = ({ type, msg, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: type === "success" ? "#129816" : "#dd2626",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: "8px",
        minWidth: "300px",
        maxWidth: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.95rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999
      }}
    >
      <span style={{ marginRight: "12px", lineHeight: "1.4" }}>
        {msg}
      </span>

      <span
        onClick={onClose}
        style={{
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginLeft: "10px"
        }}
      >
        ✕
      </span>
    </div>
  );
};

export default ToastMessages;
