var express = require('express');
var app = express();
var socketio = require('socket.io');
var path = require('path');
var SERIAL_TCP_PORT = 3000;
var WEB_PORT = 8124;

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || WEB_PORT);
app.use(express.static(__dirname + '/public'));


var server = app.listen(app.get('port'), function() {
    console.log('Web server listening on port %d', server.address().port);
    console.log('This can currently only handle the maxi cube (8x8x8) due to the unmaxicube_map function');
});

app.get('/', function(req, res) {
    res.render('index');
});





var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('Socket.io connected');

    socket.on('disconnect', function () {
        console.log('Socket.io disconnected');
    });
});


var buffer = [];

/**
 * Buffer 16 messages and then send them all in one go.
 */
function sendToClients(message, data) {
    buffer.push([message, data]);

    if (buffer.length == 16) {
        io.sockets.emit('data', buffer);
        buffer = [];
    }
}







var net = require('net');
var tcpserver = net.createServer(function(socket) {
    // Python cube simulator connected
    console.log('Serial-over-TCP connected');
    socket.write(new Buffer([0xFE, 0x4C, 0x45, 0x44])); // 0xFE is a magic initialisation command. 0x4C, 0x45, 0x44 is ASCII "LED"
    socket.on('end', function() {
        console.log('Serial-over-TCP disconnected');
    });
    socket.on('data', function(d) {
        // Incoming data is a byte stream, where a "packet" is 4 bytes of data.
        // First byte is the command, and the remaining 3 bytes are parameters.
        for (var index=0; index<d.length; index+=4) {
            handleMessage(d[index], d[index+1], d[index+2], d[index+3]);
        }
    });
});

tcpserver.listen(SERIAL_TCP_PORT, function() { //'listening' listener
    // Server started listening
    console.log('Serial-over-TCP server listening on port %d', SERIAL_TCP_PORT);
});



var currentPage = 0xff;
var currentBoard = 0xff;
var NUM_BOARDS = 4;

function handleMessage(cmd, d0, d1, d2) {
    // console.log('handle message ' + cmd);
    switch (cmd) {
        case 0xff:
            // bus reset
            // console.log('bus reset');
            break;

        case 0xe0:
            // connect
            // console.log('connect');
            break;

        case 0xe1:
            // select board
            // console.log('select board');
            currentBoard = d0;
            break;

        case 0xc0:
            // set brightness
            console.log('Ignoring set brightness command');
            break;

        case 0x80:
            // flip
            // console.log('flip');
            // d0 unused, d1 display page, d2 write page
            flip(d1, d2);
            break;

        default:
            if (cmd <= 0x80) {
                // console.log('set pixel');
                // set pixel color
                // cmd: offset, (d0, d1, d2): (r, g, b)
                // If currentBoard is 255, this means the pixel should be set on all boards. Therefore we need to know how many boards there are
                if (currentBoard == 255) {
                    for (b=0; b<NUM_BOARDS; b++) {
                        var coords = unmaxicube_map(b, cmd);
                        setPixel(coords[0], coords[1], coords[2], d0, d1, d2);
                    }
                } else {
                    var coords = unmaxicube_map(currentBoard, cmd);
                    setPixel(coords[0], coords[1], coords[2], d0, d1, d2);
                }
            } else {
                // something else we hopefully can just ignore
                console.log('Unknown command ' + cmd + ' - ignoring');
            }
            break;
    }
}

function unmaxicube_map(board, offset) {
    var x = offset % 8;
    var y = (((offset >> 3) % 2) ^ 1) + board*2;
    var z = (offset >> 4) ^ 1;
    return [x, y, z];
}

function setPixel(x, y, z, r, g, b) {
    sendToClients('p', [x, y, z, r, g, b]);
}

function flip(displayPage, writePage) {
    sendToClients('f', [displayPage, writePage]);
}