addLayer("g", {
    name: "Game", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    branches: ['p'],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        quality: new Decimal(1),
        players: new Decimal(1),
        buff: new Decimal(0), 
        auto1: true,
    }},
    color: "#20E0E0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Games", // Name of prestige currency
    baseResource: "Game Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    hotkeys: [ {key: "g", description: "G: Reset for Game Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('g', 21)) mult = mult.times(upgradeEffect('g', 21))
        if(hasUpgrade('g', 31)) mult = mult.times(upgradeEffect('g', 31))
        if(hasUpgrade('s', 11)) mult = mult.times(upgradeEffect('s', 11))
        if(hasUpgrade('c', 12)) mult = mult.times(1e4)
        if(hasChallenge('p', 21)) mult = mult.times(tmp.p.challenges[21].rewardEffect)
        mult = mult.times(tmp.p.effect)
        if(player.q.buff.gte(1)) mult = mult.times(tmp.q.increment.effect2)
        if(hasAchievement('ac', 34)) mult = mult.times(achievementEffect('ac', 34))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if(inChallenge('p', 21)) exp = new Decimal(0.01)
        return exp
    },
    effect() {
        let effect = new Decimal(1).times(player[this.layer].points.add(1)).pow(0.1).times(tmp.g.quality.effect).times(tmp.g.players.effect)
        return effect
    },
    effectDescription(){
            return "boosting Game points gain by x" + format(tmp[this.layer].effect) + ", based on your quality and playerbase"        
    },
    passiveGeneration() {
        if(hasMilestone("p", 3)) return 1;
        if(hasMilestone("p", 1)) return 0.01;
        return 0
        },
    quality: {
        perSecond() {
            let base = buyableEffect('g', 11)
            if (hasChallenge('p', 11)) base = base.pow(tmp.p.challenges[11].rewardEffect)
            if (hasUpgrade('s', 14)) base = base.pow(upgradeEffect('s', 14))
            if (inChallenge('p', 22)) base = base.pow(0.5)
            if (player.q.buff.gte(6)) base = base.pow(tmp.q.increment.effect7)
            if (inChallenge('p', 11) || inChallenge('q', 22)) base = new Decimal(0)
            if (player.p.resetTime <= 0.06) base = new Decimal(0);
            return base;
        },
        effect() {
            let powa = (player.g.quality).log(10).add(1)
            let base = new Decimal(0.85)
            if(hasUpgrade('p', 11)) powa = (player.g.quality).pow(0.14).times(5).minus(4)
            powa = softcap(powa, new Decimal(1e8), base.pow(powa.add(10).log(10).minus(7)).add(new Decimal(1).minus(base)))
            powa = softcap(powa, new Decimal(1e20), 0.5)
            powa = softcap(powa, new Decimal('1e500'), new Decimal(1).div(powa.div('1e400').log(1e100)))
            return powa
        }
    },
    players: {
        perSecond() {
            let base = buyableEffect('g', 12)
            if (hasChallenge('p', 11)) base = base.pow(tmp.p.challenges[11].rewardEffect)
                if (player.q.buff.gte(6)) base = base.pow(tmp.q.increment.effect7)
            if (inChallenge('p', 11) || inChallenge('q', 22)) base = new Decimal(0)
            if (player.p.resetTime <= 0.06) base = new Decimal(0);
            return base;
        },
        effect() {
            let powa = player.g.players.pow(0.3)
            let base = new Decimal(0.833)
            powa = softcap(powa, new Decimal(1e3), base.pow(powa.add(10).log(10).minus(2)).add(new Decimal(1).minus(base)))
            powa = softcap(powa, new Decimal(1e80)), new Decimal(1).div(powa.div(1e60).log(1e20))
            if(hasUpgrade('c', 15)) powa = powa.pow(2.25)
            powa = softcap(powa, new Decimal(2).pow(1024), 0.4)
            powa = softcap(powa, new Decimal('1e1300'), 0.05)
            return powa
        }
    },
    update(delta) {
        player.g.quality = player.g.quality.add(Decimal.times(tmp.g.quality.perSecond, delta));
        player.g.players = player.g.players.add(Decimal.times(tmp.g.players.perSecond, delta));
    },
    upgrades: {
        11: {
            title: "Quality Assurance",
            description: "Double the Quality gain.",
            cost: new Decimal(5),
        },
        12: {
            title: "Playerbase Assurance",
            description: "Double the Playerbase gain.",
            cost: new Decimal(8),
        },
        13: {
            title: "Game Boost",
            description: "Boost Game Point gain based on your Games.",
            cost: new Decimal(15),
            effect() {
                let power = new Decimal(player.g.points.add(5).log(5))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Synergy",
            description: "Game Point gain boosts by itself.",
            cost: new Decimal(30),
            effect() {
                let power = new Decimal(player.points.add(10).log(10))
                if (hasUpgrade('g', 22)) power = power.pow(1.5)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Game Duplicator",
            description: "Multiply Game gain based on your quality.",
            cost: new Decimal(100),
            effect() {
                let power = new Decimal(player.g.quality.add(3).log(3))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('g', 14) || player.p.points.gte(1)) },
        },
        22: {
            title: "Quality Synergy",
            description: "Multiply Quality gain based on your Quality Increaser count.",
            cost: new Decimal(500),
            effect() {
                let power = getBuyableAmount('g', 11).add(1).pow(1.5)
                if(hasUpgrade('pp', 22)) power = power.pow(upgradeEffect('pp', 22))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('g', 14) || player.p.points.gte(1)) },
        },
        23: {
            title: "Playerbase Attraction",
            description: "Multiply Playerbase gain based on your Ad Maker count.",
            cost: new Decimal(1200),
            effect() {
                let power = getBuyableAmount('g', 12).add(1).pow(1.2)
                if(hasUpgrade('pp', 22)) power = power.pow(upgradeEffect('pp', 22))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('g', 14) || player.p.points.gte(1)) },
        },
        24: {
            title: "Unlock!",
            description: "Unlock the next layer, Prestige.",
            cost: new Decimal(2000),
            unlocked() { return (hasUpgrade('g', 14) || player.p.points.gte(1)) },
        },
        31: {
            title: "Game Synergy",
            description: "Games gain boost itself.",
            cost: new Decimal(5e4),
            effect() {
                let power = player[this.layer].points.add(10).log(10).pow(0.7)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('p', 13) || hasMilestone('s', 0)) },
        },
        32: {
            title: "Quality Self-boost",
            description: "Quality gain boost itself.",
            cost: new Decimal(5e5),
            effect() {
                let power = player[this.layer].quality.add(10).log(10).pow(0.45)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('p', 13) || hasMilestone('s', 0)) },
        },
        33: {
            title: "Regeneration",
            description: "Playerbase gain boost itself.",
            cost: new Decimal(3e6),
            effect() {
                let power = player[this.layer].players.add(10).log(10)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('p', 13) || hasMilestone('s', 0)) },
        },
        34: {
            title: "Repayment",
            description: "Game Points boosts Prestige point gain.",
            cost: new Decimal(1e7),
            effect() {
                let power = player.points.add(10).log(10).pow(0.34)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return (hasUpgrade('p', 13) || hasMilestone('s', 0)) },
        },
    },
    buyables: {
        11: {
            title: "Quality Increaser",
            cost(x) { 
                let cost = new Decimal(2).pow(x)
                return cost 
            },
            effect(x){
                let power = new Decimal(x).times(0.1)
                if (hasUpgrade('g', 11)) power = power.times(new Decimal(2))
                if (hasUpgrade('g', 22)) power = power.times(upgradeEffect('g', 22))
                if (hasUpgrade('g', 32)) power = power.times(upgradeEffect('g', 32))
                power = power.times(tmp.p.effect2)
                power = power.times(buyableEffect('g', 21))
                if (hasUpgrade('pp', 13)) power = power.pow(upgradeEffect('pp', 13))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Games\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Adds " + format(buyableEffect(this.layer, this.id))+" quality per second"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
        },
        12: {
            title: "Ad Maker",
            cost(x) { 
                let cost = new Decimal(10).pow(x)
                return cost 
            },
            effect(x){
                let power = new Decimal(x).times(0.05)
                if (hasUpgrade('g', 12)) power = power.times(new Decimal(2))
                if (hasUpgrade('g', 23)) power = power.times(upgradeEffect('g', 23))
                if (hasUpgrade('g', 33)) power = power.times(upgradeEffect('g', 33))
                if (hasUpgrade('p', 12)) power = power.times(upgradeEffect('p', 12))
                if (hasUpgrade('pp', 12)) power = power.times(upgradeEffect('pp', 12))
                power = power.times(buyableEffect('g', 22))
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Games\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Adds " + format(buyableEffect(this.layer, this.id))+" players per second"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return (getBuyableAmount('g', 11).gte(1) || player.p.unlocked)},
        },
        21: {
            title: "Quality Multiplier",
            cost(x) { 
                let cost = new Decimal(10).pow(x).times(10000)
                cost = softcap(cost, new Decimal(1e22), new Decimal(1).add(new Decimal(0.03).times(cost.add(10).log(10).minus(21))))
                return cost 
            },
            effect(x){
                let b = new Decimal(1.5)
                if (hasUpgrade('p', 21)) b = new Decimal(1.875)
                if (hasUpgrade('s', 12)) b = b.add(upgradeEffect('s', 12))
                if(player.q.buff.gte(5)) b = b.add(tmp.q.increment.effect6)
                let power = new Decimal(b).pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Games\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Quality Increaser's Efficiency by x" + format(buyableEffect(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return hasUpgrade('p', 13) }
        },
        22: {
            title: "Ad Multiplier",
            cost(x) { 
                let cost = new Decimal(100).pow(x).times(10000)
                cost = softcap(cost, new Decimal(1e22), new Decimal(1).add(new Decimal(0.03).times(cost.add(10).log(10).minus(21))))
                return cost 
            },
            effect(x){
                let b = new Decimal(1.5)
                if (hasUpgrade('p', 21)) b = new Decimal(1.875)
                if (hasUpgrade('s', 12)) b = b.add(upgradeEffect('s', 12))
                if(player.q.buff.gte(5)) b = b.add(tmp.q.increment.effect6)
                let power = new Decimal(b).pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Games\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Ad Maker's Efficiency by x" + format(buyableEffect(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return hasUpgrade('p', 13) }
        },
    },
    challenges: {

    },
    tabFormat: {
        "Game": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Your game quality is ${format(player.g.quality)},\n\ boosting Game bonus by ${format(tmp.g.quality.effect)}x` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `You have ${format(player.g.players)} players,\n\ boosting Game bonus by ${format(tmp.g.players.effect)}x` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `Quality Gain: ${format(tmp.g.quality.perSecond)} / sec` }, { 'font-size': '14.4px', 'color': 'silver' }],
                ['display-text', function() { return `Playerbase Gain: ${format(tmp.g.players.perSecond)} players / sec` }, { 'font-size': '14.4px', 'color': 'silver' }],
                "buyables",
            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "upgrades",
            ]
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
        for(i=4;i<5;i++){ //rows
            for(v=2;v<3;v++){ //columns
                if (hasUpgrade(this.layer, i+v*10)) keptUpgrades.push(i+v*10)
              }
        }
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if(hasMilestone('p', 0) || hasMilestone('s', 0) || hasMilestone('q', 0)) keep.push("upgrades")
        if(hasMilestone('p', 2) || hasMilestone('s', 1)) keep.push("buyables")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },
    automate() {
        for(i=1;i<51;i++){
            if(player.g.auto1 && hasMilestone('s', 2)) buyBuyable("g",11)
            if(player.g.auto1 && hasMilestone('s', 2)) buyBuyable("g",12)
            if(player.g.auto1 && hasChallenge('p', 21)) buyBuyable("g",21)
            if(player.g.auto1 && hasChallenge('p', 21)) buyBuyable("g",22)
    }
    },  
    layerShown(){return true}
})
