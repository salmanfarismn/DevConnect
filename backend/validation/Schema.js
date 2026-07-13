const Joi = require("joi");

exports.projectSchema = Joi.object({
    title: Joi.string().min(5).max(30).required(),
    description: Joi.string().min(5).max(100).required(),
    budget: Joi.number().min(1).required(),
    timeline: Joi.string().required()
});

exports.proposalSchema = Joi.object({
    projectId: Joi.string().required(),
    proposalText: Joi.string().min(8).required(),
    estimatedCost: Joi.number().min(10).required()
});

exports.registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("client", "developer").default("client")
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});