import React, { useEffect, useState } from 'react'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  const formatDate = (mongoDate) => {
    const date = new Date(mongoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const deleteHandler = async (jobId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this job?");
      if (!confirmDelete) return;

      axios.defaults.withCredentials = true;
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`);
      if (res.data.success) {
        toast.success(res.data.message);

        // Remove deleted job from state
        const updatedJobs = allAdminJobs.filter(job => job._id !== jobId);
        dispatch(setAllAdminJobs(updatedJobs));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            filterJobs?.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>{job?.status || "Open"}</TableCell>
                <TableCell>{formatDate(job?.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button><MoreHorizontal /></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded'>
                        <Eye className='w-4' />
                        <span>Applicants</span>
                      </div>
                      <div
                        onClick={() => deleteHandler(job._id)}
                        className='flex items-center gap-2 cursor-pointer text-red-500 mt-2 hover:bg-red-100 px-2 py-1 rounded'>
                        <Trash2 className='w-4' />
                        <span>Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
