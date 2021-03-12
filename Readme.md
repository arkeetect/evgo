1. Server
   cd spacex-server
   npm install
   npm start
   Server will spit out "Apollo is Launching!" to console to indicate it is listening on localhost:4000 and has GraphQL playground available with schema documentation from Apollo value add.

nodemon is also in the dependencies (sorry I meant to install it as dev dependency - I would safely move it there at some point as it doesn't need to be part of shipped dependencies and I realized it late)

2. Client
   cd spacex-client
   npm install
   npm start

Next allows live watching for code changes while listening on localhost:3000. Please set your scope (navigate browser) to this port.

I have used Next.js for couple of reasons including relatively clean integration with Apollo client's provider and overall smooth integration/value add to react.

![alt text] spacexUI.png

Please see image above for the expected rendered page.

I have leveraged the UI as guard against divergent N+1 queries etc. until I have had a chance to configure, mostly declaratively, Apollo's dataloader batch mechanism as well as client side "local" caching (including the default caching that Apollo server comes out of the box with). Note this particular api is not likely to have frequent changes (SpaceX launches are not exactly something that would occur monthly or even quarterly, so the need to flush the cache would be pretty rare.).

GraphQL server in this solution exposes just one query with schema that intrinsincly accomodates couple of child levels (rocket and links) and we also leverage Apollo's automatic resolver mechanism, reducing our code complexity.

Each app (server and client) is housed in one file:

- server.js for BFF and
- index.js for the frontend.

Below is the gql showing the variables that are controlled/driven by the react hooks-controlled components in the UI.

const GET_LAUNCHES = gql` query ($launchYear: String $rocketName: String $missionName: String) { launches(launchYear: $launchYear rocketName: $rocketName missionName: $missionName) { mission_name launch_date_utc launch_year rocket { rocket_name } links { video_link } } }`;

(Please copy it to your favorite editor if markdown scrunhes the gql indents)

Had time permitted, I would have liked to take the server side batching and client side caching to completion.

I welcome your feedback/thoughts. Please feel free to contact me if anything needs further clarification beyond this writeup.

    Happy Launching!
