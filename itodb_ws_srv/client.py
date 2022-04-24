import websockets
import asyncio

# The main function that will handle connection and communication
# with the server
async def listen():
    url = "localhost:8000"
    # Connect to the server
    async with websockets.connect(url) as ws:
        # Send a greeting message
        await ws.send({"type": "websocket.accept",
                         })
        print('send1')
        await ws.send({"type": "websocket.send",
                         "text": 0})
        print('send2')
        # Stay alive forever, listening to incoming msgs


# Start the connection
asyncio.get_event_loop().run_until_complete(listen())