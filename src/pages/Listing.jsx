import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { CircleLoader } from "react-spinners";
import shareIcon from "../assets/svg/shareIcon.svg";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { list } from "firebase/storage";
import ListingItem from "../components/ListingItem";
function Listing() {
  const [listing, setListing] = useState({});
  const [geoLocation, setGeoLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        // console.log(docSnap.data().geolocation);
        setGeoLocation(docSnap.data().geolocation);
        setListing(docSnap.data());
        setLoading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    <CircleLoader />;
  }
  return (
    <main>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareCopied(true);
          setTimeout(() => {
            setShareCopied(false);
          }, 3000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.condition === "used" ? "used" : "new"}
        </p>

        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          {!loading && (
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[geoLocation.lat, geoLocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[geoLocation.lat, geoLocation.lng]}>
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}=listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Seller
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
