addLayer("s", {
    name: "Stellar", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ['c', 'q', 'n'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#f244de",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "Stars", // Name of prestige currency
    canBuyMax() {return hasMilestone('s', 6)},
    resetsNothing(){return hasMilestone('q', 3)},
    autoPrestige(){return hasMilestone('q', 3)},
    baseResource: "Prestiges", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.2, // Prestige currency exponent
    base: 100,
    hotkeys: [ {key: "s", description: "S: Reset for Stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(player.q.buff.gte(4)) mult = mult.div(tmp.q.increment.effect5)
        if(hasUpgrade('q', 31)) mult = mult.div(upgradeEffect('q', 31))
        if(hasChallenge('q', 12)) mult = mult.div(challengeEffect('q', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = new Decimal(8).pow(player[this.layer].points).pow(0.8)
        if(hasUpgrade('c', 14)) effect = effect.pow(1.5)
        effect = softcap(effect, new Decimal(1e70), 0.7)
        effect = softcap(effect, new Decimal('1e3080'), new Decimal(1).div(effect.log(10).minus(3080).div(308).add(1).pow(0.35)))
        if (inChallenge('q', 12)) effect = new Decimal(1)
        return effect
    },
    effect2() {
        let effect = new Decimal(2).pow(player[this.layer].points)
        if(hasUpgrade('c', 14)) effect = effect.pow(1.5)
        effect = softcap(effect, new Decimal(1e30), 0.7)
        effect = softcap(effect, new Decimal('1e1200'), new Decimal(1).div(effect.log(10).minus(1200).div(120).add(1).pow(0.35)))
        if (inChallenge('q', 12)) effect = new Decimal(1)
        return effect
    },
    effectDescription(){
        return "boosting Game Point gain by x" + format(tmp[this.layer].effect) + " and Prestige gain by x" + format(tmp[this.layer].effect2)        
    },
    upgrades: {
        11: {
            title: "Best Wishes",
            description: "Boost Games gain based on your best Star count.",
            cost: new Decimal(2),
            effect() {
                let power = new Decimal(10).pow(player[this.layer].best)
                power = softcap(power, new Decimal(1e3), new Decimal(0.6))
                if (inChallenge('q', 12)) power = new Decimal(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "Gaming towards the Star",
            description: "The base multipliers for Tier 2 Game Buyables are better based on your stars.",
            cost: new Decimal(4),
            effect() {
                let power = player[this.layer].points.add(1).log(2).times(0.06)
                if (inChallenge('q', 12)) power = new Decimal(0)
                return power
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id), 4) },
            unlocked() { return player[this.layer].unlocked },
        },
        13: {
            title: "Prestige Power Interference",
            description: "Each Prestige Power Point gives a compounding x1.2 boost to Game Point gain.",
            cost: new Decimal(33),
            effect() {
                let power = new Decimal(1.2).pow(player.pp.points)
                if (inChallenge('q', 12)) power = new Decimal(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return hasChallenge('p', 22)},
        },
        14: {
            title: "Stella-rium",
            description: "Game Quality is boosted by Stars count.",
            cost: new Decimal(78),
            effect() {
                let power = new Decimal(0.006).times(player.s.points.pow(0.9)).add(1)
                if (inChallenge('q', 12)) power = new Decimal(1)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id), 4) },
            unlocked() { return hasChallenge('p', 22)},
        },
        15: {
            title: "Unlock the secrets",
            description: "Unlock Quantum.",
            cost: new Decimal(106),
            unlocked() { return hasChallenge('p', 22) },
        },
        21: {
            title: "XP Up!",
            description: "Your best Star count increases the Increment Limit.",
            cost: new Decimal(1485),
            effect() {
                let power = new Decimal(0.0006).times(player.s.best).add(1)
                if (inChallenge('q', 12)) power = new Decimal(1)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id), 4) },
            unlocked() { return hasMilestone('n', 0)},
        },
        22: {
            title: "Better, Faster, Stronger",
            description: "The first 3 Increment effects get a boost based on your Stars.",
            cost: new Decimal(2000),
            effect() {
                let power = new Decimal(0.005).times(player.s.best).add(1).pow(0.4)
                if (inChallenge('q', 12)) power = new Decimal(1)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id), 4) },
            unlocked() { return hasMilestone('n', 0)},
        },
    },
    buyables: {


    },
    milestones: {
        0: {requirementDescription: "2 Stars",
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: "Keep your Game Upgrades on Prestige and Stellar resets.",
        },
        1: {requirementDescription: "3 Stars",
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: "Keep your Game Buyables on Prestige and Stellar resets.",
        },
        2: {requirementDescription: "4 Stars",
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Autobuyers for the first 2 Game Buyables",
            toggles: [
                ["g", "auto1"]
            ],
        },
        3: {requirementDescription: "5 Stars",
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: "Keep your Prestige Milestones, Upgrades and Challenges on Stellar resets, and unlock 3 new Prestige Power Upgrades.",
            toggles: [
                ["p", "keep"]
            ],
        },
        4: {requirementDescription: "8 Stars",
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: "Autobuy Prestige Power and keep their Upgrades during Stellar Resets. You also generate 100% of your pending Prestige Points.",
        },
        5: {requirementDescription: "15 Stars",
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Choices (associated with Stellar), and Prestige Power resets nothing.",
        },
        6: {requirementDescription: "33 Stars",
            done() {return player[this.layer].best.gte(33)}, // Used to determine when to give the milestone
            effectDescription: "You can buy max Stars.",
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptMilestones = [];
        if (hasMilestone('q', 0)) {
        for(i=2;i<3;i++){ //rows
            if (hasMilestone(this.layer, i)) keptMilestones.push(i)
        }}
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if (hasMilestone('q', 2)) keep.push("upgrades")
        if (hasMilestone('q', 2)) keep.push("milestones")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].milestones.push(...keptMilestones);
        if (layers[prestige].row >= 3) player.q.increment = new Decimal(1);
        if (layers[prestige].row >= 3) player.q.buff = new Decimal(0);
        if (layers[prestige].row >= 3) player.q.power = new Decimal(0)
    },
    layerShown(){return hasUpgrade('pp', 13) ||  player[this.layer].unlocked}
}
)