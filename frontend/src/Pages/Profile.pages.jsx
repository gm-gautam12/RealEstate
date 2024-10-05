import React,{ useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { updateUserStart,updateUserSuccess,updateUserFailure, 
    deleteUserFailure,deleteUserSuccess, deleteUserStart,
signOutUserFailure,signOutUserStart,signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ApiError } from "../../../backend/utils/ApiError";




const Profile = () => {

    const { currentUser, loading, error } = useSelector((state)=>state.user);

    const [file,setFile] = useState(undefined);
    const [fileChange,setFileChange] = useState(0);
    const [fileError,setFileError] = useState(false);
    const [formData,setFormData] = useState({});
    const [updateSuccess,setUpdateSuccess] = useState(false);
    const [showImageListingError,setShowImageListingError] = useState(false);
    const [userListings,setUserListings] = useState([]);
    //const [listingDeleteError,setListingDeleteError] = useState(false);

    const dispatch = useDispatch();

    const fileRef = useRef(null);

    useEffect(() => {
        if(file){
            handleFileUpload(file);
        }
    },[file]);



    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name; // adding date to get unique file name every time
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file); // ye batayega kitna percent upload hua h 


        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileChange(Math.round(progress));
            },
            (error) => {
                setFileError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then
                ((downloadURL) => {
                    setFormData({...formData,avatar:downloadURL});
                })
            }
        )     
    }

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id]: e.target.value
            }
        )

    }



    const handleSumbit = async(e) => {
        e.preventDefault();

        try {

            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser.data.user._id}`,
                {
                    method:"POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();
            if(data.success === false){
                dispatch(updateUserFailure(data.error));
                return;
            }

            dispatch(updateUserSuccess(data.data));
             setUpdateSuccess(true);
            setFormData(data.data);

        

        } catch (error) {
            dispatch(updateUserFailure(error.error));
        }
        
    }

    const handleDeleteUser = async() => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser.data.user._id}`,
                {
                    method:"DELETE",
                }
            );

            const data = await res.json();
            if(data.success === false){
                dispatch(deleteUserFailure(data.error));
                return;
            }

            dispatch(deleteUserSuccess(data.data));
            
        } catch (error) {
            console.log(error,"====error====")
            dispatch(deleteUserFailure(error.error));
        }
    }

    const handleSignOutUser = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if(data.success === false){
                dispatch(signOutUserFailure(data.error));
                return;
            }

            dispatch(signOutUserSuccess(data.data));

        } catch (error) {
            dispatch(signOutUserFailure(error.error));
        }
    }

    const handleShowListing = async() => {

        try {
            setShowImageListingError(false);
           const res = await fetch(`/api/user/listings/${currentUser.data.user._id}`);
           const data = await res.json(); 

           console.log(data,"====data====");

           if(data.user.success === false){
               setShowImageListingError(true);
               return;
           }
           setUserListings(data.data);
        } catch (error) {
            setShowImageListingError(true);
        }

    }

    const handleListingDelete = async(listingId) => {
        try {
           const res = await fetch(`/api/listing/delete/${listingId}`,
            {
                 method:"DELETE",
            }  
           ) 
           const data = await res.json();
           if(data.success === false){
                throw new ApiError(400,data.message);
           }

           setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));

        } catch (error) {
            throw new ApiError(500,error);
        }
    }

    return(
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1> 
            <form onSubmit={handleSumbit} className="flex flex-col gap-4">
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
                <img onClick={() => fileRef.current.click()} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src = {formData.avatar || currentUser?.data?.user?.avatar} alt="profile"/>

                <p className="text-sm self-center">
                    {fileError ?
                        (<span className="text-red-700">Error Image upload</span>)
                        : 
                        fileChange>0 && fileChange<100 ? (
                        <span className="text-slate-700">{`Uploading ${fileChange}%`}</span>)
                        :
                        fileChange === 100 ? (
                        <span className="text-green-700">Image Uploaded Successfully</span>)
                        : (
                        ""
                        )
                    }
                </p>
                <input type="text" placeholder="username" defaultValue={currentUser?.data?.user?.username} id="username" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <input type="email" placeholder="xyz@gmail.com" defaultValue={currentUser?.data?.user?.email} id="email" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "loading..." : "Update"}</button>
                <Link className="bg-green-700 p-3 rounded-lg text-center text-white uppercase hover:opacity-95" to={"/create-listing"}>Create Listing</Link>
            </form>
            <div className="flex justify-between mt-5">
                <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
                <span onClick={handleSignOutUser} className="text-red-700 cursor-pointer">Sign out</span>
            </div>
            <p className="text-red-700 mt-5">{error?error.message:""}</p>
            <p className="text-green-700 mt-5">{updateSuccess?"user updated successfully":""}</p>
            <button onClick={handleShowListing} className="text-green-700 w-full">show Listing</button>
            <p className="text-red-700 mt-5">{showImageListingError ? "Error showing listing" : ""}</p>

             {userListings && userListings.length>0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold">Your Listing</h1>
                    { userListings.map((listing) => (
                    <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
                        <Link to={`/listing/${listing._id}`}>
                        <img src={listing.imageUrl[0]} alt="Listing image" className="h-16 w-16 object-contain" />
                        </Link>
                        <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                            <p>{listing.name}</p>
                        </Link>

                        <div className="flex flex-col items-center">
                            <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                            <Link to={`/update-listing/${listing._id}`}>
                            <button className="text-green-700 uppercase">Edit</button>
                            </Link>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}

export default Profile;