import React, { useState } from "react";
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";




const CreateListing = () => {

    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [files,setFiles] = useState([]);
   
    const [formData,setFormData] = useState({
        imageUrl: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
        
    });

    const [imageUploadError,setImageUploadError] = useState(false);

    const [uploading,setuploading] = useState(false);

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);

      console.log(formData,"===formData===");


    const handleImageSubmit = (e) => {
        
        if(files.length>0 && files.length + formData.imageUrl.length < 7){
            setuploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i=0;i<files.length;i++){
                console.log(files[i]);
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({...formData,imageUrl:formData.imageUrl.concat(urls)}),
                setImageUploadError(false);
                setuploading(false);
            }).catch((error) => {
                setImageUploadError("Image upload failed");
                 setuploading(false);
            })


        }else{
            setImageUploadError("You can only upload 6 images per listing");
            setuploading(false);
        }
    }

    const storeImage = async(file) => {
        return new Promise((resolve,reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is  ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                });
            }
            );
        });
    }

   

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrl: formData.imageUrl.filter((_,i) => i !== index)
        })
    }

    const handleChange = (e) => {

        if(e.target.id === "sell" || e.target.id === "rent"){
            setFormData({
                ...formData,
                type : e.target.id
            })
        }

        if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
            setFormData({
                ...formData,
                [e.target.id] : e.target.checked,
            })
        }

        if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value,
            })
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrl.length < 1){
               return setError("upload atleast one image for listing");
            }
            if(+formData.regularPrice < +formData.discountPrice){
                 return setError("Discount price should be less than regular price");
            }
            setLoading(true);
            setError(false);

            const res = await fetch("/api/listing/create",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if(data.success === false){
                setError(data.error);
            }

            navigate(`/listing/${data.data._id}`);
        } catch (error) {
            setError(error.error);
            setLoading(false);
        }
    }


    return(
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="font-semibold text-3xl text-center my-7">Create a Listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">

                <div className="flex flex-col gap-4 flex-1">
                   
                    <input type="text" placeholder="Name" id="name" maxLength="62" minLength="10" required
                     className="p-3 border rounded-lg outline-none"
                     onChange={handleChange} value={formData.name}/>
                    <textarea type="text" placeholder="Description" id="description" required 
                    className="p-3 border rounded-lg outline-none"
                    onChange={handleChange} value={formData.description}/>
                    <input type="text" placeholder="Address" id="address" required
                     className="p-3 border rounded-lg outline-none"
                     onChange={handleChange} value={formData.address}/>
                 

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sell" className="w-5" onChange={handleChange} checked={formData.type === "sell"}/>
                            <span className="font-semibold">Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === "rent"}/>
                            <span className="font-semibold">Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking}/>
                            <span className="font-semibold">Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}/>
                            <span className="font-semibold">Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer}/>
                            <span className="font-semibold">Offer</span>
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" className="p-3 rounded-lg border border-gray-300 outline-none" 
                            min="1" max="10" required onChange={handleChange} value={formData.bedrooms}/>
                            <p className="font-semibold">Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathrooms" className="p-3 rounded-lg border border-gray-300 outline-none" 
                            min="1" max="10" required onChange={handleChange} value={formData.bathrooms}/>
                            <p className="font-semibold">Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="regularPrice" className="p-3 rounded-lg border border-gray-300 outline-none"
                             min="50" max="1000000" required onChange={handleChange} value={formData.regularPrice}/>
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Regular price</p>
                            <span className="text-xs">($ / Month)</span>
                            </div>
                            
                        </div>

                        {formData.offer && (
                             <div className="flex items-center gap-2">
                             <input type="number" id="discountPrice" className="p-3 rounded-lg border border-gray-300 outline-none" 
                             min="0" max="10000000" required onChange={handleChange} value={formData.discountPrice}/>
                             <div className="flex flex-col items-center">
                             <p className="font-semibold">Discounted price</p>
                             <span className="text-xs">($ / Month)</span>
                             </div>
                         </div>
                        )}

                    </div>




                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="ml-2 font-normal text-gray-600">The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) =>setFiles(e.target.files) } className="p-3 border border-gray-300 rounded-w-full" type="file" id="image" accept="image/*" multiple/>
                        <button disabled={uploading} onClick={handleImageSubmit} type="button" className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80">
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrl.length>0 && formData.imageUrl.map((url,index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing image" className="h-20 w-20 object-contain rounded-lg"/>
                                <button onClick={() => {handleRemoveImage(index)}} type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                            </div>
                        ))
                    }


                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-90 disabled:opacity-80 gap-4">{loading?"creating...." : "Create Listing"}</button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    )
}

export default CreateListing;