   const Company = require('../models/company');


   const User = require('../models/user');
   const bcrypt = require('bcrypt');
   const { SALT_ROUNDS } = require('../utils/config');
   
   const adminController = {

        createCompany: async (req, res) => {

            try {
                const {name, description, industry, location, website, size, foundedyear} = req.body;

                // check if the company already exists with the name provided in the request body
             const companyExists = await Company.findOne({ name: name });

             
            // if yes, return a 400 status code with a message "Company already exists"
            if (companyExists) {
                return res.status(400).json({ message: "Company already exists" });
            }

              // create a new company object with the Company model and the data from the request body
                        const newCompany = new Company({
                            name,
                            description,
                            industry,
                            location,
                            website,
                            size,
                            foundedyear,
                            createdBy: req.user._id
                        });
         // save the new company object to the database and store the result in a variable
            const savedCompany = await newCompany.save();

                   // delete the __v property from the savedCompany object
            const { __v, ...result } = savedCompany.toObject();
            
            return res.status(201).json({ message: "Company created successfully", result });

            } catch (e) {
                return res.status(500).json({ message: e.message });


            }
        },

    // gett all comp

        getAllCompanies: async (req, res) => {

            try {

                 // get all the companies from the database and store the result in a variable
                   const companies = await Company.find().populate('createdBy', 'name email');

                return res.status(200).json({ success: true, message: "gett all company end" , result: companies });

            } catch (e) {
                return res.status(500).json({ message: e.message });


            }
        },
        // get single company

        getCompanyByID: async (req, res) => {

            try {
                 // get the company id from the request params
                const { id } = req.params;
                // get the company from the database using the id and store the result in a variable
                            const company = await Company.findById(id).populate('createdBy', 'name email');

                                // if the company does not exist, return a 404 status code with a message "Company not found"
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }

             
            // return a 200 status code with a message "Company retrieved successfully" and the result
            return res.status(200).json({ message: "Company retrieved successfully", result: company });

            } catch (e) {
                return res.status(500).json({ message: e.message });
    }

        },

        // update

        updateCompany: async (req, res) => {
            try {

                    // get the company id from the request params
            const { id } = req.params;
             const { name, description, industry, location, website, size, foundedyear } = req.body;
              // find the company by id and update it with the new details
                         const updatedCompany = await Company.findByIdAndUpdate(id, {
                             name,
                             description,
                             industry,
                             location,
                             website,
                             size,
                             foundedyear
                         }, { new: true });

                return res.status(200).json({ message: "Company updated successfully", result: updatedCompany });

            } catch (e) {
                return res.status(500).json({ message: e.message });
    }


        },
        // delete
               

        deleteCompany: async (req, res) => {
            try {

                    const { id } = req.params;

                    const deletedCompany = await Company.findByIdAndDelete(id);
                     if (!deletedCompany) {
                return res.status(404).json({ message: "Company not found" });
            }   

              return res.status(200).json({ message: "Company deleted successfully", result: deletedCompany });

            } catch (e) {
                return res.status(500).json({ message: e.message });


            }


        },

    createRecruiter: async (req, res) => {
            try {

                  const { id } = req.params;

                    const { name, email, password } = req.body;

                       const user = await User.findOne({ email: email });
                         if (user) {
                return res.status(400).json({ message: "User already exists" });
            }
            
                        // check if the company exists with the companyId provided in the request body
                        const company = await Company.findById(id);

                         if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }
            
            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

            // create a new user object with the User model and the data from the request body
                        const newUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            role: 'recruiter',
                            assignedCompany: company._id
                        })

                        const savedUser = await newUser.save();

                        
            // if the user is not created, return a 500 status code with a message "Recruiter creation failed"
            if (!savedUser) {
                return res.status(500).json({ message: "Recruiter creation failed" });
            }

              // delete the password and __v property from the savedUser object
            const { password: _, __v, ...result } = savedUser.toObject();

            
            // return a 201 status code with a message "Recruiter created successfully" and the result
            return res.status(201).json({ message: "Recruiter created successfully", result });


                

            } catch (e) {
                return res.status(500).json({ message: e.message });


            }


        },


        getAllRecruiter: async (req, res) => {
            try {

                    const { id } = req.params;
                     const company = await Company.findById(id);
                    
                                // if no, return a 404 status code with a message "Company not found"
                                if (!company) {
                                    return res.status(404).json({ message: "Company not found" });
                                }
                    
                                // get all the recruiters from the database using the companyId and store the result in a variable
                                const recruiter = await User.find({ assignedCompany: id, role: 'recruiter' }).select('-password -__v');
                    
                                // return a 200 status code with a message "Recruiters retrieved successfully" and the result
                                return res.status(200).json({ message: "Recruiters retrieved successfully", result: recruiter});
            } catch (e) {
                return res.status(500).json({ message: e.message });


            }


        },



    };

    module.exports = adminController;