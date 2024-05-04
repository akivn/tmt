addLayer("p", {
    name: "Prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['pp', 's'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#4274ad",
    requires: new Decimal(2000), // Can be a function that takes requirement increases into account
    resource: "Prestige", // Name of prestige currency
    baseResource: "Games", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    hotkeys: [ {key: "p", description: "P: Reset for Prestiges", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('g', 34)) mult = mult.times(upgradeEffect('g', 34))
        if (hasUpgrade('pp', 21)) mult = mult.times(upgradeEffect('pp', 21))
        mult = mult.times(tmp.s.effect2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = new Decimal(1).add(player[this.layer].points).pow(0.8)
        softcap(effect, new Decimal(1e85), new Decimal(0.95).pow(effect.add(10).log(10).minus(85).div(20)).add(0.05))
        if(hasChallenge('p', 12)) effect = effect.pow(tmp.p.challenges[12].rewardEffect)
        if(inChallenge('p', 12)) effect = new Decimal(1)
        return effect
    },
    effect2() {
        let effect = new Decimal(1).add(player[this.layer].points).pow(1.4)
        softcap(effect, new Decimal(1e4), new Decimal(0.95).pow(effect.add(10).log(10).minus(4)).add(0.05))
        if(hasChallenge('p', 12)) effect = effect.pow(tmp.p.challenges[12].rewardEffect)
        if(inChallenge('p', 12)) effect = new Decimal(1)
        return effect
    },
    effectDescription(){
            return "boosting Games gain by x" + format(tmp[this.layer].effect) + " and Quality gain by x" + format(tmp[this.layer].effect2)        
    },
    passiveGeneration() {
        if(hasMilestone("s", 4)) return 1;
        return 0
        },
    upgrades: {
        11: {
            title: "Quality Refinement",
            description: "Massively Improve the formula of Quality Boost to Game Point gain.",
            cost: new Decimal(2),
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "Retainment",
            description: "Boost Playerbase gain based on your Games.",
            cost: new Decimal(5),
            effect() {
                let effect = new Decimal(1).add(player.g.points).add(2).log(2)
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return player[this.layer].unlocked },
        },
        13: {
            title: "Game Specification",
            description: "Adds 2 new Game Buyables and 4 new Game Upgrades.",
            cost: new Decimal(10),
            unlocked() { return player[this.layer].unlocked },
        },
        14: {
            title: "Game Point!",
            description: "Game point gain is boosted by Prestige Points.",
            cost: new Decimal(150),
            effect() {
                let effect = new Decimal(1).add(player[this.layer].points).pow(0.5)
                effect = softcap(effect, new Decimal(1e50), new Decimal(0.5).pow(effect.add(10).log(10).div(50)).add(0.25))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() { return player[this.layer].unlocked },
        },
        21: {
            title: "Enhancer Enhancer",
            description: "The Tier 2 Game Buyables have a better base multiplier.",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade('p', 14)},
        },
        22: {
            title: "Prestige Game",
            description: "Unlock Prestige Games (Challenges) and Prestige Power, and raise the effect of 'Synergy' to ^1.5.",
            cost: new Decimal(20000),
            unlocked() { return player[this.layer].unlocked },
        },

    },
    buyables: {


    },
    milestones: {
        0: {requirementDescription: "10 Prestiges",
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Keep your Game Upgrades on Prestige Resets.",
        },
        1: {requirementDescription: "50 Prestiges",
            done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
            effectDescription: "Gain 1% of your pending Game points per second.",
        },
        2: {requirementDescription: "200 Prestiges",
            done() {return player[this.layer].best.gte(200)}, // Used to determine when to give the milestone
            effectDescription: "Keep your Game Buyables on Prestige Resets.",
        },
        3: {requirementDescription: "2500 Prestiges",
            done() {return player[this.layer].best.gte(2500)}, // Used to determine when to give the milestone
            effectDescription: "Gain 100% of your pending Game points per second.",
        },
    },
    challenges: {
        11: {
            name: "Nonsense",
            completionLimit: 5,
            challengeDescription(){
                return "You cannot gain Quality or Playerbase. <br>Completions: " + challengeCompletions(this.layer, this.id) + "/5"
            },
            goalDescription() {
                return format(["1e7", "1e11", "5e83", "1e185", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) + ' Game Points'
            },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            rewardEffect(){
                let b = new Decimal(0.15).times(new Decimal(challengeCompletions(this.layer, this.id)))
                return b.add(1)
            },
            rewardDescription: "Gain a +^0.15 boost to Quality and Playerbase every completion.",
            rewardDisplay() {
                return "^" + format(tmp[this.layer].challenges[this.id].rewardEffect)
            },
            canComplete() { return player.points.gte(["1e7", "1e11", "5e83", "1e185", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) },
            onEnter(){
                if (challengeCompletions(this.layer, this.id) >= 2) setBuyableAmount('g', 11, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 2) setBuyableAmount('g', 12, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 2) setBuyableAmount('g', 21, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 2) setBuyableAmount('g', 22, new Decimal(0))
            },
        },
        12: {
            name: "Prestige for Nothing",
            completionLimit: 5,
            challengeDescription(){
                return "Prestiges boost does nothing. <br>Completions: " + challengeCompletions(this.layer, this.id) + "/5"
            },
            goalDescription() {
                return format(["1e18", "1e33", "1e242", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) + ' Game Points'
            },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            rewardEffect(){
                let b = new Decimal(0.2).times(new Decimal(challengeCompletions(this.layer, this.id)))
                return b.add(1)
            },
            rewardDescription: "Gain a +^0.2 boost to Prestige boost every completion",
            rewardDisplay() {
                return "^" + format(tmp[this.layer].challenges[this.id].rewardEffect)
            },
            canComplete() { return player.points.gte(["1e18", "1e33", "1e242", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) },
            onEnter(){
                if (challengeCompletions(this.layer, this.id) >= 1) setBuyableAmount('g', 11, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 1) setBuyableAmount('g', 12, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 1) setBuyableAmount('g', 21, new Decimal(0))
                if (challengeCompletions(this.layer, this.id) >= 1) setBuyableAmount('g', 22, new Decimal(0))
            },
        },
        21: {
            name: "Gamelack",
            completionLimit: 5,
            challengeDescription(){
                return "The Games gain is raised to ^0.01. <br>Completions: " + challengeCompletions(this.layer, this.id) + "/5"
            },
            goalDescription() {
                return format(["1e57", "1e100", "1e194", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) + ' Game Points'
            },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            rewardEffect(){
                let b = player.p.points.add(1).pow(new Decimal(0.12).times(new Decimal(challengeCompletions(this.layer, this.id)).pow(1.5))).minus(1)
                b = softcap(b, new Decimal(1e20), new Decimal(0.28))
                return b.add(1)
            },
            rewardDescription: "Multiply Games gain even more based on your Prestige Point, and unlock Tier 2 Game Buyables' Automator.",
            rewardDisplay() {
                return format(tmp[this.layer].challenges[this.id].rewardEffect) + "x"
            },
            canComplete() { return player.points.gte(["1e57", "1e100", "1e194", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
            },
            unlocked() {return hasUpgrade('pp', 23)},
        },
        22: {
            name: "Locked Power",
            completionLimit: 5,
            challengeDescription(){
                return "Prestige Power gain is disabled, and Quality gain is square rooted. <br>Completions: " + challengeCompletions(this.layer, this.id) + "/5"
            },
            goalDescription() {
                return format(["1e142", "1e220", "1e1000", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) + ' Game Points'
            },
            currencyDisplayName: "points",
            currencyInternalName: "points",
            rewardEffect(){
                let b = new Decimal(1e10).pow(new Decimal(challengeCompletions(this.layer, this.id)))
                return b
            },
            rewardDescription: "Multiply Prestige Power gain by a constant x1e10 every completion, and unlock 2 more choices and 3 new Stellar Upgrades upon first completion.",
            rewardDisplay() {
                return format(tmp[this.layer].challenges[this.id].rewardEffect) + "x"
            },
            canComplete() { return player.points.gte(["1e142", "1e220", "1e1000", "1e9350", "e13000", Decimal.dInf][new Decimal(challengeCompletions(this.layer, this.id))]) },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
                player.pp.power = new Decimal(0)
            },
            unlocked() {return hasUpgrade('pp', 23)},
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "milestones",
                "upgrades",
            ],
        },
        "Challenge": {
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() {
                return (hasUpgrade('p', 22))
            }
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptMilestones = [];
        for(i=0;i<1;i++){ //rows
            if (hasMilestone(this.layer, i)) keptMilestones.push(i)
        }
        if (hasMilestone('q', 0)) {
            for(i=0;i<2;i++){
                if (hasMilestone(this.layer, i)) keptMilestones.push(i)
            }
            for(i=3;i<4;i++){
                if (hasMilestone(this.layer, i)) keptMilestones.push(i)
            }
        }
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if (hasMilestone('s', 3)) keep.push("upgrades")
        if (hasMilestone('s', 3)) keep.push("milestones")
        if (hasMilestone('s', 3)) keep.push("challenges")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].milestones.push(...keptMilestones);
    },  
    layerShown(){return hasUpgrade('g', 24) ||  player[this.layer].unlocked}
  }
)
