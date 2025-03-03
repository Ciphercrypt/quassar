const Validator = require('validator');
const isEmpty = require('./is-empty');


const validateUserRegisterDetails = (data) => {
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.dob = !isEmpty(data.dob) ? data.dob : '';
    data.contactNumber = !isEmpty(data.contactNumber) ? data.contactNumber : '';
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    if (!Validator.isLength(data.contactNumber, { min: 10, max: 10 })) {
        errors.contactNumber = 'ContactNumber must be of 10 digit';
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (Validator.isEmpty(data.contactNumber)) {
        errors.contactNumber = 'DOB field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}


module.exports = validateUserRegisterDetails;