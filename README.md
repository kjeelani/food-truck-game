WIP

If one wishes to input settings for this game, use the following template:
```
input = {
            numDays: int,
            numParks: int,
            numPeople: int[numDays],
            numTrucks: int[numDays],
            minRevenuePerCustomer: int,
            maxRevenuePerCustomer: int,
            days: int -> Day where size(days) == numDays and days start at 1
        }

        type Day = {
            initTrucks: int[numParks] where sum(initTrucks) = numTrucks,
            hours: int -> Hour where size(hours) == 9 and hours start at 0
        }

        type Hour = {
            people: int[numParks] where sum(initPeople) = numPeople[current day],
            departingTrucks: int[numParks],
            arrivingTrucks: int[numParks] where sum(departingTrucks) == sum(arrivingTrucks),
        }
```

An example in JS:
```javascript
let testInput = {
    "numDays": 1,
    "numParks": 4,
    "numTrucks": 40,
    "numPeople": 200,
    "minRevenuePerCustomer": 8,
    "maxRevenuePerCustomer": 20,
    "days": {
        1: {
            "initTrucks": [5, 15, 15, 5],
            "hours": {
                0: {
                    "people": [50, 50, 50, 50],
                    "departingTrucks": [1, 1, 1, 1],
                    "arrivingTrucks": [0, 4, 0, 0]
                },
                1: {
                    "people": [50, 60, 40, 50],
                    "departingTrucks": [3, 2, 1, 1],
                    "arrivingTrucks": [1, 4, 3, 0]
                },
                2: {
                    "people": [30, 70, 40, 60],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                3: {
                    "people": [20, 80, 30, 70],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                4: {
                    "people": [20, 80, 30, 70],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                5: {
                    "people": [25, 90, 25, 60],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                6: {
                    "people": [20, 100, 20, 60],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                7: {
                    "people": [50, 70, 10, 60],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                },
                8: {
                    "people": [100, 30, 30, 40],
                    "departingTrucks": [0, 0, 0, 0],
                    "arrivingTrucks": [0, 0, 0, 0]
                }
            }
        }
    }
}
```
