import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL)

socket.on('connect', ()=>{
  console.log(socket.id)
})
socket.on('disconnect', ()=>{
  console.log('disconnected....')
})

export default socket