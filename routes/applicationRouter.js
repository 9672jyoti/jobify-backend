const express = require('express');

const { isAuthenticated, allowRoles,} = require('../middlewares/auth');

const { applyForJob, getUserApplications, updateApplicationStatus, getApplicationById} = require('../controllers/applicationControllers');
const applicationRouter = express.Router();

applicationRouter.use(isAuthenticated);

applicationRouter.post( '/:jobId/apply', allowRoles(['user']), applyForJob);
applicationRouter.get( '/', allowRoles(['user']),  getUserApplications);
applicationRouter.put(   '/:applicationId/status',allowRoles(['recruiter']), updateApplicationStatus  );
applicationRouter.get('/:applicationId', allowRoles(['user', 'recruiter']), getApplicationById);
module.exports = applicationRouter;