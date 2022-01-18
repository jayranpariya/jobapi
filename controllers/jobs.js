const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors/index");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.find({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJobs = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  // const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJobs = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company Or position fields cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidation: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getJobs,
  getAllJobs,
  createJobs,
  updateJobs,
  deleteJobs,
};
