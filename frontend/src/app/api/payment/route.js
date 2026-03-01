const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8002';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, orderId, amount, paymentMethod, guestId, returnUrl } = body;

    if (!email || !orderId || !amount) {
      return Response.json(
        { error: 'Email, orderId und amount sind erforderlich' },
        { status: 400 }
      );
    }

    // Forward to payment service
    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        order_id: orderId,
        amount,
        payment_method: paymentMethod,
        guest_id: guestId,
        return_url: returnUrl,
        currency: 'EUR'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.message || 'Fehler bei der Zahlungsinitialisierung' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Payment initiation error:', error);
    return Response.json(
      { error: 'Fehler bei der Zahlungsinitialisierung' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');

    let url = `${PAYMENT_SERVICE_URL}/api/payments`;
    if (paymentId) {
      url += `/${paymentId}`;
    } else if (orderId) {
      url += `?order_id=${orderId}`;
    }

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Fehler beim Abrufen des Zahlungsstatus' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Payment status error:', error);
    return Response.json(
      { error: 'Fehler beim Abrufen des Zahlungsstatus' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { paymentId, email } = body;

    if (!paymentId || !email) {
      return Response.json(
        { error: 'Payment ID und Email sind erforderlich' },
        { status: 400 }
      );
    }

    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments/${paymentId}/confirm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.message || 'Fehler bei der Zahlungsbestätigung' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return Response.json(
      { error: 'Fehler bei der Zahlungsbestätigung' },
      { status: 500 }
    );
  }
}