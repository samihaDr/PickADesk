import { useNavigate } from "react-router-dom";

const PersonalInfo = ({ formData, handleChange }) => {
  const handleChangePasswordClick = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    navigate("/changePassword"); // Redirige vers la page de changement de mot de passe
  };
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          Personal Infos
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div className="form-container">
            <form>
              <div className="mb-3">
                <label htmlFor="InputLastname" className="form-label">
                  LastName
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
                  FirstName
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
                  Department
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
                  Team
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleChangePasswordClick}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
