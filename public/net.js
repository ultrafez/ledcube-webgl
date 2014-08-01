/**
 * Handle a Socket.io connection to a Node process, and deal with buffering
 */
var Net = function(simulator) {
    this.pages = [];
    this.displayPage = 0;
    this.writePage = 0;

    // Prepare the pages
    for (var page=0; page<2; page++) {
        this.pages[page] = [];
        for (var x=0; x<simulator.size; x++) {
            this.pages[page][x] = [];
            for (var y=0; y<simulator.size; y++) {
                this.pages[page][x][y] = [];
                for (var z=0; z<simulator.size; z++) {
                    this.pages[page][x][y][z] = [0, 0, 0]; // r, g, b tuple
                }
            }
        }
    }

    this.socket = io();
    this.socket.on('disconnect', function () {
        console.log('Socket.io disconnected');
    });

    function pixel(data) {
        // Set a pixel to a certain colour

        // If the write page is the same as the display page, then we need to show the changes on the cube immediately
        if (this.displayPage == this.writePage) {
            simulator.setPixelColor(data[0], data[1], data[2], data[3], data[4], data[5]);
        }

        this.pages[this.writePage][data[0]][data[1]][data[2]] = [data[3], data[4], data[5]];
    }
    
    function flip(displayPage, writePage) {
        // Set the page to be used for displaying, and the page for writing
        this.displayPage = displayPage;
        this.writePage = writePage;
        
        // Set the pixel colors for each of the pixels on the 'display' page
        for (var x=0; x<this.pages[this.displayPage].length; x++) {
            for (var y=0; y<this.pages[this.displayPage][x].length; y++) {
                for (var z=0; z<this.pages[this.displayPage][x][y].length; z++) {
                    var color = this.pages[this.displayPage][x][y][z]; // r, g, b tuple
                    simulator.setPixelColor(x, y, z, color[0], color[1], color[2]);
                }
            }
        }
    }

    function handleReceivedBuffer(data) {
        data.forEach(function (message) {
            switch (message[0]) {
                case 'f':
                    flip.call(this, message[1][0], message[1][1]);
                    break;

                case 'p':
                    pixel.call(this, message[1]);
                    break;
            }
        }.bind(this));
    }

    this.socket.on('data', handleReceivedBuffer.bind(this));
}