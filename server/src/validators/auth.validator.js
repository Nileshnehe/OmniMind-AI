import Joi from "joi";

// 1. Registration Schema rules
export const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required()
    .messages({
      "string.min": "Name must be at least 3 characters long",
      "any.required": "Name is a required field"
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is a required field"
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is a required field"
    })
});

// 2. Login Schema rules
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address"
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password cannot be empty"
    })
});