import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function ContactOwner() {
  const [message, setMessage] = useState();
  const [owner, setOwner] = useState({});
  const [searchParams, setsearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", params.ownerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOwner(docSnap.data());
      } else {
        toast.error("Could not get owner data");
      }
    };

    getOwner();
  }, [params.ownerId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Owner</p>
      </header>
      <main>
        <div className="contactLandlord">
          <p className="landlordName">{owner.name}</p>
        </div>
        <form className="messageForm">
          <div className="messageDiv">
            <label className="messageLabel" htmlFor="message">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="textarea"
              value={message}
              onChange={onChange}
            ></textarea>
          </div>
          <a
            href={`mailto:${owner.email}?Subject=${searchParams.get(
              "listingName"
            )}&body=${message}`}
          >
            <button className="primaryButton" type="button">
              Send Message
            </button>
          </a>
        </form>
      </main>
    </div>
  );
}

export default ContactOwner;
