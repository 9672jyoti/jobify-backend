const Job = require('../models/job');
const Application = require('../models/application');

const applicationController = {

    applyForJob: async (req, res) => {
        try {

            // Get logged-in user ID
            const userId = req.userId;

            // Get job ID from URL
            const { jobId } = req.params;

            // Get cover letter and resume from request body
            const { coverLetter, resume } = req.body;

            // Check if job exists and is active
            const job = await Job.findOne({
                _id: jobId,
                isActive: true
            });

            if (!job) {
                return res.status(404).json({
                    message: 'Job not found or is not active'
                });
            }

       
            // Check if user has already applied for this job
            const existingApplication = await Application.findOne({
                job: jobId,
                applicant: userId
            });

            if (existingApplication) {
                return res.status(400).json({
                    message: 'You have already applied for this job'
                });
            }
                 // Check application deadline
            if (
                job.applicationDeadline &&
                new Date() > new Date(job.applicationDeadline)
            ) {
                return res.status(400).json({
                    message: 'Application deadline has passed'
                });
            }


            // Create new application
            const newapplication = new Application({
                job: jobId,
                applicant: userId,
                coverLetter: coverLetter || '',
              
            });

            await newapplication.save();

            // Increase application count
            await Job.findByIdAndUpdate(
                jobId,
                {
                    $inc: {
                        applicationCount: 1
                    }
                }
            );

            return res.status(201).json({
                message: 'Application submitted successfully',
                application:newapplication
            });

        } catch (e) {

            // Handle duplicate application
            if (e.code === 11000) {
                return res.status(400).json({
                    message: 'You have already applied for this job'
                });
            }

            return res.status(500).json({
                message: 'Failed to apply for job',
                error: e.message
            });
        }
    },

    getUserApplications: async (req, res) => {
        try {
   

        // Get logged-in user ID
        const userId = req.userId;

        // Get all applications submitted by this user
        const applications = await Application.find({
            applicant: userId
        })
        .populate({
            path: 'job',
            select: 'title description location jobType experienceLevel company',
            populate: {
                path: 'company',
                select: 'name logo'
            }
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'User applications fetched successfully',
            applications
        });
        } catch (e) {
            return res.status(500).json({
                message: 'Failed to get user applications',
                error: e.message
            });
        }
    },

    updateApplicationStatus: async (req, res) => {
        try {
                   const { applicationId } = req.params;
        const { notes, status } = req.body;

        const userId = req.userId;
                
        const application = await Application.findById(applicationId).populate({path:'job',populate:{path:'postedBy',}})
        .populate('applicant','name email');

              if (!application) {
            return res.status(404).json({
                message: 'Application not found'
            });
        }
// Check if the logged-in user is the employer who posted the job
if (application.job.postedBy._id.toString() !== userId) {
    return res.status(403).json({
        message: 'You are not authorized to update this application'
    });
}
// Update the application status and notes
application.status = status || application.status;
application.notes = notes || application.notes;
application.reviewedBy = userId;

application.reviewedAt = new Date();

         await application.save();

         //email notifi.
         return res.status(200).json({ application});

 


            
        } catch (e) {
            return res.status(500).json({
                message: 'Failed to update application status',
                error: e.message
            });
        }
    },
getApplicationById: async (req, res) => {
    try {

        // Get application ID from URL
        const { applicationId } = req.params;

        // Get logged-in user ID
        const userId = req.userId;

        // Find application
        const application = await Application.findById(applicationId)
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            })
            .populate('reviewedBy', 'name')
            .populate('applicant', 'name email');

        // Check application exists
        if (!application) {
            return res.status(404).json({
                message: 'Application not found'
            });
        }

        // Check if logged-in user is either:
        // 1. Applicant
        // 2. Employer who posted the job
        if (
            application.applicant._id.toString() !== userId &&
            application.job.postedBy.toString() !== userId
        ) {
            return res.status(403).json({
                message: 'You are not authorized to view this application'
            });
        }

        // Return application
        return res.status(200).json({
            message: 'Application fetched successfully',
            application
        });

    } catch (e) {
        return res.status(500).json({
            message: 'Failed to get application by ID',
            error: e.message
        });
    }
}

};

module.exports = applicationController;