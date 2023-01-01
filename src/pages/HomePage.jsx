import React from "react";
import Explore from "./Explore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      {visible ? (
        <Explore />
      ) : (
        <div>
          <div className="container">
            <h2 className="welcome"> MRKTPLC </h2>

            <p>
              A place where you can sell or buy second hand and brand new items
            </p>
            <button onClick={() => navigate("/explore")}>
              Click Here to Sell
            </button>
            <img
              className="homepageAnim"
              src={`https://cdn.dribbble.com/users/1514097/screenshots/3475801/marketplace.gif`}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
