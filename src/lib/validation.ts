import type { AddressDocument } from "@/src/models/Address";

export const MIN_AMOUNT = 99;

export function assertMinimumAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
    throw new Error(`Amount should be at least Rs. ${MIN_AMOUNT}`);
  }
}

export function isAddressComplete(address: Partial<AddressDocument> | null) {
  if (!address) return false;
  return Boolean(
    address.state &&
      address.district &&
      address.mandal &&
      address.village &&
      address.street &&
      address.pincode
  );
}

