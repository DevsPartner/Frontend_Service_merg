const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:8001';

export async function GET(request) {
  try {
    const userId = 'test-user'; // Temporary - we'll fix this with real auth later
    
    const response = await fetch(`${CART_SERVICE_URL}/cart/${userId}`);
    
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch cart' }, { status: response.status });
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Cart fetch error:', error);
    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;
    
    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    // Add userId for now - we'll use real authentication later
    const cartData = {
      productId,
      quantity: quantity || 1,
      userId: 'test-user' // Temporary
    };
    
    const response = await fetch(`${CART_SERVICE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.message || 'Failed to add to cart' }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}