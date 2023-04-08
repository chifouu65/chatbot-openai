import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import openai from './routes/openai.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limig: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use('/api/v1/openai', openai);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from DALL.E" })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
