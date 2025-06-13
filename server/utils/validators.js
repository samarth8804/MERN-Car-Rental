exports.validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

exports.validatePhone = (phone) => {
  const regex = /^\d{10}$/; // Matches exactly 10 digits
  return regex.test(phone);
};

exports.validatePassword = (password) => {
  // At least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const dns = require("dns").promises;

exports.validateDomainMX = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
    // If MX records are found, the domain is valid for email
  } catch (error) {
    return false; // If there's an error, assume the domain is invalid
  }
};
