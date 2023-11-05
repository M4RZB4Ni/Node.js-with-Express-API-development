const express = require('express');
const helmet = require("helmet");
const config = require('./server/config/index.js')[process.env.NODE_ENV || 'development'];
const bodyParser = require('body-parser');
const { errorHandler, handleServiceResponse } = require('./middleware/responseHandler');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/postRoutes');
const { development } = require('./server/config/index.js');

const log = config.log();

const app = express();
app.use(helmet());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);



const PORT = process.env.PORT || 3000;
app.use(errorHandler);
// app.use(handleServiceResponse);

app.listen(PORT, () =>
{
  log.info(`Server is running on port ${PORT}`);
});
