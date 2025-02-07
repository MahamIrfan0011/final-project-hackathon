import { sanityClient } from "@/sanity/lib/client";

export const fetchProductById = async (productId: string) => {
  return sanityClient.fetch(
    `*[_type == 'products' && _id == $productId][0]{
      _id,
      title,
      price,
      description,
      "image": image.asset->url
    }`,
    { productId }
  );
};
