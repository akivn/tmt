addLayer("c", {
    name: "Choices", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 2, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#f244aa",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    resource: "Choices", 
    canBuyMax() {return true},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(delta) {
        if (tmp[this.layer].bars.Choice.unlocked) {
            if (tmp[this.layer].bars.Choice.progress>=1) {
                player[this.layer].points = player[this.layer].points.add(1);
                player[this.layer].total = player[this.layer].total.add(1);
            }
        }
    },
    bars: {
        Choice: {
            direction: RIGHT,
            width: 555,
            height: 66,
            req(){
                let x = player.c.total
                let req = new Decimal(1)
                if (x.lte(4)) req = new Decimal(1e60).pow(x.times(0.2).add(1).pow(1.8))
                if (x.gte(5) && player.q.buff.gte(7)) req = new Decimal('1e1200').pow(x.minus(5).times(0.35).add(1).pow(1.5))
                if (x.gte(5) && player.q.buff.lte(6)) req = new Decimal(1e310)
                return req
            },
            progress() {
                return (player.p.points.add(1).log(10)).div(tmp.c.bars.Choice.req.add(1).log(10))
            },
            unlocked() { return true },
            display() {
                if (player[this.layer].total.lte(4) || player.q.buff.gte(7)) return "Next: "+formatWhole(tmp[this.layer].bars.Choice.req)+" Prestiges ("+format(100-tmp[this.layer].bars.Choice.progress, 3)+"%)"
                else return "Maxed!"
            },
            fillStyle: {"background-color": "#f244aa"},
        },
    },
    upgrades: {
        11: {
            title: "Game Point Multiplier",
            description: "x1e5 Game Points",
            cost: new Decimal(1),
        },
        12: {
            title: "Game Multiplier",
            description: "x1e4 Games",
            cost: new Decimal(1),
        },
        13: {
            title: "Prestige Power Multiplier",
            description: "x1e7 Prestige Power",
            cost: new Decimal(1),
        },
        14: {
            title: "Stellar Boost",
            description: "Stellar effect ^1.5",
            cost: new Decimal(2),
            unlocked() {return challengeCompletions('p', 22) >= 1},
        },
        15: {
            title: "Playerbase Boost Booster",
            description: "Playerbase boost ^2.25",
            cost: new Decimal(2),
            unlocked() {return challengeCompletions('p', 22) >= 1},
        },

    },
    buyables: {


    },
    milestones: {

    },
    challenges: {
        
    },
    clickables: {
        11: {
            display() {return "Respec upgrades, but doing a Stellar Reset"},
            onClick() {
                if(confirm("Are you sure you want to respec? This will cause a Stellar Reset!")) {
                    let total = new Decimal(0)
                    for(i=11;i<14;i++){ //upgrade numbers
                        if (hasUpgrade('c', i)) total = total.add(1)
                    }
                    for(i=14;i<16;i++){ //upgrade numbers
                        if (hasUpgrade('c', i)) total = total.add(2)
                    }
                    player.c.upgrades = player.c.upgrades.filter(id => id < 9)
                    doReset('s', true)
                    player.c.points = player.c.points.add(total)
                    player.c.total = player.c.points
                }
            },
            canClick() {return true},
            style: {
                minWidth: "120px",
                minHeight: "120px",
            },
        }
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                ["bar", "Choice"],
                "clickables",
                "upgrades",
            ],
        },
    },
    doReset(pp) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[pp].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        if(hasMilestone('q', 4)) keep.push('upgrades')
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
        if(hasMilestone('q', 4)) {
            for(i=11;i<14;i++){ //rows
                if (hasUpgrade(this.layer, i)) player.c.total = player.c.total.add(1)
            }
            for(i=14;i<16;i++){ //rows
                if (hasUpgrade(this.layer, i)) player.c.total = player.c.total.add(2)
            }
        }
    },  

    layerShown(){return hasMilestone('s', 5) || player.q.unlocked}
  }
)