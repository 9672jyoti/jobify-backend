/* const { getAllRecruiter } = require("./adminControllers"); */

const Application = require("../models/application");

const Job = require("../models/job");



const jobController = {
    getAllJobs: async (req, res) => {
        try {
            const { page = 1, limit = 10, search, location, jobType, experienceLevel } = req.query;
            //query obj
            const query = {
                isActive: true
            };

            // if search is provided, add it to the query object
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { skills: { $in: [new RegExp(search, 'i')] } }
                ];
            };

            // if location is provided, add it to the query object
            if (location) {
                query.location = {
                    $regex: location,
                    $options: 'i'
                };
            };

            // if jobType is provided, add it to the query object
            if (jobType) {
                query.jobType = jobType;
            }


            if (experienceLevel) {
                query.experiencelevel = experienceLevel;
            }
            // get job using pageination

            const jobs = await Job.find(query).populate('company', 'company logo location industry')
                .populate('postedBy', 'name')
                .sort({ createdAt: -1 })
                .limit(limit + 1)
                .skip((page - 1) * limit)

            // get total count of jobs from db
            const total = await Job.countDocuments(query);
            return res.status(200).json({ jobs, totalpages: Math.ceil(total / limit), currentPage: page, totalJobs: total });
        } catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },
    getJobById: async (req, res) => {
        try {
            const { id } = req.params;
            const job = await Job.findById(id)
                .populate('company', 'name logo location industry website description')
                .populate('postedBy', 'name');

            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }
            return res.status(200).json({ job });

        } catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    createJob: async (req, res) => {
        try {
            const { title, description, requirements, salary, location, jobType, experienceLevel, skills, applicationDeadline } = req.body;

            const newJob = new Job({
                title,
                description,
                requirements,
                salary,
                location,
                jobType,
                experiencelevel: experienceLevel,
                skills,
                applicationDeadline,
                postedBy: req.userId,
                company: req.user.assignedCompany
            });

            const savedJob = await newJob.save();
            const populateJob = await Job.findById(savedJob._id)
                .populate('company', 'name logo location industry')
                .populate('postedBy', 'name');

            return res.status(201).json({
                message: "Job created successfully", job: populateJob
            })
        }
        catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    updateJobs: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true })
                .populate('company', 'name logo location industry')
                .populate('postedBy', 'name');

            if (!updatedJob) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }
            return res.status(200).json({
                message: "Job updated successfully",
                job: updatedJob
            });
        } catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },
 deleteJobs: async (req, res) => {
    try {
        const { id } = req.params;

        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            }); 
        }

        return res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
},
    getRecruiterJobs: async (req, res) => {
        try {
           const jobs = await Job.find({
    postedBy: req.userId
})
    .populate('company', 'name logo location industry')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });

return res.status(200).json({
    jobs
});
        } catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },
    getJobsApplication: async (req, res) => {
        try {

                   const { id } = req.params;

              const job = await Job.findOne({ _id: id,postedBy: req.userId });

              if(!job){
                return res.status(404).json({message:"  job not found or you are not authorized to view application for this job " })
              }

              const application = await Application.find({job: id})
                 .populate(
        'applicant',
        'name email phone resume profilePicture bio skills experience location'
    )
    .populate('job', 'title')
    .sort({ appliedAt: -1 });
    return res.status(200).json({ application});

        } catch (e) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },
};

module.exports = jobController;