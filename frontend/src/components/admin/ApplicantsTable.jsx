import React from 'react'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Badge } from '../ui/badge'

const shortlistingStatus = ["Accepted", "Rejected"];

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800"
};

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>List of users who applied</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            applicants?.applications?.map((item) => {
              const status = item?.status || "Pending";
              const badgeClass = statusColor[status] || "bg-gray-100 text-gray-800";

              return (
                <TableRow key={item._id}>
                  <TableCell>{item?.applicant?.fullname || "NA"}</TableCell>
                  <TableCell>{item?.applicant?.email || "NA"}</TableCell>
                  <TableCell>{item?.applicant?.phoneNumber || "NA"}</TableCell>
                  <TableCell>
                    {
                      item?.applicant?.profile?.resume ? (
                        <a
                          className="text-blue-600 underline"
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.applicant.profile.resumeOriginalName || "Resume"}
                        </a>
                      ) : (
                        <span>NA</span>
                      )
                    }
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${badgeClass}`}>
                      {status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(item?.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button><MoreHorizontal /></button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        {
                          shortlistingStatus.map((statusOption, index) => (
                            <div
                              key={index}
                              onClick={() => statusHandler(statusOption, item._id)}
                              className="cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                            >
                              {statusOption}
                            </div>
                          ))
                        }
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicantsTable
