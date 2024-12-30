import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { getItems, addItemToBasket, removeItemFromBasket, getBasketTotal } from './api';
import {ItemList, ItemDetails, ShoppingBasket, BakingClasses, SignUp, Login, OrderHistory, AddReview} from './components';

function App() {

    const [items, setItems] = useState([]);
    const [basket, setBasket] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally{
        setLoading(false);
      }
    };
    const handleAddToBasket = async (item) => {
      setBasket(await addItemToBasket(item, basket));
    }
    const handleRemoveFromBasket = async (itemId) => {
      setBasket(await removeItemFromBasket(itemId, basket));
    };
    const basketTotal = getBasketTotal(basket);
    
    if(loading){
      return <div>Loading...</div>
    }
    return (
      <BrowserRouter>
      <div>
          <nav>
              <ul>
                  <li>
                      <Link to="/">Items</Link>
                  </li>
                  <li>
                      <Link to="/basket">Basket</Link>
                  </li>
                  <li>
                      <Link to="/baking-classes">Baking Classes</Link>
                  </li>
                  <li>
                      <Link to="/order-history">Order History</Link>
                  </li>
              </ul>
              <div>
                <Link to="/signup">Sign up</Link> | <Link to="/login">Login</Link>
              </div>
          </nav>
          <Routes>
              <Route path="/" element={<ItemList items={items} onAddToBasket={handleAddToBasket} />} />
              <Route path="/item/:id" element={<ItemDetails onAddToBasket={handleAddToBasket} />} />
              <Route path="/basket" element={<ShoppingBasket basket={basket} onRemoveFromBasket={handleRemoveFromBasket} total={basketTotal} />} />
              <Route path="/baking-classes" element={<BakingClasses />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reviews/:itemId" element={<AddReview />} />
          </Routes>
      </div>
    </BrowserRouter>
    );
}

export default App;
