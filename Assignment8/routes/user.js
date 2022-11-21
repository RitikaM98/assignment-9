const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../models/user.model");
var validator = require("email-validator");

const bcrypt = require("bcrypt");
const saltRounds = 10;

var passwordValidator = require("password-validator");
const user = require("../models/user.model");

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
    .is()
    .min(8) 
    .is()
    .max(100) 
    .has()
    .uppercase()
    .has()
    .lowercase() 
    .has()
    .digits(2) 
    .has()
    .not()
    .spaces(); 

router.get("/getAll", async(req, res) => {
    try {
        let users = await User.find();

        res.json(users);
    } catch (err) {
        res.send("Error" + err);
    }
});

router.post("/create", async(req, res) => {
    let tempPassword = null;
    if (validator.validate(req.body.email) == false) {
        return res.send("Please enter valid Email Id");
    } else if (schema.validate(req.body.password) == false) {
        return res.send("Weak password");
    } else {
        const tempuser = await User.findOne({ email: req.body.email });
        if(tempuser != null) return res.send("Email ID already exists");
        await bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
            tempPassword = hash;
        });

        const user = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            password: tempPassword,
        });

        try {
            const a1 = await user.save();
            res.json(a1);
        } catch (err) {
            res.send(err);
        }
    }
});

router.put("/edit", async(req, res) => {
const user = await User.findOne({email:req.body.email});

if(user) {
    const email = req.body.email;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const salt = await bcrypt.genSalt(10);
    const password1 = await bcrypt.hash(password, salt);
    const emailid = await User.find({email: req.body.email} )       
    const result = await User.findByIdAndUpdate(emailid,{email:email, fullname:fullname , password:password1});
    res.send('Document has been updated');
    return;
}
else {
    res.status(400).send("The user does not exist");
}

});

router.delete("/delete", async(req, res) => {
    const tempuser = await User.findOne({ email: req.body.email });
    
    if(tempuser) {

    await bcrypt.compare(
        req.body.password,
        tempuser.password,
        async function(err, result) {
            if (result == true) {
                try {
                    const user = await User.findOneAndDelete({ email: req.body.email });
                    res.send("User successfully deleted");
                } catch (err) {
                    res.send(err);
                }
            } else {
                return res.send("false");
            }
        }
    );
    } 
    else {
        res.status(400).send("The user does not exist");
    }
});

module.exports = router;

