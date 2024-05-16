## Overview

This is the code for the Food Truck Game. The most updated version is in Qualtrics, but this is the base version with all major functionalities.

The game involves a food truck driver, who has to decide every hour which park he should go to to maximize profits. He can use information such as the total # of people at his current park and the # of trucks leaving / departing. An AI will also give advice at times (configurable by JSON). 

## Inputs

If one wishes to input settings for this game, use the following template and build a JSON. Then upload it to the [bobalab-jsons](https://github.com/kjeelani/bobalab-jsons/tree/main) repository to host it
```
input = {
            numDays: int,
            hoursPerDay: int,
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
            advice: string
        }
```

An example in JS:
```javascript
let testInput = {
    "numDays": 1,
    "hoursPerDay": 9,
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
                    "arrivingTrucks": [0, 4, 0, 0],
                    "advice": "No Advice"
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
More examples can be found in the [bobalab-jsons](https://github.com/kjeelani/bobalab-jsons/tree/main) repo with the jsons titled food-truck-game-X.

## Outputs

The player string at the end stores the profit and every move the player makes alongside the # of milliseconds they took. This is in the form: `Profit|Timestamp1,Park1|Timestamp2,Park2...`
This is saved to Qualtrics after every game completion.
