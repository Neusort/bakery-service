import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getItemById, getBakingClasses, addOrder, getOrdersByCustomer, submitReview, getReviews } from './api';


export function ItemList({ items, onAddToBasket }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const navigate = useNavigate();
  useEffect(() => {
    if(searchQuery){
      const searchResults = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(searchResults);
    } else{
      setFilteredItems(items);
    }
  }, [items, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  }
  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  }
    return (
      <div>
        <input type="text" placeholder="Search Items" value={searchQuery} onChange={handleSearch} />
          <h2>Available Treats</h2>
          <div className="item-list">
                {filteredItems.map(item => (
                    <div key={item.id} className='item-card' >
                        <h3 onClick={() => handleItemClick(item.id)}>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Price: ${item.price}</p>
                        <button onClick={() => onAddToBasket(item)}>Add to Basket</button>
                        <Link to={`/reviews/${item.id}`}>Add Review</Link>
                    </div>
                ))}
            </div>
      </div>
    );
}

export function ItemDetails({ onAddToBasket }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchItem = async () => {
        setLoading(true);
          try {
              const fetchedItem = await getItemById(id);
              setItem(fetchedItem[0]);
          } catch (error) {
              console.error("Error fetching item:", error)
          } finally{
            setLoading(false);
          }
      };
      fetchItem();
  }, [id]);
  if(loading) {
    return <div>Loading...</div>
  }
  if(!item) {
    return <div>Item not found</div>
  }
    return (
        <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Dietary Info: {item.dietaryInfo}</p>
            <button onClick={() => onAddToBasket(item)}>Add to Basket</button>
            <Link to={`/reviews/${item.id}`}>Add Review</Link>
        </div>
    );
}

export function ShoppingBasket({ basket, onRemoveFromBasket, total }) {
    const navigate = useNavigate();
    const handleCheckout = async () => {
      const order = {
        customerId: 1,
        items: basket,
        totalAmount: total,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };
        try {
           await addOrder(order);
          alert('Order placed Successfully');
          navigate('/order-history');
        } catch (error) {
          console.error("Error placing order:", error)
          alert('Failed to place order')
        }
    }
    return (
      <div>
        <h2>Shopping Basket</h2>
            {basket.length === 0 ? (
                    <p>Your basket is empty.</p>
                ) : (
                  <div>
                  <ul>
                      {basket.map(item => (
                          <li key={item.id}>
                              {item.name} - ${item.price}
                              <button onClick={() => onRemoveFromBasket(item.id)}>Remove</button>
                          </li>
                      ))}
                  </ul>
                  <p>Total: ${total.toFixed(2)}</p>
                  <button onClick={handleCheckout}>Checkout</button>
                </div>
                )}
      </div>
    );
}
export function BakingClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchBakingClasses = async () => {
        setLoading(true);
        try {
          const fetchedClasses = await getBakingClasses();
          setClasses(fetchedClasses);
        } catch (error) {
            console.error("Error fetching baking classes:", error);
        } finally{
          setLoading(false);
        }
      }
      fetchBakingClasses();
  }, []);
  if(loading) {
    return <div>Loading...</div>
  }
    return (
      <div>
        <h2>Baking Classes</h2>
          {classes.length > 0 ? (
              <ul>
                {classes.map((bakingClass) => (
                  <li key={bakingClass.id}>
                    <h3>{bakingClass.name}</h3>
                    <p>{bakingClass.description}</p>
                    <p>Date: {bakingClass.date}</p>
                    <p>Time: {bakingClass.time}</p>
                    <p>Capacity: {bakingClass.capacity}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes available.</p>
            )}
      </div>
    );
}
export function SignUp() {
    return (
        <div>
            <h2>Sign up</h2>
            <p>Sign up component under construction</p>
        </div>
    );
}
export function Login() {
    return (
        <div>
            <h2>Login</h2>
            <p>Login Component under construction</p>
        </div>
    );
}
export function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
          setLoading(true);
          try {
            const fetchedOrders = await getOrdersByCustomer(1);
            setOrders(fetchedOrders);
          } catch (error) {
            console.error("Error fetching order history:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchOrders();
    }, []);
    if(loading) {
      return <div>Loading...</div>
    }
    return(
        <div>
            <h2>Order History</h2>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Date: {order.orderDate}</p>
                            <p>Total: ${order.totalAmount}</p>
                            <p>Status: {order.status}</p>
                            <ul>
                                {JSON.parse(order.items).map(item => (
                                    <li key={item.id}>
                                      {item.name} - ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No order history found</p>
            )}
        </div>
    );
}

export function AddReview() {
    const { itemId } = useParams();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const fetchedReviews = await getReviews(itemId);
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [itemId]);
  const handleSubmit = async () => {
    const review = {
      itemId: itemId,
      customerId: 1,
      text: reviewText,
      rating: rating,
    };
    try {
      await submitReview(review);
      alert('Review added successfully');
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };
  if(loading){
    return <div>Loading...</div>
  }
  return (
    <div>
      <h2>Reviews</h2>
        {reviews.length > 0 ? (
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        <p>{review.text}</p>
                        <p>Rating: {review.rating}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No review yet</p>
        )}
      <h2>Add a review</h2>
      <div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        />
      </div>
      <div>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  );
}
