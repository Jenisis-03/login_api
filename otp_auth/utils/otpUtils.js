function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpExpiry() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);  // Changed from 15 to 10 minutes
    return now;
}

module.exports = { generateOtp, getOtpExpiry };