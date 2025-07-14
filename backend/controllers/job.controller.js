import { Job } from "../models/job.model.js";

// Admin creates a new job post
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Some fields are missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split("."),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    return res.status(500).json({
      message: "Something went wrong while posting job.",
      success: false,
    });
  }
};

// Get all jobs for students (with optional keyword search)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching jobs.",
      success: false,
    });
  }
};

// Get a single job by ID (for students)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "company",
        select: "name logo",
      })
      .populate("applications");
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching job.",
      success: false,
    });
  }
};

// Get all jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching admin jobs.",
      success: false,
    });
  }
};

// Delete a job by ID (admin only)
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting job.",
    });
  }
};
