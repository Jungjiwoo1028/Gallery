import React from "react";

const CustomInput = ({ label, setValue, value, type }) => {
  return (
    <div>
      <label style={{ fontSize: "14px" }}>{label}</label>
      <input
        style={{
          width: "100%",
          marginBottom: "10px",
          borderRadius: "15px",
          height: "20px",
        }}
        value={value}
        type={type}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
