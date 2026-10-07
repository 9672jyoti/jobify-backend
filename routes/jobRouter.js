const express = require("express");

const {isAuthenticated,allowRoles} = require('../middlewares/auth')
const {
    getAllJobs,
     getJobById,
      createJob,
    updateJobs,
    deleteJobs,
    getRecruiterJobs,
    getJobsApplication
} = require("../controllers/jobControllers");



const jobRouter = express.Router();


jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJobById);
jobRouter.post("/", isAuthenticated,allowRoles(['recruiter']), createJob);
jobRouter.put("/:id", isAuthenticated,allowRoles(['recruiter']), updateJobs);
jobRouter.delete("/:id",isAuthenticated,allowRoles(['recruiter']),  deleteJobs);
jobRouter.get("/recruiter/jobs", isAuthenticated,allowRoles(['recruiter']), getRecruiterJobs);
jobRouter.get("/recruiter/jobs/:id/applications", isAuthenticated,allowRoles(['recruiter']), getJobsApplication);
module.exports = jobRouter;