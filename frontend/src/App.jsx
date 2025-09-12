import React from 'react'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import MainNavigation from './components/MainNavigation'
import NewListing from './pages/NewListing'
import MyListings from './pages/MyListings'
import UserProfile from './pages/Userprofile'


const router=createBrowserRouter([
  {path:"/",element:<MainNavigation/>,children:[
    { path: "/", element: <Home /> },
    { path : "/about", element: <About/>},
    {path :  "/signIn", element: <SignIn/>},
    {path :  "/signUp", element: <SignUp/>},

    
    {path :  "/new-listing", element: <NewListing/>},
    {path :  "/my-listings", element: <MyListings/>},
    {path :  "/user-profile" , element : <UserProfile/>}
  ]}
 
])


export default function App() {
  return (
   <>
   <RouterProvider router={router}></RouterProvider>
   </>
  )
}