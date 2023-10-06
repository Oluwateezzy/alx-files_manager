const express = require('express');
const route = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/', route);

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});
