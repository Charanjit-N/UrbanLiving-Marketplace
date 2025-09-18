import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Pagination, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ApartmentItem from "../components/ApartmentItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [apartmentSaleListings, setApartmentSaleListings] = useState([]);
  const [apartmentRentListings, setApartmentRentListings] = useState([]);
  const [pgRentListings, setPgRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const HomePageswiperImages = [
    '/HomeSwiperImages/img1.jpg',
    '/HomeSwiperImages/img2.png',
    '/HomeSwiperImages/img3.png',
    '/HomeSwiperImages/img4.jpg',
    '/HomeSwiperImages/img5.jpg',
    '/HomeSwiperImages/img6.jpg',
    '/HomeSwiperImages/img7.jpg',
  ];

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/flat-pg/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchApartmentSaleListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchApartmentSaleListings = async () => {
      try {
        const res = await fetch(
          "/api/flat-pg/get?category=apartment&type=sale&limit=4"
        );
        const data = await res.json();
        setApartmentSaleListings(data);
        fetchApartmentRentListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchApartmentRentListings = async () => {
      try {
        const res = await fetch(
          "/api/flat-pg/get?category=apartment&type=rent&limit=4"
        );
        const data = await res.json();
        setApartmentRentListings(data);
        fetchPgRentListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPgRentListings = async () => {
      try {
        const res = await fetch(
          "/api/flat-pg/get?category=pg&type=rent&limit=4"
        );
        const data = await res.json();
        setPgRentListings(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-25 px-3 max-w-6xl mx-auto">
        <h1 className="text-black font-bold text-4xl md:text-6xl">
          Welcome to <span className="text-gray-400">Urban Living</span>
          <br />
          <span className="text-xl md:text-3xl">
            Find your place.... Live your way....
          </span>
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          Your trusted destination for modern homes and comfortable living.
          Discover premium apartments for sale or rent, and convenient PG
          accommodations for hassle-free living. Whether you’re searching for
          your dream home, an investment opportunity, or a cozy space to stay,
          UrbanLiving connects you to the right choice with ease.
        </div>

        <Link
          to={"/search"}
          className="bg-blue-700 px-8 py-2 text-lg text-white font-bold w-fit rounded-3xl"
        >
          Explore....
        </Link>
      </div>

      {/* Home Page main swiper */}
      <div className="w-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            el: ".swiper-pagination-container",
            clickable: true,
          }}
          // Enables automatic sliding
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          // Enables infinite looping
          loop={true}
        >
          {HomePageswiperImages.map((imageUrl,index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[280px] md:h-[550px] w-full bg-center bg-cover"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-container flex justify-center mt-4"></div>
      </div>

      {/* Different listings */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Recent offers */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ApartmentItem
                  listing={listing}
                  key={listing._id}
                ></ApartmentItem>
              ))}
            </div>
          </div>
        )}

        {apartmentSaleListings && apartmentSaleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Appartments for sale{" "}
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {apartmentSaleListings.map((listing) => (
                <ApartmentItem
                  listing={listing}
                  key={listing._id}
                ></ApartmentItem>
              ))}
            </div>
          </div>
        )}

        {apartmentRentListings && apartmentRentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Appartments for rent{" "}
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {apartmentRentListings.map((listing) => (
                <ApartmentItem
                  listing={listing}
                  key={listing._id}
                ></ApartmentItem>
              ))}
            </div>
          </div>
        )}

        {pgRentListings && pgRentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent PG for rent
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {pgRentListings.map((listing) => (
                <ApartmentItem
                  listing={listing}
                  key={listing._id}
                ></ApartmentItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
