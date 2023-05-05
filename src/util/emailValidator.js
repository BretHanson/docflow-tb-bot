import validate from "validate.js";

validate.validators.emailWithDomain = function(value, options, key, attributes) {
    const domains = ['@fox.com', '@gmail.com', '@yandex.ru', '@rushydro.ru'];
    if (!value || value.indexOf('@') === 0) {
        return options.message || 'is not an email';
    }

    const domain = value.split('@')[1];
    if (!domains.includes(`@${domain}`)) {
        return options.message || 'is not a valid domain';
    }
};

const validateEmail = (email) => {
    const constraints = {
        email: {
            emailWithDomain: {
                message: 'is not a valid email'
            }
        }
    };

    return validate.validate({ email }, constraints) === undefined;
};

export default validateEmail;


