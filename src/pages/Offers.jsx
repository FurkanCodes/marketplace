import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import CircleLoader from "react-spinners/CircleLoader";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const listings = [];

        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("error");
      }
    };

    fetchListings();
  }, []);

  const onDelete = () => {};

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <CircleLoader />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                  onDelete={() => onDelete()}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for offers</p>
      )}
    </div>
  );
}

export default Category;
