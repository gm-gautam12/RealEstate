import React,{ useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { app } from "/projects/real-estate/frontend/firebase.js";
import { updateUserStart,updateUserSuccess,updateUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {

    const {currentUser} = useSelector((state)=>state.user);

    const [file,setFile] = useState(undefined);
    const [fileChange,setFileChange] = useState(0);
    const [fileError,setFileError] = useState(false);
    const [formData,setFormData] = useState({});

    const dispatch = useDispatch();

    //console.log(formData);

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
            const res = await fetch(`/api/user/update/${currentUser._id}`,
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
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            


        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
        
    }

    return(
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1> 
            <form onSubmit={handleSumbit} className="flex flex-col gap-4">
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
                <img onClick={() => fileRef.current.click()} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src = {formData.avatar || currentUser.avatar} alt="profile"/>

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
                <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <input type="email" placeholder="xyz@gmail.com" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg outline-none" onChange={handleChange}/>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer">Delete account</span>
                <span className="text-red-700 cursor-pointer">Sign out</span>
            </div>
        </div>
    )
}

export default Profile;