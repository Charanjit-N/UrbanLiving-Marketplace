import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ApartmentItem from '../components/ApartmentItem';

export default function Search() {
    const [sideformdata,setSideformdata] = useState({
        searchTerm : "",
        category : 'all-category',
        type : 'all-type',
        parking : false,
        furnished : false,
        offer: false,
        sort : 'created_at',
        order: 'desc'
    })

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore , setShowMore] = useState(false);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const categoryFromUrl = urlParams.get('category');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            categoryFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSideformdata({
                searchTerm : searchTermFromUrl || "",
                category : categoryFromUrl || 'all-category',
                type : typeFromUrl || 'all-type',
                parking : parkingFromUrl==='true' ? true : false,
                furnished : furnishedFromUrl==='true' ? true : false,
                offer: offerFromUrl==='true' ? true : false,
                sort : sortFromUrl || 'created_at',
                order : orderFromUrl || 'desc'
            })
        }


        const fetchListings = async ()=>{
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/flat-pg/get?${searchQuery}`)
            const data = await res.json();
            console.log('Fetched listings:', data);
            if(data.length>8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }

        fetchListings();
    },[location.search])



    const navigate = useNavigate();

    const handleChange = (e)=>{

        if(e.target.id === 'all-category' || e.target.id==='apartment' || e.target.id==='pg'){
            setSideformdata({...sideformdata,
            category : e.target.id})
        }

        if(e.target.id === 'all-type' || e.target.id==='rent' || e.target.id==='sale'){
            setSideformdata({...sideformdata,
            type : e.target.id})
        }

        if(e.target.id === 'searchTerm'){
            setSideformdata({...sideformdata, searchTerm: e.target.value})
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSideformdata({...sideformdata, [e.target.id]: e.target.checked || e.target.checked==='true' ? true : false})
        }


        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideformdata({...sideformdata, sort, order});

        }
    }

    // console.log(sideformdata);

    const handleSubmit= (e)=>{
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideformdata.searchTerm);
        urlParams.set('category', sideformdata.category);
        urlParams.set('type', sideformdata.type);
        urlParams.set('parking', sideformdata.parking);
        urlParams.set('furnished', sideformdata.furnished);
        urlParams.set('offer', sideformdata.offer);
        urlParams.set('sort', sideformdata.sort);
        urlParams.set('order', sideformdata.order);

        const searchQuery = urlParams.toString();

        navigate(`/search/?${searchQuery}`)

    }

    const onShowMoreClick = async ()=>{
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/flat-pg/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings,...data]);
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7  md:border-r-2 md:border-gray-300 md:min-h-screen mr-2'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap font-bold text-lg'>Enter to Search : </label>
                    <input type="text" id="searchTerm" placeholder="Search..." className='border bg-white rounded-lg p-2 w-full' value={sideformdata.searchTerm} onChange={handleChange}></input>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-bold text-lg'>category : </label>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.category === 'apartment'} onChange={handleChange} type='checkbox' id='apartment' className='w-5' />
                        <span>Apartment</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.category === 'pg'} onChange={handleChange} type='checkbox' id='pg' className='w-5' />
                        <span>PG</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.category === 'all-category'} onChange={handleChange} type='checkbox' id='all-category' className='w-5' />
                        <span>both</span>
                    </div>
                    
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-bold text-lg'>Type : </label>
                    
                    <div className='flex gap-2'>
                        <input checked={sideformdata.type === 'rent'} onChange={handleChange} type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.type === 'sale'} onChange={handleChange} type='checkbox' id='sale' className='w-5' />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.type === 'all-type'} onChange={handleChange} type='checkbox' id='all-type' className='w-5' />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={sideformdata.offer} onChange={handleChange} type='checkbox' id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-bold text-lg'>Amenities : </label>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={sideformdata.parking} type='checkbox' id='parking' className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={sideformdata.furnished} type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    
                </div>

                <div className='flex items-center gap-2'>
                    <label className='font-bold text-lg'>Sort :</label>
                    <select onChange={handleChange} defaultValue={'createdAtDesc'} className='border bg-white rounded-lg p-2 cursor-pointer'  id="sort_order">
                        <option value='createdAt_desc'>Latest First</option>
                        <option value='createdAt_asc'>Oldest First</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='regularPrice_desc'>Price high to low</option>
                        
                    </select>
                </div>
                <button className='bg-yellow-300 p-3 rounded-lg  hover:opacity-95 font-semibold cursor-pointer'>Search</button>
            </form>
        </div>

        <div className='flex-1'>
            <h1 className='text-2xl font-semibold border-b border-gray-300 p-2  mt-5'>Search Results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length===0 && (
                    <p className='text-xl'>Nothing found ! Try modifying your search</   p>
                )}

                {loading && (
                    <p className='text-xl text-center w-full'>Loading...</p>
                )}
                
                {
                    !loading && listings && listings.map((listing)=>(
                        <ApartmentItem listing={listing} key={listing._id}/>
                    ))
                }

                {showMore && (
                    <button onClick={onShowMoreClick} className='text-blue-600 hover:underline p-7 text-center w-full cursor-pointer'>Show more</button>
                )}
            </div>
        </div>

        
    </div>
  )
}

