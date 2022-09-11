# LED Cube WebGL Simulator

This is a Node.js and WebGL-based simulator for the [LED cube](https://github.com/leedshackspace/pycubedemo) at Leeds Hackspace.

This is what it looks like:

![Screenshot of the simulator running in Chrome](docs/screenshot.png "Screenshot of the simulator running in Chrome")

## How to run it

Dependencies: Node.js >= v0.10 (tested and works in Node 6, and Node 16 (Gallium LTS)), a WebGL-capable browser, and a decent CPU and GPU

* `npm install`
* `npm start`
* Visit localhost:8124 in a browser
* Run Python cube code, using `localhost:3000` for the port.

## How it works

Originally, the Python code exclusively communicated with the physical LED cube over a serial connection, but later a serial-over-TCP connection method was added so that the Python code could communicate with the physical cube over a network connection. This project simulates a physical LED cube, so it interprets the same serial protocol that was intended to power the physical LED cube. The Node.js process translates hardware-focussed messages (set pixel: board and offset, RGB colour) received over TCP into messages that are more appropriate for software (set pixel: xyz coordinates, RGB colour), which are sent over a Socket.io connection to connected browsers.

When the browser receives the messages over Socket.io, it handles graphics features such as double-buffering before displaying the coloured pixels on an LED cube simulated by Three.js.

## Improvements to be made

Numerous improvements could be made to this application.

The first one would be to optimise the message-handling routines. Currently, messages from Python are passed through the socket.io connection to the browser (with some translation in between), which means there is a websocket packet sent for every single pixel changed - up to 512 per frame (at potentially 30-60fps). This causes a ridiculous amount of overhead simply from handling network traffic. The Node.js server should buffer frames and send them to the client as a single full frame (or a frame delta, if you want to implement keyframing), which should significantly reduce the amount of work the browser has to do.

Instead of the above, a new output method could be added to the Python code to better support software simulators, by performing the frame-buffering internally and emitting entire frames via a network port to clients. If the Python code handled websocket connections natively, the translation/proxy provided by the Node server could be bypassed, and the frontend could connect to the Python backend directly.

## License

GPLv3

