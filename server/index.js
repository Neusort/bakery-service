const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectToDatabase } = require('./database');
const { authenticateToken } = require('./auth');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.use(authenticateToken);
app.use('/', routes);

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
}

startServer();
