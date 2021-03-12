1. Server
   cd spacex-server
   npm install
   npm start

nodemon is also in the dependencies (sorry I meant to install it as dev dependency - I would safely move it there at some point as it doesn't need to be part of shipped dependencies and I realized it late)

2. Client
   cd spacex-client
   npm install
   npm start

I have used Next.js for couple of reasons including relatively clean integration with apollo client's provider and overall smooth integration/value add to react.

![alt text] spacexUI.png
