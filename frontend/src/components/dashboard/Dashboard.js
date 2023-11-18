import React, { useState } from "react";

export default function Dashboard() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const dateFormatted = new Intl.DateTimeFormat("en-US", options).format(today);
  //const [status, setStatus] = useState("");

  return (
    <card className="card">
      <h2 style={{ color: "#1f4e5f" }}>My status</h2>
      <div className="dashbord-container">
        <div className="date">
          <p>{dateFormatted}</p>
        </div>
        <div className="content">
          <p>You are working remotely today.</p>
          <p>You still have 4 telework slots </p>
        </div>
        <button type="submit" className="btn btn-primary">
          Change your status
        </button>
      </div>
    </card>
  );
}
