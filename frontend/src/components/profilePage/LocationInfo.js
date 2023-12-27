import React from "react";

const LocationInfo = ({ formData, handleChange }) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingTwo">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          Location Infos
        </button>
      </h2>
      <div
        id="collapseTwo"
        className="accordion-collapse collapse"
        aria-labelledby="headingTwo"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div className="formLocationInfo-container">
            <form>
              <div className="mb-3">
                <label htmlFor="InputLastname" className="form-label">
                  Country
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputFirstname" className="form-label">
                  City
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputDepartment" className="form-label">
                  Office
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputTeam" className="form-label">
                  Address
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputTeam" className="form-label">
                  Floor
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                />
              </div>
              {/*<div className="mb-3">*/}
              {/*  <button*/}
              {/*    type="button"*/}
              {/*    className="btn btn-secondary"*/}
              {/*    onClick={handleChangePasswordClick}*/}
              {/*  >*/}
              {/*    Change Password*/}
              {/*  </button>*/}
              {/*</div>*/}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
