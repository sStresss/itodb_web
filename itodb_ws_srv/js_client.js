var wsStart='ws://'
var endpoint=wsStart + '127.0.0.1:8000'
var socket = new WebSocket(endpoint)
console.log(endpoint)


socket.onopen =function(e){
console.log('open',e)
socket.send(1)
}


socket.onmessage=function(e){
console.log('message',e)
number_one.innerHTML=e.data
socket.send(1)

}


