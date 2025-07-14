import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob, clearSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const dispatch = useDispatch();
    const { id: jobId } = useParams();
    const { singleJob } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setIsApplied(true);
                dispatch(setSingleJob({
                    ...singleJob,
                    applications: [...(singleJob?.applications || []), { applicant: user?._id }]
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to apply');
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            dispatch(clearSingleJob());

            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                toast.error('Could not fetch job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, dispatch]);

    useEffect(() => {
        if (singleJob && user?._id) {
            const alreadyApplied = singleJob.applications?.some(
                (app) => app?.applicant === user._id
            );
            setIsApplied(alreadyApplied);
        }
    }, [singleJob, user?._id]);

    if (loading || !singleJob) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto my-10 text-center text-lg font-medium text-gray-600">
                    Loading job details...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-xl">{singleJob.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            {singleJob.company?.logo && (
                                <img
                                    src={singleJob.company.logo}
                                    alt="Company Logo"
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            )}
                            <h2 className="text-sm font-medium">{singleJob.company?.name}</h2>
                            <p className="text-sm text-gray-500">• {singleJob.location}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Badge className="text-blue-700 font-bold" variant="ghost">
                                {singleJob.position} Positions
                            </Badge>
                            <Badge className="text-[#F83002] font-bold" variant="ghost">
                                {singleJob.jobType}
                            </Badge>
                            <Badge className="text-[#7209b7] font-bold" variant="ghost">
                                {singleJob.salary} LPA
                            </Badge>
                        </div>
                    </div>
                    <Button
                        onClick={!isApplied ? applyJobHandler : null}
                        disabled={isApplied}
                        className={`rounded-lg ${isApplied
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                            }`}
                    >
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
                    Job Description
                </h1>
                <div className="my-4 space-y-2">
                    <h1 className="font-bold">Role:
                        <span className="pl-4 font-normal text-gray-800">{singleJob.title}</span>
                    </h1>
                    <h1 className="font-bold">Location:
                        <span className="pl-4 font-normal text-gray-800">{singleJob.location}</span>
                    </h1>
                    <h1 className="font-bold">Description:
                        <span className="pl-4 font-normal text-gray-800">{singleJob.description}</span>
                    </h1>

                    {singleJob.requirements?.length > 0 && (
                        <div className="font-bold">
                            Requirements:
                            <div className="pl-2 font-normal text-gray-800">
                                {singleJob.requirements.map((req, idx) => (
                                    <div key={idx}>• {req}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {singleJob.experienceLevel && (
                        <h1 className="font-bold">Experience:
                            <span className="pl-4 font-normal text-gray-800">
                                {singleJob.experienceLevel}+ Years
                            </span>
                        </h1>
                    )}

                    <h1 className="font-bold">Salary:
                        <span className="pl-4 font-normal text-gray-800">
                            {singleJob.salary} LPA
                        </span>
                    </h1>

                    <h1 className="font-bold">Total Applicants:
                        <span className="pl-4 font-normal text-gray-800">
                            {singleJob.applications?.length || 0}
                        </span>
                    </h1>

                    {singleJob.createdAt && (
                        <h1 className="font-bold">Posted Date:
                            <span className="pl-4 font-normal text-gray-800">
                                {new Date(singleJob.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </h1>
                    )}
                </div>
            </div>
        </>
    );
};

export default JobDescription;
