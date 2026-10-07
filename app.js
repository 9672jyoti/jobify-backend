const express = require('express');
const authRouter = require('./routes/authRouter');
const companyRouter = require('./routes/companyRouter');

const jobRouter = require('./routes/jobRouter')
const applicationRouter = require('./routes/applicationRouter');

const cookieParser = require('cookie-parser');




const app = express();

// static files for uplod
/* app.use('/api/v1/uploads', express.static('uploads')); */

app.use('/uploads', express.static('uploads'));


app.use(cookieParser());
/* app.use(express.urlencoded({extended: true})); */

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/companies', companyRouter);

app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);

module.exports = app;