addLayer("n", {
    name: "Nova", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 3, // Row the layer is in on the tree (0 is the first row)
    branches: [],
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#f759f2",
    resource: "Novae", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        let effect = new Decimal(0.12).times(player[this.layer].points).add(1).pow(0.7)
        return effect
    },
    effect2() {
        let effect = new Decimal(0.04).times(player[this.layer].points).add(1)
        return effect
    },
    effectDescription(){
        return "boosting Quantum gain by ^" + format(tmp[this.layer].effect) + " and raising Increment Power by " + format(tmp[this.layer].effect2)   
    },
    update(delta) {
        if (tmp[this.layer].bars.Nova.unlocked) {
            if (tmp[this.layer].bars.Nova.progress>=1) {
                player[this.layer].points = player[this.layer].points.add(1);
                player[this.layer].total = player[this.layer].total.add(1);
            }
        }
    },
    bars: {
        Nova: {
            direction: RIGHT,
            width: 555,
            height: 66,
            req(){
                let x = player.n.total
                let req = new Decimal(1115)
                req = req.times(x.times(0.05).add(1).pow(1.65)).ceil()
                return req
            },
            base(){
                let x = player.n.total
                let base = new Decimal(1115)
                if (x.lte(0)) base = new Decimal(0)
                else if (x.gte(2)) base = base.times((x.minus(1)).times(0.05).add(1).pow(1.65)).ceil()
                return base
            },
            progress() {
                return (player.s.points.minus(tmp.n.bars.Nova.base)).div(tmp.n.bars.Nova.req.minus(tmp.n.bars.Nova.base))
            },
            unlocked() { return true },
            display() {
                return `Next Nova at ${formatWhole(tmp[this.layer].bars.Nova.req)} Stars (${format(100-tmp[this.layer].bars.Nova.progress, 3)}%)`
            },
            fillStyle() {
                let r = 192 + (55) * tmp.n.bars.Nova.progress
                let g = 0 + (89) * tmp.n.bars.Nova.progress
                let b = 0 + (242) * tmp.n.bars.Nova.progress
                return {
                    "background-color": ("rgb(" + r + ", " + g + ", " + b + ")")
                }
            },
        },
    },
    upgrades: {
    },
    buyables: {
    },
    milestones: {
        0: {requirementDescription: "4 Novae",
            done() {return player.n.points.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Unlock 5 new Stellar Upgrades.",
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["bar", "Nova"],
                "milestones",
            ],
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return;
    
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptMilestones = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].milestones.push(...keptMilestones);
    },
    layerShown(){return hasChallenge('q', 12) ||  player[this.layer].unlocked}
}
)