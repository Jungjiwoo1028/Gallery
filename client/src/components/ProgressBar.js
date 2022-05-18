import React, { useState } from "react";
import axios from "axios";
import "./ProgressBar.css";
import { toast } from "react-toastify";

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent}%` }}>{percent}%</div>
    </div>
  );
};

export default ProgressBar;
