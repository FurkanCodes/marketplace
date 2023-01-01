import React, { useState } from "react";
import { Link } from "react-router-dom";
import consoleImage from "../assets/jpg/GamePad.jpg";
import phoneImage from "../assets/jpg/Phone.jpeg";
import whiteWare from "../assets/jpg/Whiteware.png";
import PhotoCam from "../assets/jpg/PhotoCam.jpg";
import Vacuum from "../assets/jpg/Vacuum.jpeg";
import Printer from "../assets/jpg/Printer.jpeg";
import FemaleDress from "../assets/jpg/FemaleDress.jpeg";
import MaleDress from "../assets/jpg/MaleDress.jpg";
import Slider from "../components/Slider";

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/consoles">
            <img
              src={consoleImage}
              alt="Console"
              className="exploreCategoryImg"
            />
            <p>Consoles</p>
          </Link>
          <Link to="/category/phones">
            <img
              src={phoneImage}
              alt="Console"
              className="exploreCategoryImg"
            />
            <p>Phones</p>
          </Link>
          <Link to="/category/whiteware">
            <img
              src={whiteWare}
              alt="whiteWare"
              className="exploreCategoryImg"
            />
            <p>Whiteware</p>
          </Link>
          <Link to="/category/photocam">
            <img src={PhotoCam} alt="PhotoCam" className="exploreCategoryImg" />
            <p>Photo Cameras</p>
          </Link>
          <Link to="/category/vacuum">
            <img src={Vacuum} alt="Vacuum" className="exploreCategoryImg" />
            <p>Vacuum</p>
          </Link>
          <Link to="/category/printer">
            <img src={Printer} alt="Printer" className="exploreCategoryImg" />
            <p>Printer</p>
          </Link>
          <Link to="/category/femaledress">
            <img
              src={FemaleDress}
              alt="FemaleDress"
              className="exploreCategoryImg"
            />
            <p>FemaleDress</p>
          </Link>
          <Link to="/category/maledress">
            <img
              src={MaleDress}
              alt="MaleDress"
              className="exploreCategoryImg"
            />
            <p>MaleDress</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
