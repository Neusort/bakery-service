const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { DATABASE_CONFIG } = require('./config');

let pool;

async function connectToDatabase() {
    try {
         pool = mysql.createPool(DATABASE_CONFIG);
        console.log("Successfully connected to database");
      } catch (err) {
        console.error('Failed to connect to the database', err);
        throw err;
      }
}
async function closeDatabase() {
    if(pool){
        await pool.end();
        console.log("Database pool closed");
    }
}
async function executeQuery(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Item functions
async function getItems() {
    return executeQuery("SELECT * FROM items");
}
async function getItemById(itemId){
    return executeQuery("SELECT * FROM items WHERE id = ?", [itemId]);
}
async function searchItems(query) {
    return executeQuery("SELECT * FROM items WHERE name LIKE ?", [`%${query}%`]);
}
async function addItem(item) {
    const { name, description, price, dietaryInfo } = item;
    const sql = "INSERT INTO items (name, description, price, dietaryInfo) VALUES (?, ?, ?, ?)";
    const result = await executeQuery(sql, [name, description, price, dietaryInfo]);
    return { id: result.insertId, ...item };
}
async function updateItem(itemId, updates) {
    const { name, description, price, dietaryInfo } = updates;
    const sql = "UPDATE items SET name = ?, description = ?, price = ?, dietaryInfo = ? WHERE id = ?";
    await executeQuery(sql, [name, description, price, dietaryInfo, itemId]);
    return { id: itemId, ...updates };
}
async function deleteItem(itemId) {
    return executeQuery("DELETE FROM items WHERE id = ?", [itemId]);
}


// Review functions
async function getReviews(itemId) {
  return executeQuery("SELECT * FROM reviews WHERE itemId = ?", [itemId]);
}
async function addReview(review) {
  const { itemId, customerId, text, rating } = review;
  const sql = "INSERT INTO reviews (itemId, customerId, text, rating) VALUES (?, ?, ?, ?)";
  const result = await executeQuery(sql, [itemId, customerId, text, rating]);
  return { id: result.insertId, ...review };
}


// Order functions
async function addOrder(order) {
    const { customerId, items, totalAmount, orderDate, status } = order;
    const sql = "INSERT INTO orders (customerId, items, totalAmount, orderDate, status) VALUES (?, ?, ?, ?, ?)";
    const result = await executeQuery(sql, [customerId, JSON.stringify(items), totalAmount, orderDate, status]);
    return { id: result.insertId, ...order };
}
async function getOrders() {
    return executeQuery("SELECT * FROM orders");
}
async function getOrderById(orderId){
    return executeQuery("SELECT * FROM orders WHERE id = ?", [orderId]);
}
async function getOrdersByCustomer(customerId){
  return executeQuery("SELECT * FROM orders WHERE customerId = ?", [customerId]);
}
async function updateOrder(orderId, updates) {
    const { items, totalAmount, orderDate, status } = updates;
    const sql = "UPDATE orders SET items = ?, totalAmount = ?, orderDate = ?, status = ? WHERE id = ?";
    await executeQuery(sql, [JSON.stringify(items), totalAmount, orderDate, status, orderId]);
    return { id: orderId, ...updates };
}

//Baking class functions
async function getBakingClasses() {
    return executeQuery("SELECT * FROM baking_classes");
}
async function addBakingClass(bakingClass) {
    const { name, description, date, time, capacity } = bakingClass;
    const sql = "INSERT INTO baking_classes (name, description, date, time, capacity) VALUES (?, ?, ?, ?, ?)";
    const result = await executeQuery(sql, [name, description, date, time, capacity]);
    return { id: result.insertId, ...bakingClass };
}
async function updateBakingClass(classId, updates) {
    const { name, description, date, time, capacity } = updates;
    const sql = "UPDATE baking_classes SET name = ?, description = ?, date = ?, time = ?, capacity = ? WHERE id = ?";
    await executeQuery(sql, [name, description, date, time, capacity, classId]);
    return { id: classId, ...updates };
}
async function deleteBakingClass(classId) {
    return executeQuery("DELETE FROM baking_classes WHERE id = ?", [classId]);
}
module.exports = {
    connectToDatabase,
    closeDatabase,
    getItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    searchItems,
    getReviews,
    addReview,
    addOrder,
    getOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrder,
    getBakingClasses,
    addBakingClass,
    updateBakingClass,
    deleteBakingClass,
    executeQuery
};
