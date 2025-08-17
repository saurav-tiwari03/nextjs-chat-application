async function SendPrivateMessage(socket: any, to: string, message: string) {
  socket.emit("sendPrivateMessage", { to, message });
}


export { SendPrivateMessage }