const DEBUG = true;
const MIN_PEOPLE = 200;
const MAX_PEOPLE = 750;
const MIN_TRUCKS = 15;
const MAX_TRUCKS = 30;
const MIN_REVENUE_PER_CUSTOMER = 8;
const MAX_REVENUE_PER_CUSTOMER = 20;
const NUM_DAYS = 3;
const NUM_PARKS = 4;


let gameState = null;
function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}
function bound(a, x, b) {
    // Bound x b/w a and b
    return Math.max(a, Math.min(b, x));
}

class Park {
    constructor(id, name, imgPath, initPeople, initTrucks) {
        this.id = id
        this.name = name;
        this.imgPath = imgPath;
        this.numPeople = initPeople;
        this.numTrucks = initTrucks;
    }

    toString() {
        return `${this.name}: ${this.numTrucks} trucks serving ${this.numPeople} people`
    }
}

class City {
    constructor(initParks, initPeople, initTrucks) {
        this.numParks = initParks;
        this.numPeople = initPeople;
        this.numTrucks = initTrucks;
        this.curHour = 0;
        this.curDay = 1;

        this.distributeParks();
    }

    distributeParks() {
        this.parks = [];
        let remainingTrucks = this.numTrucks;
        let remainingPeople = this.numPeople;
        for (let i = 0; i < this.numParks; i++) {
            let curTrucks = 0; 
            let curPeople = 0;
            if (i == this.numParks - 1) {
                curTrucks = remainingTrucks;
                curPeople = remainingPeople;
            } else {
                curTrucks = randInt(0, Math.floor(remainingTrucks / 2));
                curPeople = randInt(0, Math.floor(remainingPeople / 2));
            }
            remainingTrucks -= curTrucks;
            remainingPeople -= curPeople;
            console.log(curPeople);
            this.parks.push(new Park(i, `Park ${i+1}`, `park_icons/${i+1}.png`, curPeople, curTrucks));
        }
    }

    toString() {
        return `Zootopia the City: ${this.numTrucks} trucks serving ${this.numPeople} people across ${this.numParks} parks!`
    }
}

class Game {
    constructor(city) {
        this.city = city;
        this.playerPark = 0;
        this.playerProfits = 0;

        this.setupGameUI();
    }

    hide(el) {
        el.classList.add('hidden');
    }

    show(el) {
        el.classList.remove('hidden');
    }

    setupParkView() {
        var curPark = this.city.parks[this.playerPark];
        var parkView = document.getElementById("park-view");
        var parkName = document.getElementById("park-name");
        var parkImg = document.getElementById("park-img");
        var curDay = document.getElementById("cur-day");
        var curHour = document.getElementById("cur-hour");
        var numPeople = document.getElementById("num-people");
        var numTrucks = document.getElementById("num-trucks");
        var totalProfit = document.getElementById("total-profit");

        parkName.textContent = curPark.name;
        parkImg.src = curPark.imgPath;
        curDay.textContent = `Day ${this.city.curDay}`;
        curHour.textContent = `${this.city.curHour}:00 PM`;
        numPeople.textContent = `Current # of people: ${curPark.numPeople}`;
        numTrucks.textContent = `Current # of trucks: ${curPark.numTrucks + (this.playerPark == curPark.id ? 1 : 0)}`;
        totalProfit.textContent = `Total Profit: ${this.playerProfits}`;

        this.show(parkView);
    }

    setupCityView(outgoingTruckAmounts) {
        var cityView = document.getElementById("city-view");
        var parkGrid = document.getElementById("park-grid");
        var reference = this;

        function createParkCard(park, isCurPark, outgoingAmount) {
            const parkCard = document.createElement('div');
            parkCard.classList.add('park');
            if(isCurPark) {
                parkCard.classList.add('current-park');
            }
            
            const parkCardName = document.createElement('h3');
            const parkCardTruckAmount = document.createElement('p');
            parkCardName.textContent = park.name;
            parkCardTruckAmount.textContent = `# of trucks leaving from current park to ${park.name}: ${outgoingAmount}`;
            parkCard.appendChild(parkCardName);
            parkCard.appendChild(parkCardTruckAmount);

            // Add event listener to parkCard
            parkCard.addEventListener('click', function() {
                reference.playerPark = park.id;
                reference.switchToParkView();
            })

            return parkCard;
        }

        parkGrid.innerHTML = ''; // Clear park grid to update park cards
        for (let i = 0; i < NUM_PARKS; i++) {
            parkGrid.appendChild(createParkCard(this.city.parks[i], i == this.playerPark, outgoingTruckAmounts[i]));
        }
        this.show(cityView);
    }

    switchToParkView() {
        var cityView = document.getElementById("city-view");
        this.hide(cityView);
        this.setupParkView();
    }

    switchToCityView(outgoingTruckAmounts) {
        var parkView = document.getElementById("park-view");
        this.hide(parkView);
        this.setupCityView(outgoingTruckAmounts);
    }

