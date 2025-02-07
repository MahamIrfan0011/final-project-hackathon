
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sanityClient } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

interface Color {
  colorName: string;
  imageUrl: {
    asset: {
      _ref: string;
    };
  };
}

interface Review {
  rating: number;
  comment: string;
  author: string;
  _key?: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceWithoutDiscount?: number;
  discount?: number;
  badge?: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  inventory: number;
  category: {
    _ref: string;
    _type: string;
  };
  tags?: string[];
  colors?: Color[];
  reviews?: Review[];
}

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<Review>({ rating: 0, comment: '', author: '' });

  const builder = imageUrlBuilder(sanityClient);

  const urlFor = (source: { asset: { _ref: string } } | undefined): string =>  {
    if (!source?.asset?._ref) {;
    return '/placeholder-image.jpg';
  };
  return builder.image(source.asset._ref).url();
}
  useEffect(() => {
    if (!id) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    const query = `*[_type == "products" && _id == $id][0]{
      _id,
      title,
      description,
      price,
      priceWithoutDiscount,
      discount,
      badge,
      image {
        asset {
          _ref
        }
      },
      inventory,
      category->,
      tags,
      colors[] {
        colorName,
        imageUrl {
          asset {
            _ref
          }
        }
      },
      reviews[] {
        rating,
        comment,
        author,
        _key
      }
    }`;

    sanityClient
      .fetch(query, { id })
      .then((data) => {
        console.log('Fetched Product Data:', data);
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleReviewSubmit = () => {
    // Implement the review submission logic here (e.g., updating the product in Sanity)
    if (newReview.rating && newReview.comment && newReview.author) {
      const updatedReviews = [...(product?.reviews || []), newReview];
      setProduct((prevProduct) => prevProduct ? { ...prevProduct, reviews: updatedReviews } : null);
      setNewReview({ rating: 0, comment: '', author: '' });
      alert('Review submitted successfully!');
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image with Badge */}
        <div className="flex-1 relative">
          {product?.badge && (
            <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white px-3 py-1 rounded-full">
              {product.badge}
            </div>
          )}
          {product?.image && urlFor(product.image) ? (
            <img
              src={urlFor(product.image)}
              alt={product.title}
              className="w-full max-w-[500px] h-auto rounded-3xl shadow-lg mt-10"
            />
          ) : (
            <div className="w-full max-w-[500px] h-[500px] rounded-3xl shadow-lg mt-10 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 mt-10 md:mt-28">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product?.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{product?.description}</p>

          {/* Price Section */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-bold text-gray-800">
              ${product?.price?.toFixed(2)}
            </p>
            {product?.priceWithoutDiscount && (
              <p className="text-lg text-gray-400 line-through">
                ${product.priceWithoutDiscount.toFixed(2)}
              </p>
            )}
            {product?.discount && (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Inventory Status */}
          <div className="mb-6">
            <p className={`text-sm ${product?.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product?.inventory > 0
                ? `${product.inventory} units in stock`
                : 'Out of stock'}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              alert(`${product?.title} added to cart!`);
            }}
            disabled={!product?.inventory || product.inventory <= 0}
            className={`mt-8 w-full md:w-auto px-8 py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2
              ${product?.inventory > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            {product?.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Tags */}
          {product?.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
        <div className="mt-6">
          {/* Display existing reviews */}
          {product?.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={review._key || index} className="border-b py-4">
                <p className="text-gray-800 font-medium">{review.author}</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="text-gray-500 text-sm">({review.rating})</span>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Review Form */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Add a Review</h3>
          <div className="mt-4">
            <label htmlFor="author" className="block text-gray-600">Your Name</label>
            <input
              type="text"
              id="author"
              className="w-full p-3 border rounded-lg mt-2"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="rating" className="block text-gray-600">Rating</label>
            <select
              id="rating"
              className="w-full p-3 border rounded-lg mt-2"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            >
              <option value="0">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="comment" className="block text-gray-600">Comment</label>
            <textarea
              id="comment"
              className="w-full p-3 border rounded-lg mt-2"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </div>
          <button
            onClick={handleReviewSubmit}
            className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-lg"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
