const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const {addUser,getUser} = require('./users/users');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors : {
        origin : '*'
    }
});

const port = 3001;



const cors = require('cors');
const routes = require('./routes/routes');
const connectDB = require('./db/connection');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb',extended : true,parameterLimit : 50000}));


require('dotenv').config();



app.use(express.json());

app.use(cors());
app.use('/',routes);




io.on('connection',(socket) => {
    
    socket.on('join_room',(room) => {
        socket.join(room);
    })

    socket.on('user_joined',(msg) => {
        addUser(socket.id,msg);
        socket.to(msg[2]).emit('user_joined',msg[0] + " has joined the chat");
    })

    socket.on('send_message',(msg) => {
        const user = getUser(socket.id);
        socket.to(user[2]).emit('recieve_message',msg,user);
    })

    

})


const startApp = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        httpServer.listen(port,console.log(`server is listening on port ${port}`));
    } catch (error){
        console.log(error);
    }
}
startApp();
