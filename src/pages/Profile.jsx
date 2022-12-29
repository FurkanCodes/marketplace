import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import { async } from "@firebase/util";
import ListingItem from "../components/ListingItem";

function Profile() {
  const authentication = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState({});
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: authentication.currentUser.displayName,
    email: authentication.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", authentication.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [authentication.currentUser.uid]);
  const onLogout = () => {
    authentication.signOut();
    navigate("/");
  };

  const onDelete = async (listingId) => {
    if (window.confirm("do you wana to delete=")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updListings);
      toast.success("succesfully deleted");
    }
  };

  const onSubmit = async () => {
    try {
      if (authentication.currentUser.displayName != name) {
        // update display name
        await updateProfile(authentication.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", authentication.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button onClick={onLogout} type="button" className="logOut">
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="Home" />
          <p>Sell your items</p>
          <img src={arrowRight} alt="" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Items</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
