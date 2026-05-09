import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/envelope.js";
import { Product, ProductSize } from "../../models/Product.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { Cart, CartItem } from "../../models/Cart.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";
import { Wishlist, WishlistDocument } from "../../models/Wishlist.js";
import { Types } from "mongoose";

type ProductPreview = {
  _id: string;
  title: string;
  brand: string;
  price: number;
  salePercentage: number;
  images: Array<{
    url: string;
    isCover?: boolean;
  }>;
};

type CartItemPreview = {
  product: ProductPreview | null;
  quantity: number;
  color?: string;
  size?: ProductSize;
};

type SyncCartItem = {
  productId?: string;
  quantity?: number;
  color?: string;
  size?: ProductSize;
};

function formatProduct(product: ProductPreview) {
  const image =
    product.images.find((image) => image.isCover)?.url ||
    product.images[0]?.url;

  const finalPrice = product.salePercentage
    ? Math.round(product.price - (product.price * product.salePercentage) / 100)
    : product.price;

  return {
    productId: String(product._id),
    title: product.title,
    brand: product.brand,
    price: product.price,
    image,
    finalPrice,
  };
}

async function getCartResponse(userId: string) {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title brand price salePercentage images",
  );
  const cartItems = (cart?.items || []) as unknown as CartItemPreview[];

  const items = cartItems.flatMap((cartItem) => {
    if (!cartItem.product) return [];

    return [
      {
        ...formatProduct(cartItem.product),
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
      },
    ];
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalQuantity,
  };
}

async function getWishlistResponse(userId: string) {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "title brand price salePercentage images",
  );
  const products = (wishlist.product || []) as Array<ProductPreview | null>;

  const items = products.flatMap((productItem) => {
    if (!productItem) return [];

    return [formatProduct(productItem)];
  });

  return {
    items,
  };
}
function getSelectedVariant(
  product: { color: string[]; size: string[] },
  colorValue: string,
  sizeValue: string,
) {
  let color: string | undefined;
  let size: ProductSize | undefined;

  if (product.color.length > 0) {
    if (!colorValue) {
      throw new AppError(400, "color is required");
    }
    if (!product.color.includes(colorValue)) {
      throw new AppError(400, "selected color is invalid");
    }
    color = colorValue;
  }
  if (product.size.length > 0) {
    if (!sizeValue) {
      throw new AppError(400, "Size is required");
    }
    if (!product.size.includes(sizeValue)) {
      throw new AppError(400, "selected Size is invalid");
    }
    size = sizeValue as ProductSize;
  }
  return { color, size };
}

function isSameCartItem(
  item: CartItem,
  productId: string,
  color?: string,
  size?: string,
) {
  return (
    String(item.product) === productId &&
    (item.color || "") === (color || "") &&
    (item.size || "") === (size || "")
  );
}
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const dbUser = await getDbUserFromReq(req);

  res.json(successResponse(await getCartResponse(String(dbUser._id))));
});

export const addToCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const quantity = Number(req.body.quantity || 1);
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product Id is required");

    if (Number.isNaN(quantity) || quantity < 1) {
      throw new AppError(400, "Quantity must be at least 1");
    }
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });
    const foundProduct = requireFound(product, "Product not Found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    if (quantity > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }
    let cart = await Cart.findOne({ user: dbUser._id });

    if (!cart) {
      cart = await Cart.create({
        user: dbUser._id,
        items: [],
      });
    }
    const itemIndex = cart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex !== -1) {
      const nextQuantity = cart.items[itemIndex].quantity + quantity;

      if (nextQuantity > foundProduct.stock) {
        throw new AppError(400, "Quantity is more than the stock ");
      }

      cart.items[itemIndex].quantity = nextQuantity;
    } else {
      cart.items.push({
        product: foundProduct._id,
        quantity,
        color,
        size,
      });
    }
    await cart.save();
    res.json(successResponse(await getCartResponse(String(dbUser._id))));
  },
);

export const increaseCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product Id is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart is not found", 404);
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });
    const foundProduct = requireFound(product, "Product not Found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = foundCart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here ");
    }
    if (foundCart.items[itemIndex].quantity + 1 > foundProduct.stock) {
      throw new AppError(
        400,
        "Quantity is more than the stock of this product",
      );
    }

    foundCart.items[itemIndex].quantity += 1;

    await foundCart.save();
    res.json(successResponse(await getCartResponse(String(dbUser._id))));
  },
);

