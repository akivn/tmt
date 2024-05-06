addLayer("pp", {
    name: "Prestige Power Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
    }},
    color: "#5d85c9",
    requires: new Decimal(100000), // Can be a function that takes requirement increases into account
    resource: "Prestige Power Points", // Name of prestige currency
    baseResource: "Prestige", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.1, // Prestige currency exponent
    base: 10,
    hotkeys: [ {key: "P", description: "shift+P: Reset for Prestige Power Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    canBuyMax() {return true},
    autoPrestige() {return (hasMilestone('s', 4))},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    power: {
        perSecond() {
            let base = new Decimal(3).pow(player.pp.points).minus(1)
            if(hasUpgrade('c', 13)) base = base.times(1e7)
            if(hasChallenge('p', 22)) base = base.times(tmp.p.challenges[22].rewardEffect)
            if(player.q.buff.gte(3)) base = base.times(tmp.q.increment.effect4)
            if(hasUpgrade('q', 13)) base = base.times(upgradeEffect('q', 13))
            if(hasAchievement('ac', 41)) base = base.times(5)
            if(inChallenge('p', 22)) base = new Decimal(0)
            return base;
        },
    },
    update(delta) {
        player.pp.power = player.pp.power.add(Decimal.times(tmp.pp.power.perSecond, delta));
    },
    resetsNothing(){
        return hasMilestone('s', 5)
    },
    upgrades: {
        11: {
            title: "New Beginning",
            description: "Boost Game point gain based on your Prestige Power.",
            cost: new Decimal(1),
            effect() {
                let effect = new Decimal(player.pp.power).add(2).log(2).pow(3)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){return (player[this.layer].unlocked)},
        },
        12: {
            title: "Powerful Gamers",
            description: "Boost Playerbase gain based on your Prestige Power.",
            cost: new Decimal(2),
            effect() {
                let effect = new Decimal(player.pp.power).add(1).pow(0.5)
                softcap(effect, new Decimal(1e3), new Decimal(0.8).pow(effect.add(10).log(10).minus(2)).add(0.2))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){return (player[this.layer].unlocked)},
        },
        13: {
            title: "Powerful Optimizer",
            description: "Boost Quality gain based on your Prestige Power, and unlock Stellar, the next layer.",
            cost: new Decimal(4),
            effect() {
                let effect = new Decimal(player.pp.power).add(10).log(10).times(0.02).add(1)
                return effect
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id), 4) },
            unlocked(){return (player[this.layer].unlocked)},
        },
        21: {
            title: "Solo Prestiging",
            description: "Boost Prestige gain based on your Prestige Power and Stars count.",
            cost: new Decimal(17),
            effect() {
                let effect = player.pp.power.times(player.s.points).add(1).pow(0.2)
                effect = softcap(effect, new Decimal('1e1500'), 0.1)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked(){return hasMilestone('s', 3)},
        },
        22: {
            title: "Synergy II",
            description: "The upgrades 'Quality Synergy' and 'Playerbase Attraction' receives a boost based on your Prestige Power.",
            cost: new Decimal(29),
            effect() {
                let effect = player.pp.power.add(1).log(10).div(6).add(1)
                effect = softcap(effect, new Decimal(250), new Decimal(1).div(effect.log(10).add(1).pow(0.9)))
                return effect
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id), 3)},
            unlocked(){return hasMilestone('s', 3)},
        },
        23: {
            title: "Challenge Further!",
            description: "Unlock 2 new Challenges.",
            cost: new Decimal(32),
            unlocked(){return hasMilestone('s', 3)},
        },
    },
    buyables: {


    },
    milestones: {

    },
    challenges: {
        
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `You have ${format(player.pp.power)} Prestige Powers` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `Prestige Power Gain: ${format(tmp.pp.power.perSecond)} / sec` }, { 'font-size': '14.4px', 'color': 'silver' }],
                "upgrades",
            ],
        },
    },
    doReset(pp) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[pp].position == this.position && layers[pp].row == this.row) return player.pp.power = new Decimal(0);
        if (layers[pp].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if(hasMilestone('s', 4)) keep.push('upgrades')
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },  

    layerShown(){return hasUpgrade('p', 22) ||  player[this.layer].unlocked}
  }
)