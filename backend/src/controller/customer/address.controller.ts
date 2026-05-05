import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { User } from "../../models/User.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { successResponse } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
import { log } from "node:console";

type AddressItem = {
  _id?: string;
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

function mappedAddress(item: AddressItem) {
  return {
    _id: String(item._id || ""),
    fullName: item.fullName,
    address: item.address,
    state: item.state,
    postalCode: item.postalCode,
    isDefault: item.isDefault,
  };
}

export const getCustomerAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const user = await User.findById(dbUser._id);

    const foundUser = requireFound(user, "User not Found on DB");

    const address = (foundUser.addresses || []) as AddressItem[];

    const items = [...address]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mappedAddress);

    res.json(successResponse({ items }));
  },
);

export const addCustomerAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();

    requireText(fullName, "Full Name is Required");
    requireText(address, "Address is Required");
    requireText(state, "State is Required");
    requireText(postalCode, "Postal Code is Required");

    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not Found on DB");
    const addresses = (foundUser.addresses || []) as AddressItem[];

    const shouldMarkDefault =
      req.body.isDefault === true || addresses.length === 0;

    if (shouldMarkDefault) {
      addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    addresses.push({
      fullName,
      address,
      state,
      postalCode,
      isDefault: shouldMarkDefault,
    });

    foundUser.save();
    const items = [...addresses]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mappedAddress);

    res.json(successResponse({ items }));
  },
);

export const updateCustomerAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId).trim();
    requireText(addressId, "Address Id is Required");
    const fullName = String(req.body.fullName || "").trim();
    const address = String(req.body.address || "").trim();
    const state = String(req.body.state || "").trim();
    const postalCode = String(req.body.postalCode || "").trim();

    requireText(fullName, "Full Name is Required");
    requireText(address, "Address is Required");
    requireText(state, "State is Required");
    requireText(postalCode, "Postal Code is Required");

    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not Found on DB");
    const addresses = (foundUser.addresses || []) as AddressItem[];

    const getAddressTheUserWantToUpdate = addresses.find((currentAddress) => {
      currentAddress._id === addressId;
    });

    if (!getAddressTheUserWantToUpdate) {
      throw new AppError(404, "Address is not found");
    }
    const shouldMarkDefault =
      req.body.isDefault === true || addresses.length === 0;

    if (shouldMarkDefault) {
      addresses.forEach((item) => {
        item.isDefault = false;
      });
    }
    getAddressTheUserWantToUpdate.fullName = fullName;
    getAddressTheUserWantToUpdate.address = address;
    getAddressTheUserWantToUpdate.state = state;
    getAddressTheUserWantToUpdate.postalCode = postalCode;

    foundUser.save();
    const items = [...(foundUser.addresses as AddressItem[])]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mappedAddress);

    res.json(successResponse({ items }));
  },
);
export const deleteAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.params.addressId).trim();
    requireText(addressId, "Address Id is Required");

    const user = await User.findById(dbUser._id);
    const foundUser = requireFound(user, "User not Found on DB");
    const addresses = (foundUser.addresses || []) as AddressItem[];

    const adressesUserWantToDeleted = addresses.findIndex(
      (currentAddress) => String(currentAddress._id) === addressId,
    );

    if (!adressesUserWantToDeleted) {
      throw new AppError(404, "Address Not Found");
    }
    const wasDefault = addresses[adressesUserWantToDeleted].isDefault;
    addresses.splice(adressesUserWantToDeleted, 1);
    if (
      wasDefault &&
      addresses.length &&
      !addresses.some((address) => address.isDefault)
    ) {
      addresses[0].isDefault = true;
    }
    foundUser.save();
    const items = [...(foundUser.addresses as AddressItem[])]
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      .map(mappedAddress);

    res.json(successResponse({ items }));
  },
);
