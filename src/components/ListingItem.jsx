import React from "react";

import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";

function ListingItem({ listing, id, onDelete }) {
  return (
    <ul className="catergoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / Month"}
          </p>
          <p> Condition: </p>
          <p>
            {listing.condition === "used" ? <h2>used</h2> : <h2>brand new</h2>}
          </p>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(listing.id, listing.name)}
          className="removeIcon"
          fill="rgb(231, 76,60)"
        />
      )}
    </ul>
  );
}

export default ListingItem;
