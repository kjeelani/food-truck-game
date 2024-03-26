// import { Utility, Park } from "./utility";


class BaseCity {
    constructor() {
        this.numParks = 0;
        this.numPeople = 0;
        this.numTrucks = 0;
        this.curHour = 0;
        this.curDay = 1;
        this.parks = [];
    }

    newDay() {
        this.curHour = 0;
        this.curDay++;
    }

    toString() {
        return `Zootopia the City: ${this.numTrucks} trucks serving ${this.numPeople} people across ${this.numParks} parks!`
    }
}







class RandomCity extends BaseCity {
    static MIN_REVENUE_PER_CUSTOMER = 8;
    static MAX_REVENUE_PER_CUSTOMER = 20;

    constructor(initParks, initPeople, initTrucks) {
        super();
        this.numParks = initParks;
        this.numPeople = initPeople;
        this.numTrucks = initTrucks;
        this.distributeParks();
    }


    distributeParks() {
        self.parks = []
        let remainingTrucks = this.numTrucks;
        let remainingPeople = this.numPeople;
        for (let i = 0; i < this.numParks; i++) {
            let curTrucks = 0; 
            let curPeople = 0;
            if (i == this.numParks - 1) {
                curTrucks = remainingTrucks;
                curPeople = remainingPeople;
            } else {
                curTrucks = Utility.randInt(0, Math.floor(remainingTrucks / 2));
                curPeople = Utility.randInt(0, Math.floor(remainingPeople / 2));
            }
            remainingTrucks -= curTrucks;
            remainingPeople -= curPeople;
            this.parks.push(new Park(i, `Park ${i+1}`, `park_icons/${i % 4 + 1}.png`, curPeople, curTrucks));
        }
    }
}



class InputtedCity extends BaseCity {
    constructor(params) {
        super();
        this.params = params
        this.peopleArr = params.numPeople;
        this.truckArr = params.numTrucks;
    
        this.numParks = params.numParks;
        this.numPeople = this.peopleArr[0];
        this.numTrucks = this.truckArr[0];
        this.setParks()
    }


    setParks() {
        self.parks = []
        for (let i = 0; i < this.numParks; i++) {
            this.parks.push(new Park(
                    i, 
                    `Park ${i+1}`, 
                    `park_icons/${i % 4 + 1}.png`, 
                    this.params.days[this.curDay].hours[0].people[i], 
                    this.params.days[this.curDay].initTrucks[i]
                )
            ) 
        }
    }


    updateParks() {
        for (let i = 0; i < this.numParks; i++) {
            let curHourArr = this.params.days[this.curDay].hours[this.curHour]
            this.parks[i].numTrucks += curHourArr.arrivingTrucks[i] - curHourArr.departingTrucks[i] 
            this.parks[i].numPeople = curHourArr.people[i];
        }
    }


    newDay() {
        super.newDay()
        this.numPeople = this.peopleArr[this.curDay - 1];
        this.numTrucks = this.truckArr[this.curDay - 1];
    }
}