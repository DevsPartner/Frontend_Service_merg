const RECOMMENDER_SERVICE_URL = process.env.RECOMMENDER_SERVICE_URL || 'http://localhost:8006';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    
    if (!customerId) {
      return Response.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const limit = searchParams.get('limit') || 6;

    const response = await fetch(`${RECOMMENDER_SERVICE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        limit: parseInt(limit)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Recommender service error:', response.status, errorText);
      throw new Error('Failed to fetch recommendations');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return Response.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const response = await fetch(`${RECOMMENDER_SERVICE_URL}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to trigger training');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error triggering training:', error);
    return Response.json(
      { error: 'Failed to trigger model training' },
      { status: 500 }
    );
  }
}