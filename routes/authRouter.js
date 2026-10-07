const express = require('express');

const authRouter = express.Router();

const {register,login,logout, me , uploadProfilePicture,  uploadResume} = require('../controllers/authControllers');

const { isAuthenticated} = require('../middlewares/auth')

const upload = require('../middlewares/upload');


authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/me',isAuthenticated,me);
authRouter.post('/logout',isAuthenticated,logout);

authRouter.post(  '/upload/profile-picture',  isAuthenticated, upload.single ('profilePicture'),  uploadProfilePicture),
 
    authRouter.post('upload/resume',  isAuthenticated, upload.single('resume'),   uploadResume );

// export router
module.exports = authRouter;
