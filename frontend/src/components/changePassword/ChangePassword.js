import React, { useState } from "react";
import axios from "axios";
import { PasswordValidator } from "../../services/PasswordValidator";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.scss";
import { Button, Modal } from "react-bootstrap";

const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!PasswordValidator(passwordData.newPassword)) {
      setMessage("Your new password does not meet the requirements.");
      setMessageType("error");
      setShowModal(true);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmationPassword) {
      setMessage("The new password and confirmation password do not match.");
      setMessageType("error");
      setShowModal(true);
      return;
    }

    try {
      await axios.patch("/api/users/changePassword", passwordData);
      setMessage("Password successfully changed.");
      setMessageType("success");
      setShowModal(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
      setMessageType("error");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (messageType === "success") {
      navigate("/profilePage");
    }
  };
  return (
    <>
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
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {messageType === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={messageType === "success" ? "text-success" : "text-danger"}
        >
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangePasswordForm;
