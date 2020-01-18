import socketio from "socket.io-client"

var socket = socketio("http://192.168.15.2:7777", {
    autoConnect: false,
})

    function subscribeToNewDevs(subscribeFunction){
        socket.on("newDev", subscribeFunction)
    }


    function connect(latitude, longitude, techs){
        socket.io.opts.query = {
            latitude, 
            longitude, 
            techs,
        }
        
        
        socket.connect()
    
    }

    function disconnect(){
        if (socket.connected){
            socket.disconnect()
        }
    }

export {
    connect,
    disconnect,
    subscribeToNewDevs
}