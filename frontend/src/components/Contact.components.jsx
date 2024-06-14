import React, { useEffect, useState } from "react";
import { ApiError } from "../../../backend/utils/ApiError.js";
import { Link } from "react-router-dom";



const Contact = ({listing}) => {

const [landlord,setLandlord] = useState(null);

const [message,setMessage] = useState("");

const onClickChange = (e) => {
    setMessage(e.target.value)
}


useEffect(()=>{
    const fetchLandLord = async() => {
        try {
            const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();

            if(data.success === false){
                return;
            }

            setLandlord(data.data);

        } catch (error) {
            throw new ApiError(500,error);
        }
    }
    fetchLandLord();

},[listing.userRef])
    

    return(
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
                    <textarea name="message" id="message" placeholder="Enter your message here..." row="2" value={message} onChange={onClickChange} className="border rounded-lg p-3 w-full outline-none"></textarea>
                    <Link className="bg-slate-700 w-full text-white text-center p-3 rounded-lg hover:opacity-95 uppercase" to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
                </div>
            )}
        </>
    )
}

export default Contact;