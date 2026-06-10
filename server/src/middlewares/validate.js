// const validate = (schema) => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req.body, {
//       abortEarly: false, // Taaki saare errors ek hi baar mein list ho sakein
//       stripUnknown: true // Kisi bhi unknown hacker fields/payload ko strip (remove) kar dega
//     });

//     if (error) {
//       const errorMessages = error.details.map((detail) => detail.message);
      
//       return res.status(400).json({
//         success: false,
//         message: "Validation Error",
//         errors: errorMessages
//       });
//     }

//     // Sanitize values ko overwrite karo (clean formatted text input tracking ke liye)
//     req.body = value;
//     next();
//   };
// };

// export default validate;

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true 
    });

    if (error) {
      // 🟢 Saare array errors ko comma laga kar single crisp clean string text bana do
      const structuralCleanErrorMessage = error.details.map((detail) => detail.message).join(", ");
      
      console.log("⚠️ [BACKEND Joi INTERCEPTED ERROR]:", structuralCleanErrorMessage);

      return res.status(400).json({
        success: false,
        // ⚡ MATRIX CHANGED HERE: Ab string message directly automatic frontend dynamic padh lega!
        message: structuralCleanErrorMessage, 
        errors: error.details.map((detail) => detail.message)
      });
    }

    req.body = value;
    next();
  };
};

export default validate