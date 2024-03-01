interface UserAccount {
    username:  string,
    id:     string 
    email:      string,
    name:      string, 
    password:    String,
}

interface Messageobj {
    user: String | undefined;
    message: string,
    socketId: string,
    recipient: string
}


const io = require('socket.io')(3000, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : 
        ['http://localhost:3001',],
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket: any) => {

    let userArray: string[] = [];
    let chatRooms: string[] = [];

    socket.on('messageEvent', (data: Messageobj) => {
        io.emit('replyEvent', true)
    })

    socket.on('userInfo', (data: {user: UserAccount, socketId: string} )=> {
        if(data){
            if(userArray.includes(data.user.username)){
                return;
            }
            userArray.push(data.user.username);

        }
    })

    socket.on('activeTyping', () => {
        io.emit('activeTypeMessage', true)
    })

    socket.on('JoinRoom', (data: {room: string, userId: string, create: boolean}, username: string) => {
        if(data.create){
            socket.chatRooms.create
        }
        socket.join(data.room);
        chatRooms.push(data.room)
        io.to(data.room).broadcast.emit(`${username} has entered the chat`);
    })
    
    socket.on('testEvent',(data: any) => {
        console.log(data);
        io.emit('ReTest', 'You Made It')
    })
})