    setupGameUI() {
        var startButton = document.getElementById("start-button");
        this.hide(startButton);

        // Set up Next Hour listener
        let nextHourBtn = document.getElementById('next-hour-btn');
        nextHourBtn.addEventListener('click', () => {this.incrementHour()});

        this.setupParkView(); 
    }

    teardownGameUI() {
        var parkView = document.getElementById("park-view");
        var cityView = document.getElementById("city-view");
        var gameOverScreen = document.getElementById("game-over");
        this.hide(parkView);
        this.hide(cityView);

        var gameOverProfits = document.getElementById("game-over-profits");
        gameOverProfits.textContent = `Total Profits: $${this.playerProfits}`;
        this.show(gameOverScreen);
    }

    startNewDay() {
        this.city.distributeParks();
    }

    simulateProfits() {
        // Divide N people amongst M trucks and simulate profit
        let curPark = this.city.parks[this.playerPark];
        const numPeopleServed = Math.max(0, randInt(-2,4) + Math.ceil(curPark.numPeople / (curPark.numTrucks + 1)));
        this.playerProfits += numPeopleServed * randInt(MIN_REVENUE_PER_CUSTOMER, MAX_REVENUE_PER_CUSTOMER);
    }

    simulateCityMovements() {
        let parkList = this.city.parks;
        let playerPark = this.playerPark;
        let outgoingTruckAmounts = new Array(NUM_PARKS).fill(1);
        let newTruckAmounts = new Array(NUM_PARKS).fill(0);
        
        // Find parks with highest percentage of people, these are most desirable to food truckers
        let peoplePercentArray = [];
        for (let i = 0; i < NUM_PARKS; i++) {
            peoplePercentArray.push(parkList[i].numPeople / this.city.numPeople);
        }
        
        function z(amount, ti, i_to_use) {
            // Quick function to allocate changes to outgoingTruckAmounts if ti == playerPark
            if (ti == playerPark) {
                outgoingTruckAmounts[i_to_use] += amount;
            }
            return amount;
        }

        // Simulate 75% of trucks leaving to these places
        // ti is the newTruckAmounts index, ppi is the peoplePercentArray index
        for (let ti = 0; ti < NUM_PARKS; ti++) {
            let departingTrucks = Math.floor(parkList[ti].numTrucks * .7); // 70% of trucks leave
            newTruckAmounts[ti] += z(parkList[ti].numTrucks - departingTrucks, ti, ti); // 30% of trucks stay
            let remainingTrucks = departingTrucks;
            for (let ppi = 0; ppi < NUM_PARKS - 1; ppi++) {
                const x = bound(0, Math.floor(departingTrucks * peoplePercentArray[ppi]), remainingTrucks);
                remainingTrucks -= x;
                newTruckAmounts[ppi] += z(x, ti, ppi);
            }
            newTruckAmounts[NUM_PARKS - 1] += z(remainingTrucks, ti, NUM_PARKS - 1); // Allocate remaining trucks
        }
        for (let i = 0; i < NUM_PARKS; i++) {
            parkList[i].numTrucks = newTruckAmounts[i] 
        }

        // Simulate a rebalancing of people
        this.city.numPeople = 0
        for (let i = 0; i < NUM_PARKS; i++) {
            let change = randInt(Math.floor(-MAX_PEOPLE / (20 * NUM_PARKS)), Math.floor(MAX_PEOPLE / (15 * NUM_PARKS)));
            console.log(change);
            let newNumPeople = Math.max(0, parkList[i].numPeople + change)
            parkList[i].numPeople = newNumPeople;
            this.city.numPeople += newNumPeople;
        }
        return outgoingTruckAmounts;
    }

    incrementHour() {
        if (this.city.curHour === 8) {
            this.city.curHour = 0;
            this.city.curDay += 1;
            if (this.city.curDay > NUM_DAYS) {
                this.teardownGameUI();
                return;
            } 
            this.simulateProfits();
            this.startNewDay();
            this.switchToParkView();
            return;
        }
        this.simulateProfits();
        this.city.curHour++;
    

        // Returns a list of size NUM_PARKS representing how many trucks move from cur park to all other parks
        let outgoingTruckAmounts = this.simulateCityMovements();
        this.switchToCityView(outgoingTruckAmounts);
    }



}

function startGame() {
    let initPeople = randInt(MIN_PEOPLE, MAX_PEOPLE);
    let initTrucks = randInt(MIN_TRUCKS, MAX_TRUCKS);
    let initParks = NUM_PARKS;
    gameState = new Game(new City(initParks, initPeople, initTrucks));
    // Hide "Start Game" button
}

function restartGame() {
    var startButton = document.getElementById("start-button");
    var gameOverScreen = document.getElementById("game-over");

    gameState.show(startButton);
    gameState.hide(gameOverScreen);
    gameState = null;
}