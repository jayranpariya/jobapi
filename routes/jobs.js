const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  createJobs,
  updateJobs,
  deleteJobs,
  getJobs,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJobs);

router.route("/:id").get(getJobs).delete(deleteJobs).patch(updateJobs);

module.exports = router;
