const express = require('express');
const bodyParser = require('body-parser');
const { errorHandler, sendSuccessResponse } = require('./middleware/responseHandler');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/postRoutes');

const app = express();
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);



const PORT = process.env.PORT || 3000;
app.use(errorHandler);
app.use(sendSuccessResponse);

app.listen(PORT, () =>
{
  console.log(`Server is running on port ${PORT}`);
});
