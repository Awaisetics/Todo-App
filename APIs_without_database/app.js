const express = require('express');
const { urlencoded } = require('express');
const cors = require('cors');
const todoAPIs = require('./routes/todoRoutes');

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use(todoAPIs);

app.use( (err , req , res , next) => {
  res.status(err.status).json({ error: true, message: err.message });
});

app.listen(3000 , () => console.log('Server Running at  Port 3000'));