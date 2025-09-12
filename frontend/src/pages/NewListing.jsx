import React, { useState } from "react";
import { IoPeople } from "react-icons/io5";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

export default function NewListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    category: "appartment",
    type: "sell",
    bhk: 0,
    sharing: 0,
    regularPrice: 50,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });

  const [uploading , setUploading] = useState(false);




  const handleOnChange = (e) => {
    const { id, value, checked } = e.target;
    const newFormData = { ...formData }; // Create a mutable copy

    if (id === "appartment" || id === "pg") {
      newFormData.category = id;
      if (id === "pg") {
        newFormData.type = "rent";
      }
    } else if (id === "rent" || id === "sell") {
      newFormData.type = id;
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      newFormData[id] = checked;
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      newFormData[id] = value;
    }

    setFormData(newFormData);
  };

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        List Your Appartement / PG
      </h1>

      <form className="flex flex-col sm:flex-row gap-20">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleOnChange}
            value={formData.name}
          ></input>

          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg h-60"
            id="description"
            required
            onChange={handleOnChange}
            value={formData.description}
          ></textarea>

          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleOnChange}
            value={formData.address}
          ></input>

          <div className="flex gap-8 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="appartment"
                className="w-5"
                onChange={handleOnChange}
                checked={formData.category === "appartment"}
              ></input>
              <span>Appartment</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pg"
                className="w-5"
                onChange={handleOnChange}
                checked={formData.category === "pg"}
              ></input>
              <span>PG</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            {formData.category === "appartment" && (
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-5"
                  onChange={handleOnChange}
                  checked={formData.type === "sell"}
                ></input>
                <span>Sell</span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleOnChange}
                checked={formData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {formData.category === "appartment" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bhk"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleOnChange}
                  value={formData.bhk}
                ></input>
                <p>BHK</p>
              </div>
            )}

            {formData.category === "pg" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="sharing"
                  min="1"
                  max="5"
                  required
                  className="p-2 border border-gray-300 rounded-lg"
                  onChange={handleOnChange}
                  value={formData.sharing}
                ></input>
                <p>
                  {" "}
                  <IoPeople /> sharing
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 h-5"
                onChange={handleOnChange}
                checked={formData.parking}
              ></input>
              <span>Parking Space</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 h-5"
                onChange={handleOnChange}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                onChange={handleOnChange}
                checked={formData.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-2 border border-gray-300 rounded-lg"
                onChange={handleOnChange}
                value={formData.regularPrice}
              ></input>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">(₹ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-2 border border-gray-300 rounded-lg"
                  onChange={handleOnChange}
                  value={formData.discountPrice}
                ></input>
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(₹ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            ></input>
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uplaoding..." : "Upload"}
            </button>
          </div>
          {/* <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p> */}

          <div
            // key={url}
            className="flex justify-between p-3 border items-center"
          >
            <img
              // src={url}
              alt="listing image"
              className="w-20 h-20 object-contain rounded-lg"
            ></img>
            <button
              type="button"
              className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
            >
              Delete
            </button>
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create listing
          </button>
          {/* {error && <p className="text-red-700 text-sm">{error}</p>} */}
        </div>
      </form>
    </main>
  );
}
