import { getNextSequence } from "./getNextSequence";

function twoDigitYear(date = new Date()) {
  return String(date.getFullYear()).slice(-2);
}

function twoDigitMonth(date = new Date()) {
  return String(date.getMonth() + 1).padStart(2, "0");
}

export async function generateUserId() {
  const next = await getNextSequence("user_id");
  return `AC${twoDigitYear()}${String(next).padStart(6, "0")}`;
}

export async function generateMembershipId() {
  const next = await getNextSequence("membership_id");
  return `VRPSU${twoDigitYear()}${String(next).padStart(5, "0")}`;
}

export async function generateDonationId() {
  const next = await getNextSequence("donation_id");
  return `DN${twoDigitYear()}${String(next).padStart(6, "0")}`;
}
