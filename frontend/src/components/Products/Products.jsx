"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isGuest } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.PRODUCT_SERVICE_URL || 'http://localhost:8000'}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  if (loading) {
    return <div className="text-center p-8">Laden...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {isGuest && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
          Sie sind als Gast angemeldet. Sie können Produkte in den Warenkorb legen und ohne Registrierung bestellen.
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-8">Unsere Produkte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">€{product.price}</span>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}