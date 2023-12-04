const ws = new WebSocket('ws://localhost:8080/ws');

ws.onopen = e => {
  console.log("Open connection");
  // ws.send("Hello");
}

ws.onmessage = e => {
  console.log("New message");
  console.log(e.data);
}

ws.onclose = e => {
  console.log("Close connection");
}

ws.onerror = e => {
  console.error(e);
}
