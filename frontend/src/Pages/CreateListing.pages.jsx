import React from "react";


const CreateListing = () => {
    return(
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="font-semibold text-3xl text-center my-7">Create a Listing</h1>
            <form className="flex flex-col sm:flex-row gap-4">

                <div className="flex flex-col gap-4 flex-1">
                   
                    <input type="text" placeholder="Name" id="name" maxLength="62" minLength="10" required className="p-3 border rounded-lg outline-none"/>
                    <textarea type="text" placeholder="Description" id="description" required className="p-3 border rounded-lg outline-none"/>
                    <input type="text" placeholder="Address" id="address" required className="p-3 border rounded-lg outline-none"/>
                 

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sell" className="w-5"/>
                            <span className="font-semibold">Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5"/>
                            <span className="font-semibold">Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5"/>
                            <span className="font-semibold">Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5"/>
                            <span className="font-semibold">Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5"/>
                            <span className="font-semibold">Offer</span>
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="beds" className="p-3 rounded-lg border border-gray-300 outline-none" min="1" max="10" required/>
                            <p className="font-semibold">Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathroom" className="p-3 rounded-lg border border-gray-300 outline-none" min="1" max="10" required/>
                            <p className="font-semibold">Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="regularprice" className="p-3 rounded-lg border border-gray-300 outline-none" min="1" max="10" required/>
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Regular price</p>
                            <span className="text-xs">($ / Month)</span>
                            </div>
                            
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="discountprice" className="p-3 rounded-lg border border-gray-300 outline-none" min="1" max="10" required/>
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Discounted price</p>
                            <span className="text-xs">($ / Month)</span>
                            </div>
                        </div>
                    </div>




                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="ml-2 font-normal text-gray-600">The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input className="p-3 border border-gray-300 rounded-w-full" type="file" id="image" accept="image/*" multiple/>
                        <button className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
                    </div>

                    <button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-90 disabled:opacity-80 gap-4">Create Listing</button>
                </div>

            </form>
        </main>
    )
}

export default CreateListing;