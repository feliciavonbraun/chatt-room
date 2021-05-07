import { io } from 'socket.io-client';
import { createContext, FunctionComponent, useState } from "react";

// Interface

interface Room {
    titel: string,
    password?: string
}

interface SocketValue {
    room: Room[],
    username: string,
    connect: () => void,
    createRoom: () => void;
    joinRoom: () => void;
    sendMessage: ( newMessage: string ) => void;
    leaveRoom: () => void;
    disconnect: () => void;
    getUsername: (username: string) => void
};
const socket = io('http://localhost:4000', { transports: ["websocket"] }); 

/* Create context */
export const SocketContext = createContext<SocketValue>({} as SocketValue);

/* Context provider */
const SocketProvider: FunctionComponent = ({ children }) => {
    const [username, setUsername] = useState('');
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const room = 'Living room'

    console.log(username);


    function connect(username: string){
        setUsername(username);
        socket.on('user-connected', () => {
            console.log('anslutning lyckad ');
        });
    };

    connect();
    function connect(){
       socket.on('user-connected', () => {
           console.log('anslutning lyckad ');
       });
   };
    
    function getUsername(username: string) {
        setUsername(username);
    }

    function createRoom() {
        console.log('createRoom');
    }
    
    function joinRoom() {
        socket.emit('join_room', room);
    }

    function sendMessage(newMessage: string) {
        socket.on('chat-message', () => {
            setAllMessages([...allMessages, newMessage])
            console.log([...allMessages, newMessage])
        });
        console.log('contexten nådd')
    };
    //function sendMessage() {
    //    socket.emit('send-message', "David says hi!");
    //    console.log('sendMessage');
    //}


    function leaveRoom() {
        socket.emit('leave_room')
    }

    function disconnect() {
        socket.on('disconnect', () => {
            console.log('anslutning upphörde ');
        });
    }

    return (
        <SocketContext.Provider value={{
            room: [],
            username,
            connect,
            createRoom,
            joinRoom,
            sendMessage,
            leaveRoom,
            disconnect,
            getUsername,
        }}>
        { children }
        </SocketContext.Provider>
    )
};
export default SocketProvider;