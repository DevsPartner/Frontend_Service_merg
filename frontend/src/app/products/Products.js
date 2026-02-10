'use client';
import { useState } from 'react';
import { useAuth } from '../Navbar/AuthContext';
import { cartApi } from '@/lib/cartApi';

// ProductCard component
function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    setLoading(true);
    try {
      await cartApi.addToCart(user.id, user.name, {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        image_link: product.image,
        quantity: 1,
      });
      
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}

// Main Products Page component
export default function ProductsPage() {
  // Your existing products code here
  return (
    <div>
      {/* Use ProductCard here for each product */}
    </div>
  );
}