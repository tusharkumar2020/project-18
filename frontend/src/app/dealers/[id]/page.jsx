'use client';
import React, {useEffect, useState} from "react";
import useAxios from "../../hooks/useAxois";
import {useParams} from "next/navigation";
import {useAuth} from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Dealer() {
    const {data, loading, error, sendRequest} = useAxios();
    const [branchData, setBranchData] = useState([])
    const [reviewsData, setReviewsData] = useState([])
    const [carModels, setCarModels] = useState([])
    const params = useParams();
    const {isAuthenticated} = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState([])

    const toggleModal = () => setModalOpen(!isModalOpen);

    const getReviews = () => {
        sendRequest({method: 'GET', endpoint: `/djangoapp/reviews/dealer/${params?.id}`}).then((value) => {
            setReviewsData(value?.reviews)
        })
    }

    const getDealer = () => {
        sendRequest({method: 'GET', endpoint: `/djangoapp/dealer/${params?.id}`}).then((value) => {
            setBranchData(value?.dealer[0])
        })
    }

    const getCarModels = () => {
        sendRequest({method: 'GET', endpoint: `/djangoapp/get_cars`}).then((value) => {
            setCarModels(value?.CarModels)
        })
    }

    useEffect(() => {
        getDealer()
        getReviews()
        getCarModels()
    }, []);


    const handleSubmit = () => {
        if (!reviewData.name || reviewData.review === "" || reviewData.date === "" || reviewData.car_year === "" || reviewData.car_make === "") {
            toast.error("All details are mandatory")
            return;
        }
        let data = JSON.stringify({
            "name": reviewData.name,
            "dealership": Number(params?.id),
            "review": reviewData.review,
            "purchase": true,
            "purchase_date": reviewData.date,
            "car_make": reviewData.car_make.split(" ")[0],
            "car_model": reviewData.car_make.split(" ")[1],
            "car_year": reviewData.car_year,
        });

        sendRequest({method: "POST", endpoint: '/djangoapp/add_review', data: data}).then((value) => {
            if (value.status === 200) {
                setModalOpen(false)
                toast.success('Your review has been added successfully!');
                getReviews()
            }
        })
    }


    return (
        <div className={'container bg-stone-800 mx-auto flex items-start justify-center m-5 rounded'}>
            <div className="text-white shadow-lg rounded-lg p-8 w-1/2">
                <h1 className="text-2xl font-bold mb-4 text-yellow-500">{branchData?.full_name}</h1>
                <div className="grid grid-cols-2 gap-2">
                    <p><span className="font-semibold">Short Name:</span> {branchData?.short_name}</p>
                    <p><span className="font-semibold">Address:</span> {branchData?.address}</p>
                    <p><span className="font-semibold">City:</span> {branchData?.city}</p>
                    <p><span className="font-semibold">State:</span> {branchData?.state}</p>
                    <p><span className="font-semibold">ZIP Code:</span> {branchData?.zip}</p>
                    <p><span className="font-semibold">Latitude:</span> {branchData?.lat}</p>
                    <p><span className="font-semibold">Longitude:</span> {branchData?.long}</p>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Location Map</h3>
                    <iframe
                        src={`https://www.google.com/maps?q=${branchData?.lat},${branchData?.long}&hl=es;z=14&output=embed`}
                        className="w-full h-64 border-0 rounded"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
            <div className={'reviews w-1/2 p-8'}>
                <div className={'flex items-center justify-between mb-4 space-x-2'}>
                    <h1 className="text-2xl font-bold  text-yellow-500">Reviews</h1>
                    {isAuthenticated &&
                        <h3 className={'text-gray-100 hover:bg-amber-500 cursor-pointer rounded bg-amber-400 p-2'}
                            onClick={toggleModal}>
                            Add Review
                        </h3>
                    }
                </div>
                <div className={'grid grid-cols-2 gap-2'}>
                    {reviewsData.map((review, index) => (
                        <div key={index}
                             className="max-w-sm w-full mx-auto border-zinc-500 border-2 h-full overflow-scroll shadow-md rounded p-2 relative">
                            {/* Car Details */}
                            <div className="text-zinc-500 mb-2">
                                <h2 className="font-bold text-lg">{review.car_make} - {review.car_model}</h2>
                                <span className={'text-sm'}>{review.purchase_date}</span>
                            </div>
                            {review.sentiment === 'positive' &&
                                <img src={'/assets/images/happy.svg'} className={'w-10 h-10 absolute right-5 top-5'}
                                     alt={'emoji'}/>
                            }
                            {review.sentiment === 'neutral' &&
                                <img src={'/assets/images/neutral.svg'} className={'w-10 h-10 absolute right-5 top-5'}
                                     alt={'emoji'}/>
                            }
                            {review.sentiment === 'negative' &&
                                <img src={'/assets/images/sad.svg'} className={'w-10 h-10 absolute right-5 top-5'}
                                     alt={'emoji'}/>
                            }
                            {/* Reviewer Information */}
                            <div className="text-zinc-400 text-xs mb-4">
                                <p>
                                    <span className="font-semibold">Reviewer:</span> {review.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Purchased:</span>
                                    {" "}
                                    {review.purchase ? "Yes" : "No"}
                                </p>
                            </div>
                            {/* Review Content */}
                            <div className="text-white mb-2 font-[Arial]">
                                <p className="italic">{review.review}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-[arial]">
                    <div className="bg-gray-200 w-96 rounded-lg shadow-lg p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        <div>
                            <h2 className="text-xl font-bold mb-4">Add new review</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        onChange={e => {
                                            setReviewData({...reviewData, name: e.target.value})
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Enter your fullname"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Purchase Date</label>
                                    <input
                                        type="date"
                                        onChange={e => {
                                            setReviewData({...reviewData, date: e.target.value})
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Enter your lastname"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Car Year</label>
                                    <input
                                        type="int"
                                        onChange={e => {
                                            setReviewData({...reviewData, car_year: e.target.value})
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Enter car year"
                                    />
                                </div>
                                <div className="w-full max-w-sm min-w-[200px]">
                                    <label htmlFor="">Car make/model</label>
                                    <div className="relative  bg-white rouned mb-5">
                                        {/*<label className="block text-gray-700">Choose Car Make and Model</label>*/}
                                        <select
                                            onChange={e => {
                                                setReviewData({...reviewData, car_make: e.target.value})
                                            }}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                                            <option value="" selected={true} disabled={true}>Choose</option>
                                            {carModels.map(e => {
                                                return <option
                                                    value={e.CarMake + " " + e.CarModel}>{e.CarMake + " " + e.CarModel}</option>
                                            })}
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.2" stroke="currentColor"
                                             className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Review</label>
                                    <textarea
                                        rows={2}
                                        onChange={e => {
                                            setReviewData({...reviewData, review: e.target.value})
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Enter your review"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600"
                                >
                                    Submit
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

