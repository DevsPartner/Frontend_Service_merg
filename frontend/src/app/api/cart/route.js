const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:8001';

// GET /api/cart?userId=123 OR /api/cart?guestId=guest_123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const guestId = searchParams.get('guestId');
    
    if (!userId && !guestId) {
      return Response.json({ items: [], total_amount: 0 });
    }

    const url = userId 
      ? `${CART_SERVICE_URL}/cart/${userId}`
      : `${CART_SERVICE_URL}/cart/guest/${guestId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return Response.json({ items: [], total_amount: 0 });
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Cart fetch error:', error);
    return Response.json({ items: [], total_amount: 0 }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, quantity, userId, guestId } = body;
    
    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const url = userId 
      ? `${CART_SERVICE_URL}/cart`
      : `${CART_SERVICE_URL}/cart/guest`;
    
    const payload = userId 
      ? { productId, quantity: quantity || 1, userId }
      : { guestId, product: { product_id: productId, quantity: quantity || 1 } };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return Response.json(
        { error: error.message || 'Failed to add to cart' }, 
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

// PUT /api/cart?guestId=123&productId=456
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const productId = searchParams.get('productId');
    const { quantity } = await request.json();
    
    if (!guestId || !productId) {
      return Response.json({ error: 'Guest ID and Product ID required' }, { status: 400 });
    }
    
    const response = await fetch(`${CART_SERVICE_URL}/cart/guest/${guestId}/item/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Update cart error:', error);
    return Response.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart?guestId=123&productId=456
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const productId = searchParams.get('productId');
    
    if (!guestId || !productId) {
      return Response.json({ error: 'Guest ID and Product ID required' }, { status: 400 });
    }
    
    const response = await fetch(`${CART_SERVICE_URL}/cart/guest/${guestId}/item/${productId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Remove from cart error:', error);
    return Response.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}