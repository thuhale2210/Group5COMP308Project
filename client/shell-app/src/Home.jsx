import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center">
      <h1>Welcome to the Community Hub</h1>
      <p>Connect with the community through discussions and help requests.</p>
      <Link to="/login" className="btn btn-primary">Get Started</Link>
    </div>
  );
}

export default Home;
