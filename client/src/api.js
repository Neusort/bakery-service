const API_BASE_URL = 'http://localhost:5000';

export async function getItems() {
    const response = await fetch(\`\${API_BASE_URL}/items\`);
    if (!response.ok) {
        throw new Error(\`Failed to fetch items: \${response.status}\`);
    }
    return await response.json();
}
export async function getItemById(itemId) {
  const response = await fetch(\`\${API_BASE_URL}/items/\${itemId}\`);
    if (!response.ok) {
        throw new Error(\`Failed to fetch item: \${response.status}\`);
    }
    return await response.json();
}
export async function getBakingClasses() {
    const response = await fetch(\`\${API_BASE_URL}/baking-classes\`);
    if (!response.ok) {
        throw new Error(\`Failed to fetch classes: \${response.status}\`);
    }
    return await response.json();
}
export async function addItemToBasket(item, basket) {
  return [...basket, item];
}
export async function removeItemFromBasket(itemId, basket) {
  return basket.filter(item => item.id !== itemId);
}
export function getBasketTotal(basket) {
  return basket.reduce((total, item) => total + item.price, 0);
}
export async function addOrder(order) {
    const response = await fetch(\`\${API_BASE_URL}/orders\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error(\`Failed to place order: \${response.status}\`);
    }
    return await response.json();
}
export async function getOrdersByCustomer(customerId) {
    const response = await fetch(\`\${API_BASE_URL}/orders/customer/\${customerId}\`);
    if (!response.ok) {
        throw new Error(\`Failed to fetch order history: \${response.status}\`);
    }
    return await response.json();
}
export async function submitReview(review) {
    const response = await fetch(\`\${API_BASE_URL}/reviews\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit review: ${response.status}`);
    }
    return await response.json();
  }
  export async function getReviews(itemId) {
    const response = await fetch(`\${API_BASE_URL}/reviews/\${itemId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }
    return await response.json();
  }