export const decreaseCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();

    requireText(productId, "Product Id is required");

    const cart = await Cart.findOne({ user: dbUser._id });
    const foundCart = requireFound(cart, "Cart is not found", 404);
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });
    const foundProduct = requireFound(product, "Product not Found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    const itemIndex = foundCart.items.findIndex((item: CartItem) =>
      isSameCartItem(item, String(foundProduct._id), color, size),
    );

    if (itemIndex < 0) {
      throw new AppError(400, "Cart item not found here ");
    }

    if (foundCart.items[itemIndex].quantity <= 0) {
      foundCart.items.splice(itemIndex, 1);
    } else {
      foundCart.items[itemIndex].quantity -= 1;
    }

    await foundCart.save();
    res.json(successResponse(await getCartResponse(String(dbUser._id))));
  },
);

export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const productId = String(req.body.productId || "").trim();
    const colorValue = String(req.body.color || "").trim();
    const sizeValue = String(req.body.size || "").trim();
    requireText(productId, "Product Id is required");
    const cart = await Cart.findOne({ user: dbUser._id });
    if (!cart) {
      res.json(
        successResponse({
          items: [],
          totalQuantity: 0,
        }),
      );
      return;
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });
    const foundProduct = requireFound(product, "Product not Found", 404);

    const { color, size } = getSelectedVariant(
      foundProduct,
      colorValue,
      sizeValue,
    );

    cart.items = cart.items.filter(
      (item: CartItem) => !isSameCartItem(item, productId, color, size),
    );

    await cart.save();
    res.json(successResponse(await getCartResponse(String(dbUser._id))));
  },
);

export const syncCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const incommingItem = Array.isArray(req.body.items)
      ? (req.body.items as SyncCartItem[])
      : [];

    let cart = await Cart.findOne({ user: dbUser._id });
    if (!cart) {
      cart = await Cart.create({
        user: dbUser._id,
        items: [],
      });
    }

    for (const rawItem of incommingItem) {
      const productId = String(rawItem.productId || "").trim();
      const quantity = Number(rawItem.quantity || 1);
      const colorValue = String(rawItem.color || "").trim();
      const sizeValue = String(rawItem.size || "").trim();

      if (!productId || Number.isNaN(quantity) || quantity < 1) continue;

      const product = await Product.findOne({
        _id: productId,
        status: "active",
      });

      if (!product || product.stock < 1) continue;

      try {
        const { color, size } = getSelectedVariant(
          product,
          colorValue,
          sizeValue,
        );

        const itemIndex = cart.items.findIndex((item: CartItem) =>
          isSameCartItem(item, String(product._id), color, size),
        );

        if (itemIndex >= 0) {
          const nextQuantity = cart.items[itemIndex].quantity + quantity;
          cart.items[itemIndex].quantity = Math.min(
            nextQuantity,
            product.stock,
          );
        } else {
          cart.items.push({
            product: product._id,
            quantity: Math.min(quantity, product.stock),
            color,
            size,
          });
        }
      } catch {
        continue;
      }
    }
    await cart.save();
    res.json(successResponse(await getCartResponse(String(dbUser._id))));
  },
);

//wish list logic

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const dbUser = await getDbUserFromReq(req);

  res.json(successResponse(await getWishlistResponse(String(dbUser._id))));
});

export const addWishListItem = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    //get ProductId
    const productId = String(req.body.productId || "").trim();

    requireText(productId, "Product id is required");

    //find product
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });
    const foundProduct = requireFound(product, "Product not Found", 404);

    let wishlist = await Wishlist.findById<WishlistDocument>({
      user: dbUser._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: dbUser._id,
        products: [],
      });
    }

    const exists = wishlist?.products.some(
      (item: Types.ObjectId) => String(item) === String(foundProduct._id),
    );
    if (!exists) {
      wishlist?.products.push(foundProduct._id);
      await wishlist?.save();
    }
    res.json(successResponse(await getWishlistResponse(String(dbUser._id))));
  },
);
