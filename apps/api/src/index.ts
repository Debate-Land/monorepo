import express from "express";
import cors from 'cors';
import { coreRouter } from "./routes";

// Config app
const app = express();
const port = 8080; // TODO: Support process.env.PORT here

// Set up 3rd party middleware
app.use(cors());

// Set up routers
app.use('/core', coreRouter)

// Status monitoring
app.get('/status', async (req, res) => res.status(200).send({ message: 'All systems operational' }));

// Start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
