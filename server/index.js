const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const connectDB = require('./db/connection');


require('dotenv').config();

const port = 3001;

app.use(express.json());

app.use(cors());
app.use('/',routes);


const startApp = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`server is listening on port ${port}`));
    } catch (error){
        console.log(error);
    }
}
startApp();