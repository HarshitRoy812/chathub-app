const Joi = require('joi');

const userRegistrationSchema = Joi.object({
    name : Joi.string().min(1).max(20).required(),
    email : Joi.string().email().required(),
    password : Joi.string().alphanum().min(6).max(15).required(),
})

const userLoginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().alphanum().min(6).max(15).required()
})

module.exports = {
    userRegistrationSchema,
    userLoginSchema
}