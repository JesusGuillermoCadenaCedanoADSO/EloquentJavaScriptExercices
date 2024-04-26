const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges){
    let graph = Object.create(null);
    function addEdge(from, to){
        if (from in graph){
            graph[from].push(to);
        }else{
            graph[from]=[to];
        }
    }
    for (let [from, to] of edges.map(r=>r.split("-"))){
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}
const roadGraph = buildGraph(roads);
//console.log(roadGraph);

class VillageState {
    constructor(place, parcels){
        this.place=place;
        this.parcels=parcels;
    }
    move(destination){
        if(!roadGraph[this.place].includes(destination)){
            return this;
        }else{
            let parcels=this.parcels.map(p=> {
                if (p.place != this.place) return p;
                return {place:destination, address:p.address};
            }).filter(p=>p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState(
    "Post Office",
    [{place: "Post Office", address: "Alice's House"}]
    );
    let next = first.move("Alice's House");
    console.log(next.place);
    // → Alice's House
    console.log(next.parcels);
    // → []
    console.log(first.place);
    // → Post Office


function runRobot(state, robot, memory){
    for(let turn=0;;turn++){
        if(state.parcels.length==0){
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array){
    let choice = Math.floor(Math.random()*array.length);
    return array[choice];
}

function randomRobot(state){
    return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5){
    let parcels =[];
    for (let i = 0;i < parcelCount; i++){
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place=randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place,address});
    }
    return new VillageState("Post Office", parcels);
};

runRobot(VillageState.random(),randomRobot);

function findRoute(graph, from, to){
    let work = [{at: from, route: []}];
    for (let i=0; i<work.length;i++){
        let {at, route}=work[i];
        for (let place of graph[at]){
            if (place==to) return route.concat(place);
            if (!work.some(w=>w.at==place)){
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function goalOrientedRobot({place, parcels}, route){
    if (route.length==0){
        let parcel = parcels[0];
        if (parcel.place != place){
            route = findRoute(roadGraph, place, parcel.place);
        }else{
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return {direction : route[0], memory: route.slice(1)};
}

const state = {
    place: "Alice's House",
    parcels: [
      { place: "Alice's House", address: "Bob's House" },
      { place: "Post Office", address: "Town Hall" }
    ]
  };
  
const route = ["Bob's House", "Cabin", "Post Office", "Town Hall"];

const result = goalOrientedRobot(state, route);
console.log(result);



  