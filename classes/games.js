// import { RandomCity, InputtedCity } from "./cities"
// import { Utility } from "./utility";


class BaseGame {
    constructor(city, numDays) {
        this.city = city;
        this.numDays = numDays;
        this.playerPark = 0;
        this.prevPlayerPark = 0;
        this.playerProfits = 0;
        // Keeps track of moves in the form "Timestamp,Move|Timestamp,Move|..."
        this.moveString = "";
        this.prevTime = Date.now();

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
        var nextHourBtn = document.getElementById("next-hour-btn");
        var parkName = document.getElementById("park-name");
        var parkImg = document.getElementById("park-img");
        var curDay = document.getElementById("cur-day");
        var curHour = document.getElementById("cur-hour");
        var numPeople = document.getElementById("num-people");
        var numTrucks = document.getElementById("num-trucks");
        var totalProfit = document.getElementById("total-profit");

        if (this.playerPark !== this.prevPlayerPark) {
            var incomingTrucks = document.getElementById("incoming-trucks");
            var outgoingTrucks = document.getElementById("outgoing-trucks");
            incomingTrucks.textContent = `# of trucks that are arriving this hour: N/A`;
            outgoingTrucks.textContent = `# of trucks that are departing this hour: N/A`;
        }

        parkName.textContent = curPark.name;
        parkImg.src = curPark.imgPath;
        curDay.textContent = `Day ${this.city.curDay}`;
        curHour.textContent = `${this.city.curHour}:00 PM`;
        numPeople.textContent = `Current # of people: ${curPark.numPeople}`;
        numTrucks.textContent = `Current # of trucks: ${curPark.numTrucks + (this.playerPark == curPark.id ? 1 : 0)}`;
        totalProfit.textContent = `Total Profit: ${this.playerProfits}`;

        this.show(parkView);
        this.show(nextHourBtn);
    }

    setupCityView(departingTruckArr, incomingTruckArr) {
        var cityView = document.getElementById("city-view");
        var parkGrid = document.getElementById("park-grid");
        var reference = this;

        function createParkCard(park, isCurPark, outgoingAmt, incomingAmt) {
            const parkCard = document.createElement('div');
            parkCard.classList.add('park');
            if(isCurPark) {
                parkCard.classList.add('current-park');
                var incomingTrucks = document.getElementById("incoming-trucks");
                var outgoingTrucks = document.getElementById("outgoing-trucks");
                incomingTrucks.textContent = `# of trucks that are arriving this hour: ${incomingAmt}`;
                outgoingTrucks.textContent = `# of trucks that are departing this hour: ${outgoingAmt}`;
            }
            
            const parkCardName = document.createElement('h4');
            parkCardName.textContent = park.name;
            parkCard.appendChild(parkCardName);

            // Add event listener to parkCard
            parkCard.addEventListener('click', function() {
                reference.prevPlayerPark = reference.playerPark;
                reference.playerPark = park.id;
                reference.switchToParkView();
                reference.moveString += `|${Date.now() - reference.prevTime},${park.id}`
                reference.prevTime = Date.now();
            })

            return parkCard;
        }

        parkGrid.innerHTML = ''; // Clear park grid to update park cards
        for (let i = 0; i < RandomGame.NUM_PARKS; i++) {
            parkGrid.appendChild(createParkCard(this.city.parks[i], i == this.playerPark, departingTruckArr[i], incomingTruckArr[i]));
        }
        this.show(cityView);
    }

    switchToParkView() {
        var cityView = document.getElementById("city-view");
        this.hide(cityView);
        this.setupParkView();
    }

    switchToCityView(departingTruckArr, incomingTruckArr) {
        var nextHourBtn = document.getElementById("next-hour-btn");
        this.hide(nextHourBtn);
        this.setupCityView(departingTruckArr, incomingTruckArr);
    }

    setupGameUI() {
        var startButton = document.getElementById("start-button");
        this.hide(startButton);

        // Set up Next Hour listener
        let nextHourBtn = Utility.removeAllEventListeners(document.getElementById('next-hour-btn'));
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
        var moveStringText = document.getElementById("move-string");
        gameOverProfits.textContent = `Total Profits: $${this.playerProfits}`;
        moveStringText.textContent = `Player String: ${this.playerProfits}${this.moveString}`;
        this.show(gameOverScreen);
    }

    startNewDay() {
        throw new Error("Method startNewDay must be implemented.");
    }

    incrementHour() {
        throw new Error("Method incrementHour must be implemented.");
    }
}









class RandomGame extends BaseGame {
    static MIN_PEOPLE = 200;
    static MAX_PEOPLE = 750;
    static MIN_TRUCKS = 15;
    static MAX_TRUCKS = 30;
    static NUM_PARKS = 4;

    constructor(MIN_NUM_DAYS, MAX_NUM_DAYS) {
        let initPeople = Utility.randInt(RandomGame.MIN_PEOPLE, RandomGame.MAX_PEOPLE);
        let initTrucks = Utility.randInt(RandomGame.MIN_TRUCKS, RandomGame.MAX_TRUCKS);
        let initParks = RandomGame.NUM_PARKS;
        super(new RandomCity(initParks, initPeople, initTrucks), Utility.randInt(MIN_NUM_DAYS, MAX_NUM_DAYS));
    }

