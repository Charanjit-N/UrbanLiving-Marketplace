import React, { useState, useEffect, useRef } from "react";
import { IoPeople } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

export default function NewListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageInfo: [],
    name: "",
    description: "",
    address: "",
    contact: "",
    apartmentNumber: "",
    category: "apartment",
    type: "sale",
    bhk: 0,
    sharing: 0,
    regularPrice: 50,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });

  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const imageInfoRef = useRef(formData.imageInfo);

  const handleOnChange = (e) => {
    const { id, value, checked } = e.target;
    const newFormData = { ...formData }; // Create a mutable copy

    if (id === "apartment" || id === "pg") {
      newFormData.category = id;
      if (id === "apartment") {
        newFormData.sharing = 0; 
      } else if (id === "pg") {
        newFormData.bhk = 0;     
        newFormData.type = "rent"; // A PG can only be for rent
      }
    } else if (id === "rent" || id === "sale") {
      newFormData.type = id;
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ){
      newFormData[id] = checked;
      if (id === "offer" && !checked) {
        newFormData.discountPrice = 0;
      }
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      newFormData[id] = value;
    }

    setFormData(newFormData);
  };

  const handleImageUpload = async (e) => {
    if (!files || files.length === 0) {
      setImageUploadError("Please select at least one file to upload.");
      return;
    }

    if (files.length > 0 && files.length + formData.imageInfo.length < 6) {
      setUploading(true);
      setImageUploadError(false);

      const uploadImagePromises = Array.from(files).map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        try {
          const res = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
            method: "POST",
            body: data,
          });

          if (!res.ok) {
            const errorResult = await res.json();
            throw new Error(
              errorResult.error.message || "An image failed to upload."
            );
          }

          const result = await res.json();
          console.log(result.secure_url);
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        } catch (error) {
          console.error("Upload error:", error.message);
          throw error;
        }
      });

      try {
        const uploadedImageInfo = await Promise.all(uploadImagePromises);

        setFormData({
          ...formData,
          imageInfo: formData.imageInfo.concat(uploadedImageInfo),
        });
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError(error.message);
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload max of 5 images");
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index, public_id) => {
    setDeletingImageId(public_id);
    try {
      const res = await fetch("/api/deleteImageFromCloudinary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_ids: [public_id] }),
      });

      const data = await res.json();

      if (data.success === false) {
        console.error("Failed to delete image from server:", data.message);
        return;
      }

      setFormData({
        ...formData,
        imageInfo: formData.imageInfo.filter((_, i) => i !== index),
      });
    } catch (error) {
      console.error("Error calling delete API:", error);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageInfo.length < 1) {
        return setError("upload atleast one image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("discout price should be less than regular price");
      }

      setLoading(true);
      setError(false);
      const res = await fetch("/api/flat-pg/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          listedBy: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      isSubmittingRef.current = true;
      navigate(`/apartment-pg/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    imageInfoRef.current = formData.imageInfo;
  }, [formData.imageInfo]);

  // Handling clean up when user navigates to other page without submitting form
  useEffect(() => {
    return () => {
      const imagesToClean = imageInfoRef.current;
      if (isSubmittingRef.current || imagesToClean.length === 0) {
        return;
      }
      console.log(
        "Component unmounting, cleaning up orphaned images...",
        imagesToClean
      );
      const cleanup = async () => {
        const publicIdsToClean = imagesToClean.map((img) => img.public_id);

        if (publicIdsToClean.length === 0) {
          return;
        }

        try {
          await fetch("/api/deleteImageFromCloudinary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_ids: publicIdsToClean }),
          });
        } catch (error) {
          console.error("Cleanup failed during navigation:", error);
        }
      };

      cleanup();
    };
  }, []);

  // Handling clean up when user reloads the page or cose the tab without submitting
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (imageInfoRef.current.length > 0 && !isSubmittingRef.current) {
        const publicIdsToClean = imageInfoRef.current.map(
          (img) => img.public_id
        );
        const url = "/api/deleteImageFromCloudinary";

        // THIS IS THE IMPROVEMENT: Use a Blob to ensure correct Content-Type
        const data = new Blob(
          [JSON.stringify({ public_ids: publicIdsToClean })],
          {
            type: "application/json",
          }
        );

        navigator.sendBeacon(url, data);

        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        List Your Apartment / PG
      </h1>

      <form
        className="flex flex-col sm:flex-row gap-10"
        onSubmit={handleOnSubmit}
      >
        <div className="flex flex-col gap-4 flex-1 pb-20">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="60"
            minLength="4"
            required
            onChange={handleOnChange}
            value={formData.name}
          ></input>

          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg h-50"
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

          <input
            type="text"
            placeholder="Owner contact"
            className="border p-3 rounded-lg"
            id="contact"
            minLength={8}
            maxLength={8}
            required
            onChange={handleOnChange}
            value={formData.contact}
          ></input>

          <div className="flex gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="apartment"
                className="w-5 h-5"
                onChange={handleOnChange}
                checked={formData.category === "apartment"}
              ></input>
              <span>Apartment</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pg"
                className="w-5 h-5"
                onChange={handleOnChange}
                checked={formData.category === "pg"}
              ></input>
              <span>PG</span>
            </div>

            {formData.category === "apartment" ? (
              <input
                type="text"
                placeholder="Block/Flat Number"
                className="border p-2 rounded-lg"
                id="apartmentNumber"
                required
                onChange={handleOnChange}
                value={formData.apartmentNumber}
              ></input>
            ) : (
              <input
                type="text"
                placeholder="Floor/Room Number"
                className="border p-2 rounded-lg"
                id="apartmentNumber"
                required
                onChange={handleOnChange}
                value={formData.apartmentNumber}
              ></input>
            )}
          </div>

          <div className="flex gap-6 flex-wrap">
            {formData.category === "apartment" && (
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleOnChange}
                  checked={formData.type === "sale"}
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
            {formData.category === "apartment" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bhk"
                  min="1"
                  max="10"
                  required
                  className="border p-2 rounded-lg"
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
                  className="border p-2 rounded-lg"
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
                max="1000000000"
                required
                className="border p-2 rounded-lg"
                onChange={handleOnChange}
                value={formData.regularPrice}
              ></input>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type === "rent" ? (
                  <span className="text-xs">(₹ / month)</span>
                ) : (
                  <span className="text-xs">in INR ( ₹ )</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000000"
                  required
                  className="border p-2 rounded-lg"
                  onChange={handleOnChange}
                  value={formData.discountPrice}
                ></input>
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  {formData.type === "rent" ? (
                    <span className="text-xs">(₹ / month)</span>
                  ) : (
                    <span className="text-xs"> in INR ( ₹ )</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 ">
          <div>
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                First image will be the cover image (max 5)
              </span>
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="p-2 border rounded border-gray-500 flex-grow flex items-center gap-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="hidden"
              />

              <label
                htmlFor="images"
                className="border p-1 bg-gray-100 cursor-pointer hover:bg-gray-200"
              >
                Choose Files
              </label>

              <span className="text-sm text-gray-500">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "No file chosen"}
              </span>
            </div>

            <button
              disabled={uploading}
              type="button"
              onClick={handleImageUpload}
              className="p-3 cursor-pointer text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageInfo.length > 0 &&
            formData.imageInfo.map((image, index) => (
              <div
                key={image.public_id}
                className="flex justify-between p-2 border items-center"
              >
                <img
                  src={image.url}
                  alt="listing image"
                  className="w-20 h-10 object-contain rounded-lg"
                ></img>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, image.public_id)}
                  disabled={deletingImageId !== null}
                  className="p-1 text-red-600 rounded-lg cursor-pointer hover:opacity-75 text-2xl"
                >
                  {deletingImageId === image.public_id ? (
                    <span className="text-xs font-semibold">deleting...</span>
                  ) : (
                    <MdDelete />
                  )}
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-yellow-300 font-semibold rounded-lg  disabled:opacity-80 cursor-pointer"
          >
            {loading ? "Adding....." : "Add Apartment / PG"}
          </button>
          {error && (
            <p className="text-red-700 text-sm flex justify-center">{error}</p>
          )}
        </div>
      </form>
    </main>
  );
}
