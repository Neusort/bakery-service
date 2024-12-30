const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { executeQuery } = require('./database');
const { JWT_SECRET } = require('./config');

async function registerUser(user) {
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const result = await executeQuery(sql, [name, email, hashedPassword]);
    return { id: result.insertId, name, email };
}
async function loginUser(email, password) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const users = await executeQuery(sql, [email]);
    if (users.length === 0) {
      throw new Error("User not found");
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
}
async function getUserById(userId){
  const users = await executeQuery("SELECT id, name, email FROM users WHERE id = ?", [userId]);
  return users[0];
}
function authenticateToken(req, res, next) {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = {
    registerUser,
    loginUser,
    authenticateToken,
    getUserById
};
