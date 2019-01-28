const {userSchema} = require('../models/userSchema');
const bcrypt = require('bcrypt');
const Joi = require('joi')
module.exports.userLogin = async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await userSchema.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Incorrect Email or Password");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Incorrect Email or Password");

    const token = user.genAuthToken();

    res.header('x-auth-token', token).send('You have logged in successfully');
}

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}