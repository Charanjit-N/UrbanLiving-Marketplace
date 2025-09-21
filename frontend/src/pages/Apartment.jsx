import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import "swiper/css";
import "swiper/css/pagination";
import { IoPeople, IoLocationSharp, IoCall } from "react-icons/io5";
import { FaHome, FaParking } from "react-icons/fa";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdChair } from "react-icons/md";

export default function Apartment() {
  SwiperCore.use([Navigation]);
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/flat-pg/get/${params.apartmentId}`);
        const data = await res.json();
        console.log("API Response Data:", data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchApartmentDetails();
  }, [params.apartmentId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading.....</p>}
      {error && (
        <p className="text-center my-7 text-2xl">something went wrong !!</p>
      )}
      {listing && !loading && !error && (
        <>
          <div className="w-full">
            <Swiper
              // Add the modules you want to use
              modules={[Pagination, Autoplay]}
              // Enables the circle indicators
              pagination={{
                el: ".swiper-pagination-container",
                clickable: true,
              }}
              // Enables automatic sliding
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              // Enables infinite looping
              loop={true}
            >
              {listing.imageInfo.map(({ url, public_id }) => (
                <SwiperSlide key={public_id}>
                  <div
                    className="h-[280px] md:h-[550px] w-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${url})` }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-pagination-container flex justify-center mt-4"></div>
          </div>

          <div className="flex flex-col max-w-6xl mx-auto p-3 mt-2 mb-7 gap-3">
            <div className="text-4xl font-bold flex flex-col md:flex-row items-baseline gap-3 md:gap-18">
              {listing.name}
              <span className="text-gray-600 text-lg font-normal flex items-center gap-1">
                contact owner : <IoCall /> {listing.contact}
              </span>
            </div>

            <p className =" text-gray-600 text-lg font-semibold">
              {listing.category === "apartment" ? (
                <span className=" text-black">
                  Apartment Number :{" "}
                </span>
              ) : (
                <span className="text-black">Room Number : </span>
              )}
              {listing.apartmentNumber}
            </p>

            <p className="flex items-center gap-2 text-gray-600 mb-2 text-md">
              <IoLocationSharp className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-blue-900 w-full max-w-[180px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer ? (
                <>
                  <p className="bg-red-700 line-through w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    ₹ {listing.regularPrice.toLocaleString("en-IN")}
                    {listing.type === "rent" && "/month"}
                  </p>

                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    ₹ {listing.discountPrice.toLocaleString("en-IN")}
                    {listing.type === "rent" && "/month"}
                  </p>
                </>
              ) : (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹ {listing.regularPrice.toLocaleString("en-IN")}
                  {listing.type === "rent" && "/month"}
                </p>
              )}
            </div>
            <p className="text-gray-600 text-md">
              <span className="font-semibold text-lg text-black">Description : </span>
              {listing.description}
            </p>

            <ul className="font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              {listing.category === "apartment" && (
                <li className="text-green-900 flex items-center gap-1 whitespace-nowrap ">
                  <FaHome className="text-lg" /> {listing.bhk} BHK
                </li>
              )}

              {listing.category === "pg" && (
                <li className=" text-green-900 flex items-center gap-1 whitespace-nowrap ">
                  <IoPeople className="text-xl" /> {listing.sharing} Sharing
                </li>
              )}

              {listing.parking ? (
                <li className="text-green-900 flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-xl" /> Parking Space
                </li>
              ) : (
                <li className="text-red-900 flex items-center gap-1 whitespace-nowrap ">
                  <CiNoWaitingSign className="text-xl stroke-[2] " /> No Parking Space
                </li>
              )}

              {listing.furnished ? (
                <li className="text-green-900 flex items-center gap-1 whitespace-nowrap ">
                  <MdChair className="text-xl" /> Furnished
                </li>
              ) : (
                <li className="text-red-900 flex items-center gap-1 whitespace-nowrap ">
                  <CiNoWaitingSign className="text-xl stroke-[2]" /> No Furniture
                </li>
              )}
            </ul>
          </div>

          <div className="max-w-3xl mx-auto mb-10 hidden md:block">
            <Swiper navigation>
              {listing.imageInfo.map(({ url, public_id }) => (
                <SwiperSlide key={public_id}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${url}) center no-repeat`, // Now 'url' is the correct string
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </main>
  );
}
