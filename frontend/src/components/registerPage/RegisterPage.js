import { Link } from "react-router-dom";
import React from "react";
import "./RegisterPage.scss";

export default function RegisterPage() {
  return (
    <div>
      <card className="card">
        <h2 style={{ color: "#1f4e5f" }}>Register</h2>
        <div className="register-container">
          <div>
            <div className="form-container">
              <form>
                <div className="mb-3">
                  <label htmlFor="InputEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="InputEmail"
                  />

                  <div className="mb-3">
                    <label htmlFor="InputLastname" className="form-label">
                      LastName
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="InputLastname"
                      aria-describedby="lastnameHelp"
                    />
                    <div id="lastnameHelp" className="form-text">
                      Enter a valid lastname.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="InputFirstname" className="form-label">
                      FirstName
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="InputFirstname"
                      aria-describedby="firstnameHelp"
                    />
                    <div id="firstnameHelp" className="form-text">
                      Enter a valid firstname.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="Password"
                      aria-describedby="passwordHelp"
                    />
                    <div id="passwordHelp" className="form-text">
                      enter a password containing at least 6 letters, a number
                      and a special character.
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="ConfirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="ConfirmPassword"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </form>
            </div>
            <div>
              <span>Already have an account? </span>
              <Link to="/loginPage">Log in</Link>
            </div>
          </div>
        </div>
      </card>
    </div>
  );
}
