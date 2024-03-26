class Utility {
    static removeAllEventListeners(element) {
        // Clone the element
        const clonedElement = element.cloneNode(true);
        // Replace the original element with the clone
        element.parentNode.replaceChild(clonedElement, element);
        return clonedElement;
    }

    static randInt(a, b) {
        // Returns an integer in [a,b)
        return Math.floor(a + (b - a + 1) * Math.random())
    }

    static bound(a, x, b) {
        // Bound x b/w a and b
        return Math.max(a, Math.min(b, x));
    }
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
