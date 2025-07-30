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

// ✅ Fixed Indian License Number Validation
exports.validateLicenseNumber = (licenseNumber) => {
  // Indian License Format: AB12 2023 1234567 (15 characters total)
  // State Code (2 letters) + RTO Code (2 digits) + Issue Year (4 digits) + Serial Number (7 digits)
  const regex = /^[A-Z]{2}\d{2}\d{4}\d{7}$/;

  if (!regex.test(licenseNumber)) {
    return false;
  }

  // ✅ Fixed year validation - only allow past and current year
  const currentYear = new Date().getFullYear();
  const issueYear = parseInt(licenseNumber.substring(4, 8));

  // License can't be issued before 1980 or in the future
  if (issueYear < 1980 || issueYear > currentYear) {
    return false;
  }

  return true;
};

const dns = require("dns").promises;

// ✅ ENHANCED: Smart MX validation with trusted domains and timeout
exports.validateDomainMX = async (email) => {
  const domain = email.split("@")[1].toLowerCase();

  // ✅ Whitelist of trusted email providers - always pass validation
  const trustedDomains = [
    // Major providers
    "gmail.com",
    "googlemail.com",
    "yahoo.com",
    "yahoo.co.in",
    "yahoo.co.uk",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "msn.com",
    "icloud.com",
    "me.com",
    "mac.com",
    "aol.com",
    "aim.com",

    // Business/Professional
    "protonmail.com",
    "proton.me",
    "yandex.com",
    "yandex.ru",
    "mail.com",
    "email.com",
    "zoho.com",
    "zohomail.com",
    "tutanota.com",

    // Regional providers
    "rediffmail.com",
    "sify.com",
    "in.com",
    "naver.com",
    "daum.net",
    "hanmail.net",
    "qq.com",
    "163.com",
    "126.com",
    "mail.ru",
    "yandex.by",

    // Educational
    "edu",
    "ac.in",
    "edu.in",
    "ac.uk",
    "edu.au",
  ];

  // ✅ Check if domain is in trusted list
  const isTrusted = trustedDomains.some(
    (trusted) => domain === trusted || domain.endsWith("." + trusted)
  );

  if (isTrusted) {
    return true;
  }

  // ✅ For unknown domains, perform MX lookup with timeout and fallback
  try {
    // Set timeout for DNS lookup (3 seconds)
    const mxLookup = dns.resolveMx(domain);
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DNS_TIMEOUT")), 3000)
    );

    const records = await Promise.race([mxLookup, timeout]);
    const isValid = records && records.length > 0;

    return isValid;
  } catch (error) {
    console.warn(`⚠️ MX lookup failed for ${domain}:`, error.message);

    // ✅ Fallback: Basic domain format validation
    const isValidFormat =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        domain
      );
    const hasValidTLD =
      domain.includes(".") && domain.split(".").pop().length >= 2;
    const fallbackValid = isValidFormat && hasValidTLD;

    return fallbackValid;
  }
};
