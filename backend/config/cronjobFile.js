import cron from "node-cron";
import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";

const deleteUnverifiedUsers = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const userresult = await User.deleteMany({
      verified: false,
      createdAt: { $lte: fiveMinutesAgo },
    });
    const otpresult = await OTP.deleteMany({
      createdAt: { $lte: fiveMinutesAgo },
    });

    // console.log(`Deleted ${userresult.deletedCount} unverified users.`);
    // console.log(`Deleted ${otpresult.deletedCount} unused otps`);
  } catch (error) {
    console.error("Error deleting unverified users or otps:", error);
  }
};
cron.schedule("*/2 * * * *", deleteUnverifiedUsers);
