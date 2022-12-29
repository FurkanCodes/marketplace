import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import CircleLoader from "react-spinners/CircleLoader";
import { toast } from "react-toastify";
import { async } from "@firebase/util";

function CreateListing() {
  const [geoLoc, setGeoEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataForm, setDataForm] = useState({
    type: "",
    name: "",
    condition: "",
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    condition,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = dataForm;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setDataForm({
            ...dataForm,
            userRef: user.uid,
          });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (regularPrice >= discountedPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {}; //store lat and lng
    let location;
    if (geoLoc) {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search?key=${
          import.meta.env.VITE_GEOLOC_API_KEY
        }&q=${address}&format=json`
      );
      const geoData = await response.json();
      geolocation.lat = geoData[0].lat ?? 0;
      geolocation.lng = geoData[0].lon ?? 0;
      location = geoData[0].display_name;
      // console.log(geolocation.lat, geolocation.lng);
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    // store image
    const storeImg = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImg(image))
    ).catch(() => {
      setLoading(false);
      toast.error("image not uploaded");
      return;
    });
    const dataFormCopy = {
      ...dataForm,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete dataFormCopy.images;
    delete dataFormCopy.address;
    location && (dataFormCopy.location = location);
    !dataFormCopy.offer && delete dataFormCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), dataFormCopy);
    setLoading(false);
    toast.success("listing saved");
    navigate(`/category/${dataFormCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    if (e.target.files) {
      setDataForm((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setDataForm((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <CircleLoader />;
  }
  return (
    <div className="profile">
      <header>
        <p className="pageHeader"> Create a Sell Ad </p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">
            What sort of product are you selling?
          </label>

          <div className="formButtons">
            <button
              type="button"
              className={
                type === "consoles" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="consoles"
              onClick={onMutate}
            >
              Consoles
            </button>
            <button
              type="button"
              className={
                type === "whiteware" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="whiteware"
              onClick={onMutate}
            >
              Whiteware
            </button>
            <button
              type="button"
              className={type === "phones" ? "formButtonActive" : "formButton"}
              id="type"
              value="phones"
              onClick={onMutate}
            >
              Phones
            </button>
            <button
              type="button"
              className={
                type === "photocam" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="photocam"
              onClick={onMutate}
            >
              Photo Camera
            </button>
            <button
              type="button"
              className={type === "vacuum" ? "formButtonActive" : "formButton"}
              id="type"
              value="vacuum"
              onClick={onMutate}
            >
              Vacuum
            </button>
            <button
              type="button"
              className={type === "printer" ? "formButtonActive" : "formButton"}
              id="type"
              value="printer"
              onClick={onMutate}
            >
              Printer
            </button>
            <button
              type="button"
              className={
                type === "femaledress" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="femaledress"
              onClick={onMutate}
            >
              Female Dress
            </button>
            <button
              type="button"
              className={
                type === "maledress" ? "formButtonActive" : "formButton"
              }
              id="type"
              value="maledress"
              onClick={onMutate}
            >
              Male Dress
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="3"
            required
          />
          <label className="formLabel">Condition</label>
          <div className="formButtons">
            <button
              className={
                condition === "new" ? "formButtonActive" : "formButton"
              }
              type="button"
              id="condition"
              value={"new"}
              onClick={onMutate}
              min="1"
              max="50"
            >
              New
            </button>
            <button
              className={
                condition === "used" ? "formButtonActive" : "formButton"
              }
              type="button"
              id="condition"
              value={"used"}
              onClick={onMutate}
            >
              Used
            </button>
          </div>
          <label className="formLabel">Address</label>
          <p>FORMAT: Street, Neighbourhood, City</p>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {!geoLoc && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
