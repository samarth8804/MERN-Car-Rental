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