    startNewDay() {
        this.city.distributeParks();
    }

    simulateProfits() {
        // Divide N people amongst M trucks and simulate profit
        let curPark = this.city.parks[this.playerPark];
        const numPeopleServed = Math.max(0, Utility.randInt(-2,4) + Math.ceil(curPark.numPeople / (curPark.numTrucks + 1)));
        this.playerProfits += numPeopleServed * Utility.randInt(RandomCity.MIN_REVENUE_PER_CUSTOMER, RandomCity.MAX_REVENUE_PER_CUSTOMER);
    }

    simulateCityMovements() {
        let parkList = this.city.parks;
        let incomingTrucks = new Array(RandomGame.NUM_PARKS).fill(0);
        let outgoingTrucks = new Array(RandomGame.NUM_PARKS).fill(0);
        let newTruckAmounts = new Array(RandomGame.NUM_PARKS).fill(0);
        
        // Find parks with highest percentage of people, these are most desirable to food truckers
        let peoplePercentArray = [];
        for (let i = 0; i < RandomGame.NUM_PARKS; i++) {
            peoplePercentArray.push(parkList[i].numPeople / this.city.numPeople);
        }
        
        // Simulate 75% of trucks leaving to these places
        // ti is the newTruckAmounts index, ppi is the peoplePercentArray index
        for (let ti = 0; ti < RandomGame.NUM_PARKS; ti++) {
            let departingTrucks = Math.floor(parkList[ti].numTrucks * Utility.randInt(60,75) / 100); // 60-75% of trucks leave
            outgoingTrucks[ti] = departingTrucks;
            newTruckAmounts[ti] += parkList[ti].numTrucks - departingTrucks; // 25-40% of trucks stay
            
            let remainingTrucks = departingTrucks;
            for (let ppi = 0; ppi < RandomGame.NUM_PARKS - 1; ppi++) {
                const x = Utility.bound(0, Math.floor(departingTrucks * peoplePercentArray[ppi]), remainingTrucks);
                remainingTrucks -= x;
                newTruckAmounts[ppi] += x;
                incomingTrucks[ppi] += x;
            }

            newTruckAmounts[RandomGame.NUM_PARKS - 1] += remainingTrucks; // Allocate remaining trucks
            incomingTrucks[RandomGame.NUM_PARKS - 1] += remainingTrucks;
        }
        for (let i = 0; i < RandomGame.NUM_PARKS; i++) {
            parkList[i].numTrucks = newTruckAmounts[i] 
        }

        // Simulate a rebalancing of people
        this.city.numPeople = 0
        for (let i = 0; i < RandomGame.NUM_PARKS; i++) {
            let change = Utility.randInt(Math.floor(-RandomGame.MAX_PEOPLE / (20 * RandomGame.NUM_PARKS)), Math.floor(RandomGame.MAX_PEOPLE / (15 * RandomGame.NUM_PARKS)));
            let newNumPeople = Math.max(0, parkList[i].numPeople + change)
            parkList[i].numPeople = newNumPeople;
            this.city.numPeople += newNumPeople;
        }
        return [outgoingTrucks, incomingTrucks];
    }


    incrementHour() {
        console.log(this.city.curDay, this.numDays);
        if (this.city.curHour === 8) {
            this.city.newDay()
            if (this.city.curDay > this.numDays) {
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
        let [departingTruckArr, incomingTruckArr] = this.simulateCityMovements();
        this.switchToCityView(departingTruckArr, incomingTruckArr);
    }
}










class InputtedGame extends BaseGame {
    /*
        this.params = {
            numDays: int,
            numParks: int,
            numPeople: int[numDays],
            numTrucks: int[numDays],
            minRevenuePerCustomer: int,
            maxRevenuePerCustomer: int,
            days: int -> Day where size(days) == numDays
        }

        type Day = {
            initTrucks: int[numParks] where sum(initTrucks) = numTrucks,
            hours: int -> Hour where size(hours) == 9
        }

        type Hour = {
            people: int[numParks] where sum(initPeople) = numPeople[current day],
            departingTrucks: int[numParks],
            arrivingTrucks: int[numParks] where sum(departingTrucks) == sum(arrivingTrucks),
        }
    */

    constructor(params) {
        let newCity = new InputtedCity(params);
        super(newCity, params.numDays);
        this.params = params;
    }

    simulateProfits() {
        // Divide N people amongst M trucks and simulate profit
        let curPark = this.city.parks[this.playerPark];
        const numPeopleServed = Math.max(0, Utility.randInt(-2,4) + Math.ceil(curPark.numPeople / (curPark.numTrucks + 1)));
        this.playerProfits += numPeopleServed * Utility.randInt(this.params.minRevenuePerCustomer, this.params.maxRevenuePerCustomer);
    }

    startNewDay() {
        this.city.newDay();
    }

    incrementHour() {
        if (this.city.curHour === 8) {
            this.city.newDay();
            if (this.city.curDay > this.numDays) {
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
    
        this.city.updateParks();
        this.switchToCityView(
            this.params.days[this.city.curDay].hours[this.city.curHour].departingTrucks, 
            this.params.days[this.city.curDay].hours[this.city.curHour].arrivingTrucks
        );
    }
}
