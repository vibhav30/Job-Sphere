import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();

    const dispatch = useDispatch();

    const { allJobs, searchedQuery } = useSelector((store) => store.job);

    // Clear search query when unmounting
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    // Filter jobs by searchedQuery (if any)
    const filteredJobs = searchedQuery
        ? allJobs.filter((job) =>
            job.title.toLowerCase().includes(searchedQuery.toLowerCase())
        )
        : allJobs;

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>
                    Search Results ({filteredJobs.length})
                </h1>
                <div className='grid grid-cols-3 gap-4'>
                    {filteredJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;
