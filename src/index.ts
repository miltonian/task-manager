require('dotenv').config();
const path = require('path');
import express from 'express';

import app from './app';

// Start the web service
const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Listening on ${port}`);
});

export default server;
