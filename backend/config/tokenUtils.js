import crypto from "crypto";

const tokenStore = {};

const generateResetToken = (email) => {
  const token = crypto.randomBytes(48).toString("hex");
  const expiry = Date.now() + 5 * 60 * 1000;
  tokenStore[token] = { email, expiry };
  return token;
};

const verifyResetToken = (token) => {
  const tokenData = tokenStore[token];
  if (!tokenData) {
    return null;
  }

  const { email, expiry } = tokenData;

  if (Date.now() > expiry) {
    delete tokenStore[token];
    return null;
  }

  return email;
};

export { generateResetToken, verifyResetToken };
