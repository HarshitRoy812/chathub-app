const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
var bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');


const {
    addUser,
    getUser,
    deleteUser,
    getUserCount,
    getUserStatus,
    getUsers} = require('./users/users');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors : {
        origin : '*'
    },
    maxHttpBufferSize : 1e7
});
const cors = require('cors');
// Security features
app.use(express.json());
app.use(cors());
app.use(helmet());
app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs : 15 * 60 * 1000,
max : 100
}));

app.use(bodyParser.urlencoded({limit : '500mb',extended : true,parameterLimit : 50000}));
app.use(bodyParser.json({limit : '500mb'}));



const routes = require('./routes/routes');
const connectDB = require('./db/connection');
app.use('/',routes);

const port = 3001;

require('dotenv').config();






io.on('connection',(socket) => {
    
    socket.on('join_room',(room) => {
        socket.join(room);
    })

    socket.on('user_joined',(msg) => {
        addUser(socket.id,msg);
        socket.to(msg[1]).emit('user_joined',msg[0] + " has joined the chat");
        const users = getUsers(msg[1]);
        socket.to(msg[1]).emit('users',users);
    })

    socket.on('send_message',(msg) => {

        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let time = hours + ":" + minutes;

        const user = getUser(socket.id);
        socket.to(user[1]).emit('receive_message',msg,user,time);
    })

    socket.on('send_pic',(msg) => {

        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let time = hours + ":" + minutes;

        const user = getUser(socket.id);
        socket.to(user[1]).emit('receive_pic',msg,user,time);

    })

    socket.on('clientDisconnect',() => {
        const user = getUser(socket.id);
        deleteUser(socket.id);
        socket.to(user[1]).emit('disconnected',user);
        socket.disconnect(true);
    })

    socket.on('getUserCountAlpha',() => {
        const count = getUserCount('Alpha');
        socket.emit('user_count_1',count);
    })

    socket.on('getUserCountBeta',() => {
        const count = getUserCount('Beta');
        socket.emit('user_count_2',count);

    })
    
    
    socket.on('getUserCountTetra',() => {
        const count = getUserCount('Tetra');
        socket.emit('user_count_3',count);
    })

    socket.on('get_status',(name) => {
        const isOnline = getUserStatus(name);

        socket.emit('user_status',isOnline,name);
    })
    socket.on('get_users',(room) => {

        const users = getUsers(room);
        socket.emit('users',users);
    })
    
    socket.on('send_video',(msg) => {
        
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let time = hours + ":" + minutes;

        const user = getUser(socket.id);
        socket.to(user[1]).emit('receive_video',msg,user,time);
    })

    socket.on('send_audio',(msg) => {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let time = hours + ":" + minutes;

        const user = getUser(socket.id);
        socket.to(user[1]).emit('receive_audio',msg,user,time);
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
