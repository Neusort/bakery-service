const express = require('express');
const { getItems, addItem, updateItem, deleteItem, getItemById, searchItems } = require('./database');
const { getReviews, addReview } = require('./database');
const { addOrder, getOrders, updateOrder, getOrderById, getOrdersByCustomer } = require('./database');
const { registerUser, loginUser, getUserById } = require('./auth');
const { getBakingClasses, addBakingClass, updateBakingClass, deleteBakingClass } = require('./database');


const router = express.Router();

// Item routes
router.get('/items', async (req, res) => {
    const query = req.query.q;
    if (query) {
        try {
            const items = await searchItems(query);
            res.json(items);
        } catch (error) {
            console.error("Error searching items:", error);
            res.status(500).json({ error: 'Failed to search items' });
        }
    } else {
        try {
            const items = await getItems();
            res.json(items);
        } catch (error) {
            console.error("Error fetching items:", error);
            res.status(500).json({ error: 'Failed to fetch items' });
        }
    }
});
router.get('/items/:id', async (req, res) => {
    try {
        const item = await getItemById(req.params.id);
        if(item){
            res.json(item);
        } else{
            res.status(404).json({error: 'Item not found'});
        }
        
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});
router.post('/items', async (req, res) => {
    try {
        const item = req.body;
        const newItem = await addItem(item);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});
router.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const updates = req.body;
        const updatedItem = await updateItem(itemId, updates);
        res.json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});
router.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await deleteItem(itemId);
        res.status(200).json({message:'Item deleted successfully'});
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Review routes
router.get('/reviews/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
      const reviews = await getReviews(itemId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });
  router.post('/reviews', async (req, res) => {
    try {
        const review = req.body;
      const newReview = await addReview(review);
      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Failed to add review' });
    }
  });

// Order routes
router.post('/orders', async (req, res) => {
    try {
        const order = req.body;
      const newOrder = await addOrder(order);
      res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ error: 'Failed to add order' });
    }
});
router.get('/orders', async (req, res) => {
    try {
      const orders = await getOrders();
      res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
router.get('/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
      const order = await getOrderById(orderId);
      if(order){
        res.json(order);
      } else{
        res.status(404).json({error: 'Order not found'})
      }
      
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
router.get('/orders/customer/:customerId', async (req, res) => {
  try {
      const customerId = req.params.customerId;
    const orders = await getOrdersByCustomer(customerId);
    res.json(orders);
  } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: 'Failed to fetch order' });
  }
});
router.put('/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
      const updates = req.body;
      const updatedOrder = await updateOrder(orderId, updates);
      res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// User routes
router.post('/register', async (req, res) => {
    try {
      const user = req.body;
      const newUser = await registerUser(user);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await loginUser(email, password);
      res.json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  router.get('/users/:id', async (req, res) => {
      try{
        const userId = req.params.id;
        const user = await getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
      } catch(error){
        console.error("Error fetching user", error);
        res.status(500).json({ error: 'Failed to fetch user' });
      }
    
  })

  // Baking class routes
router.get('/baking-classes', async (req, res) => {
    try {
      const classes = await getBakingClasses();
      res.json(classes);
    } catch (error) {
        console.error("Error fetching baking classes:", error);
        res.status(500).json({ error: 'Failed to fetch baking classes' });
    }
});
router.post('/baking-classes', async (req, res) => {
    try {
        const bakingClass = req.body;
      const newBakingClass = await addBakingClass(bakingClass);
      res.status(201).json(newBakingClass);
    } catch (error) {
        console.error("Error adding baking class:", error);
        res.status(500).json({ error: 'Failed to add baking class' });
    }
});
router.put('/baking-classes/:id', async (req, res) => {
    try {
        const classId = req.params.id;
      const updates = req.body;
      const updatedClass = await updateBakingClass(classId, updates);
      res.json(updatedClass);
    } catch (error) {
        console.error("Error updating baking class:", error);
        res.status(500).json({ error: 'Failed to update baking class' });
    }
});
router.delete('/baking-classes/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        await deleteBakingClass(classId);
      res.status(200).json({ message: 'Baking class deleted successfully' });
    } catch (error) {
        console.error("Error deleting baking class:", error);
        res.status(500).json({ error: 'Failed to delete baking class' });
    }
});

module.exports = router;
