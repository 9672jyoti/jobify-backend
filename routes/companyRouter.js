const express = require("express");

const { createCompany , getAllCompanies, getCompanyByID ,updateCompany, deleteCompany, createRecruiter,getAllRecruiter} = require("../controllers/adminControllers");


const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const companyRouter = express.Router();
// admin routes


companyRouter.use(isAuthenticated);


companyRouter.use(allowRoles(['admin']));


companyRouter.post("/", createCompany);

companyRouter.get("/", getAllCompanies);

companyRouter.get("/:id", getCompanyByID);


companyRouter.put("/:id", updateCompany);
companyRouter.delete("/:id", deleteCompany);

companyRouter.post("/:id/recruiter",  createRecruiter);
companyRouter.get("/:id/recruiter",  getAllRecruiter);

module.exports = companyRouter;