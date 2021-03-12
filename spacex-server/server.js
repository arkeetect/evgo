const {gql, ApolloServer} = require("apollo-server");
const axios = require("axios");
/*
Users should be able to search by:

Mission name
Rocket name
Launch year

Results should include:

Mission name
Rocket name
Launch date
Video link

 
*/
const typeDefs = gql`
    type Launch {
        mission_name: String!
        launch_date_utc: String
        launch_year: String
        rocket: Rocket!
        links: Links!  

    }
    
    type Query {
        launches(missionName: String, 
                rocketName: String, 
                launchYear: String ): [Launch]
        
    }
    
    type Rocket {
        rocket_name: String
    }
    
    type Links {
        video_link: String
    }
    `;

const finder = async function(launch, name){
    return launch.mission_name === name;
}
const resolvers = {
    Query: {
        async launches(parent, args, context, info) {
            const response = await axios.get("https://api.spacexdata.com/v3/launches");
            let reduce = [];
            response.data.forEach(element => {
                let keep = true;

                if (args.missionName) {
                    keep = false;
                    keep = element.mission_name.toLowerCase().includes(args.missionName.toLowerCase());
                }

                if (keep && args.launchYear) {
                    keep = false;
                    keep = element.launch_year.toLowerCase().includes(args.launchYear.toLowerCase());
                }

                if (keep && args.rocketName){
                    keep = element.rocket.rocket_name.toLowerCase().includes(args.rocketName.toLowerCase())
                }

                if (keep) {
                    reduce.push(element);
                }

            });
            
            return [...reduce]; // to make sure a single record stays iterable
        },
    },

   
}

async function apolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    server.listen(4000, () => {
        console.log("Apollo Launching!");
    })
};

apolloServer();