# LED Cube WebGL Simulator

This is a Node.js and WebGL-based simulator for the [LED cube code](https://github.com/pbrook/pycubedemo) by pbrook. It is in no way well-engineered and was thrown together in a hurry, so please don't judge!

## How to run it

Dependencies: Node.js v0.10, a decent CPU and GPU (as it's not very well optimised)

Run `node viewer.js`. It will begin listening for connections from the Python cube code on port 3000, and it will listen for connections from a browser on port 8124. Run the Python code and connect from your browser (tested in Chrome) in whatever order you prefer.

## How it works

Originally, the Python code exclusively communicated with the physical LED cube over a serial connection, but later a serial-over-TCP connection method was added so that the Python code could communicate with the physical cube over a network connection. This project simulates a physical LED cube, so it interprets the same serial protocol that was intended to power the physical LED cube. The Node.js process translates hardware-focussed messages (set pixel: board and offset, rgb colour) received over TCP into messages that are more appropriate for software (set pixel: xyz coordinates, rgb colour), which are sent over a Socket.io connection to connected browsers.

When the browser receives the messages over Socket.io, it handles graphics features such as double-buffering before displaying the coloured pixels on an LED cube simulated by Three.js.

## License

GPLv3