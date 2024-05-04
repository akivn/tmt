addLayer("q", {
    name: "Quantum", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 3, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        increment: new Decimal(1),
        buff: new Decimal(0)
    }},
    color: "#114514",
    requires: new Decimal(106), // Can be a function that takes requirement increases into account
    resource: "Quantum", // Name of prestige currency
    baseResource: "Stars", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.999, // Prestige currency exponent
    base: 1.01,
    hotkeys: [ {key: "q", description: "Q: Reset for Quantum", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(20)
        return exp
    },
    passiveGeneration() {
        return 0
    },
    increment: {
        mps() {
            let base = new Decimal(buyableEffect('q', 21))
            if (player.q.resetTime <= 0.06) base = new Decimal(1);
            return base;
        },
        effect() {
            let powa = player.q.increment
            return powa
        },
        effect2() {
            let powa = new Decimal(1)
            if (player.q.increment.lte(10)) powa = new Decimal(1)
            else powa = player.q.increment.div(10).pow(0.5)
            return powa
        },
    },
    update(delta) {
        player.q.increment = player.q.increment.times(new Decimal(10).pow(tmp.q.increment.mps.log(10).div(20), delta));
        if (tmp[this.layer].bars.buff.progress>=1) player[this.layer].buff = player[this.layer].buff.add(1);
    },
    upgrades: {

    },
    buyables: {
        21: {
            title: "Quantum Multiplier 1",
            cost(x) { 
                let cost = new Decimal(2).pow(x)
                return cost 
            },
            effect(x){
                let power = new Decimal(1.05).pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Quantum\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Increment by x" + format(buyableEffect(this.layer, this.id))+" per second"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
        },
    },
    challenges: {

    },
    bars: {
        buff: {
            direction: RIGHT,
            width: 369,
            height: 33,
            req(){
                let x = player.q.buff
                let req = new Decimal(1)
                if (x.lte(9)) req = new Decimal(10).pow(new Decimal(2).pow(x).pow(1.25))
                else req = new Decimal(1e310)
                return req
            },
            progress() {
                return (player.q.increment.add(1).log(10)).div(tmp[this.layer].bars[this.id].req.add(1).log(10))
            },
            unlocked() { return true },
            display() {
                if (player[this.layer].total.lte(9)) return "Next buff at: "+formatWhole(tmp[this.layer].bars[this.id].req)+" Increments ("+format(100-tmp[this.layer].bars[this.id].progress, 3)+"%)"
                else return "Maxed!"
            },
            fillStyle: {"background-color": "#114514"},
        },
    },
    milestones:{
        0: {requirementDescription: "1 Quantum",
        done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
        effectDescription: "Keep your Game upgrades, Prestige Milestones (Except 3rd) and Stellar Milestone 3 on Row 4 resets.",
    },

    },
    tabFormat: {
        "Increment": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Your Increment is ${format(player.q.increment)}` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `boosting Game Point gain by ${format(tmp.q.increment.effect)}x`}],
                ['display-text', function() { 
                    if (player.q.buff.gte(1)) return `boosting Games gain by ${format(tmp.q.increment.effect2)}x`
                    else return
                }],
                ['display-text', function() { return `Increment Multiplier: x${format(tmp.q.increment.mps)} / sec` }, { 'font-size': '14.4px', 'color': 'silver' }],
                ["bar", "buff"],
                "buyables",

            ],
        },
    },
    layerShown(){return hasUpgrade('s', 15) ||  player[this.layer].unlocked}
})
