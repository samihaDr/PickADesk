import React, { useState } from "react";
import axios from "axios";
import { PasswordValidator } from "../../services/PasswordValidator";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.scss";

const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (PasswordValidator(passwordData.newPassword)) {
      try {
        await axios.patch("/api/users/changePassword", passwordData);
        setMessage("Password successfully changed.");
        navigate("/profilePage");
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred.");
      }
    }
  };
  return (
    <div className="main">
      <h2>Change Password</h2>
      <div className="changePassword-container">
        <div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmationPassword"
                  className="form-control"
                  value={passwordData.confirmationPassword}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
