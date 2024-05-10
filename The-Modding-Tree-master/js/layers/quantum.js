addLayer("q", {
    name: "Quantum", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 3, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        increment: new Decimal(1),
        buff: new Decimal(0),
        power: new Decimal(0),
        bulk: new Decimal(1),
        limit: new Decimal(2).pow(1024),
        parents: new Decimal(0)
    }},
    color: "#229028",
    requires: new Decimal(106), // Can be a function that takes requirement increases into account
    resource: "Quantum", // Name of prestige currency
    baseResource: "Stars", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    base: 1.01,
    hotkeys: [ {key: "q", description: "Q: Reset for Quantum", onPress(){if (canReset(this.layer)) doReset(this.layer)}}, ],
    directMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('q', 21)) mult = mult.times(upgradeEffect('q', 21))
        if(hasUpgrade('q', 32)) mult = mult.times(upgradeEffect('q', 32))
        mult = mult.pow(tmp.n.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(14)
        exp = exp.times(tmp.n.effect)
        return exp
    },
    passiveGeneration() {
        return 0
    },
    increment: {
        mps() {
            let base = buyableEffect('q', 21).times(buyableEffect('q', 22)).times(buyableEffect('q', 31)).times(buyableEffect('q', 32))
            if (hasUpgrade('q', 11)) base = base.pow(tmp.q.power.effect)
            if (hasUpgrade('q', 14)) base = base.pow(upgradeEffect('q', 14))
            if (hasUpgrade('q', 23)) base = base.pow(upgradeEffect('q', 23))
            if (hasUpgrade('q', 33)) base = base.pow(upgradeEffect('q', 33))
            if (player.q.resetTime <= 0.06) base = new Decimal(1)
            if (inChallenge('q', 11) || inChallenge('q', 12) || inChallenge('q', 21) || inChallenge('q', 22)) base = new Decimal(1)
            if (player.q.increment.gte(tmp.q.limit.effect)) base = new Decimal(1)
            return base;
        },
        effect() {
            let powa = player.q.increment
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(60).add(1).pow(0.86)))
            if (hasChallenge('q', 11)) powa = powa.pow(tmp.q.challenges[11].rewardEffect)
            if (hasUpgrade('s', 22)) powa = powa.pow(upgradeEffect('s', 22))
            powa = powa.pow(tmp.n.effect)
            return powa
        },
        effect2() {
            let powa = new Decimal(1)
            if (player.q.increment.lte(10)) powa = new Decimal(1)
            else powa = player.q.increment.div(10).pow(0.8)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(30).add(1).pow(0.86)))
            if (hasChallenge('q', 11)) powa = powa.pow(tmp.q.challenges[11].rewardEffect)
                if (hasUpgrade('s', 22)) powa = powa.pow(upgradeEffect('s', 22))
            powa = powa.pow(tmp.n.effect)
            return powa
        },
        effect3() {
            let powa = new Decimal(1)
            if (player.q.increment.lte(239)) powa = new Decimal(1)
            else powa = player.q.increment.div(239).pow(0.6)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(10).add(1).pow(0.86)))
            if (hasChallenge('q', 11)) powa = powa.pow(tmp.q.challenges[11].rewardEffect)
            if (hasUpgrade('s', 22)) powa = powa.pow(upgradeEffect('s', 22))
            powa = powa.pow(tmp.n.effect)
            return powa
        },
        effect4() {
            let powa = new Decimal(1)
            if (player.q.increment.lte(453789)) powa = new Decimal(1)
            else powa = player.q.increment.div(453789)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(150).add(1).pow(0.7)))
            if (hasChallenge('q', 11)) powa = powa.pow(tmp.q.challenges[11].rewardEffect)
            powa = powa.pow(tmp.n.effect)
            return powa
        },
        effect5() {
            let powa = new Decimal(1)
            if (player.q.increment.lte(2.85e13)) powa = new Decimal(1)
            else powa = player.q.increment.div(2.85e13).pow(1.5)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(100).add(1).pow(0.68)))
            if (hasUpgrade('q', 24)) powa = powa.times(upgradeEffect('q', 24))
            if (hasChallenge('q', 11)) powa = powa.pow(tmp.q.challenges[11].rewardEffect)
            powa = powa.pow(tmp.n.effect)
            return powa
        },
        effect6() {
            let powa = new Decimal(0)
            if (player.q.increment.lte(1e32)) powa = new Decimal(0)
            else powa = player.q.increment.div(1e32).log(10).add(1).pow(0.7).minus(1)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).div(10).add(1).pow(0.99)))
            if (hasChallenge('q', 11)) powa = powa.times(tmp.q.challenges[11].rewardEffect)
            powa = powa.times(tmp.n.effect)
            return powa
        },
        effect7() {
            let powa = new Decimal(0)
            if (player.q.increment.lte(1.29e76)) powa = new Decimal(0)
            else powa = player.q.increment.div(1.29e76).log(10).div(1000).add(1).pow(0.7)
            powa = softcap(powa, new Decimal(1), new Decimal(1).div(powa.log(10).add(1).pow(0.6)))
            if (hasChallenge('q', 11)) powa = powa.times(tmp.q.challenges[11].rewardEffect)
            powa = powa.times(tmp.n.effect)
            return powa
        },
    },
    power: {
        effect() {
            let powa = new Decimal(0.03).times(player.q.power).add(1).pow(0.85)
            return powa
        },
    },
    limit: {
        effect() {
            let powa = player.q.limit
            if (getBuyableAmount('q', 11).gte(1)) powa = powa.pow(buyableEffect('q', 11))
            if (hasUpgrade('s', 21)) powa = powa.pow(upgradeEffect('s', 21))
            let chalcomp = new Decimal(0)
            for(i=1;i<4;i++){ //rows
                for(v=1;v<3;v++){ //cols
                    if (hasChallenge('q', 10*i+v)) chalcomp = chalcomp.add(1)
                }
            }
            powa = powa.pow(new Decimal(1.5).pow(chalcomp))
            if (hasMilestone('n', 1)) powa = powa.pow(tmp.n.effect3)
            return powa
        },
        time() {
            let ttl = tmp.q.limit.effect.log(10).minus(player.q.increment.log(10)).div(tmp.q.increment.mps.log(10))
            if (tmp.q.limit.effect == player.q.increment) ttl = new Decimal(0)
            return ttl
        }

    },
    parents: {
        mps() {
            let base = player.points.pow(0.1)
            return base;
        },
    },
    update(delta) {
        player.q.increment = player.q.increment.times(new Decimal(10).pow(tmp.q.increment.mps.log(10).div(20), delta));
        player.q.bulk = tmp.q.increment.mps.log(10).div(tmp[this.layer].bars.power.req.div(tmp[this.layer].bars.power.base).log(10)).div(20).ceil()
        if (tmp[this.layer].bars.buff.progress>=1) player[this.layer].buff = player[this.layer].buff.add(1);
        if (tmp[this.layer].bars.power.progress>=1 && tmp[this.layer].bars.power.unlocked) player[this.layer].power = player[this.layer].power.add(player.q.bulk);
        if (player.q.increment.gte(tmp.q.limit.effect)) player.q.increment = tmp.q.limit.effect
        if (inChallenge('q', 21)) player.q.parents = player.q.parents.times(new Decimal(10).pow(tmp.q.parents.mps.log(10).div(20), delta));
    },
    upgrades: {
        11: {
            title: "New Multiplier",
            description: "Add a new powerup milestone which powers up the multipliers once you reach a certain Increment.",
            cost: new Decimal(3),
        },
        12: {
            title: "New Helper",
            description: "Introduce 3 more helpers, which costs different currencies respectively.",
            cost: new Decimal(40),
        },
        13: {
            title: "Quantum Booster",
            description: "Unspent Quantum points boost Prestige Power gain.",
            cost: new Decimal(1000),
            effect() {
                let power = new Decimal(10).pow(player.q.points.add(1).log(10).times(500).pow(0.9))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Increment Booster",
            description: "Boost Increment growth based on your Game Points.",
            cost: new Decimal(5000),
            effect() {
                let power = player.points.add(10).log(10).div(1000).add(1)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
        21: {
            title: "Quantum Maximizer",
            description: "Multiply Quantum gain based on your Prestige Power Points.",
            cost: new Decimal(2e4),
            effect() {
                let power = player.pp.points.add(2).log(2).add(1)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "Better Base",
            description: "All base multipliers for Quantum Multipliers are now 1.1 (from 1.05).",
            cost: new Decimal(5e5),
        },
        23: {
            title: "Overclock",
            description: "Raise Increment Growth based on your Prestige points.",
            cost: new Decimal(5e6),
            effect() {
                let power = player.p.points.add(10).log(10).add(1).pow(0.12)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
        24: {
            title: "Star Divider",
            description: "Increment Effect 5 is stronger based on your Game Points.",
            cost: new Decimal(2.5e7),
            effect() {
                let power = player.points.pow(0.7).add(1)
                power = softcap(power, new Decimal(1), new Decimal(1).div(power.log(10).div(250).add(1).pow(0.5)))
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31: {
            title: "Star Easer",
            description: "Each unused Choice divides Star requirement by 1e225.",
            cost: new Decimal(1e9),
            effect() {
                let power = new Decimal(1e225).pow(player.c.points)
                return power
            },
            effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) },
        },
        32: {
            title: "Quantum Gaming",
            description: "Quantum gain is boosted by Games.",
            cost: new Decimal(5e9),
            effect() {
                let power = player.g.points.add(10).log(10).pow(0.45)
                return power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        33: {
            title: "Qubit Tunnel",
            description: "Unspent Quantum boost Increment multiplier.",
            cost: new Decimal(1e11),
            effect() {
                let power = player.q.points.add(10).log(10).pow(0.5)
                return power
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
        34: {
            title: "Scrodinger's Challenge",
            description: "Unlock Quantum Challenges, and Power buffs scales slower.",
            cost: new Decimal(5e11),
        },
    },
    buyables: {
        11: {
            title: "Limit Breaker",
            cost(x) { 
                let cost = new Decimal(10).pow(x.add(1).pow(1.65))
                return cost 
            },
            effect(x){
                let base = new Decimal(2)
                let power = base.pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Quantum\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Increases the limit by ^" + format(buyableEffect(this.layer, this.id))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
        },
        21: {
            title: "Quantum Multiplier 1",
            cost(x) { 
                let cost = new Decimal(2).pow(x)
                return cost 
            },
            effect(x){
                let base = new Decimal(1.05)
                if (hasUpgrade('q', 22)) base = new Decimal(1.1)
                let power = base.pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Quantum\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Increment by x" + format(buyableEffect(this.layer, this.id), 4)+" per second"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
        },
        22: {
            title: "Quantum Multiplier 2",
            cost(x) { 
                let cost = new Decimal('1e800').pow(x)
                return cost 
            },
            effect(x){
                let base = new Decimal(1.05)
                if (hasUpgrade('q', 22)) base = new Decimal(1.1)
                let power = base.pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Games\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Increment by x" + format(buyableEffect(this.layer, this.id), 4)+" per second"
            },
            canAfford() { return player.g.points.gte(this.cost()) },
            buy() {
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return hasUpgrade('q', 12) },
        },
        31: {
            title: "Quantum Multiplier 3",
            cost(x) { 
                let cost = new Decimal(2).pow(new Decimal(1024).times(x))
                return cost 
            },
            effect(x){
                let base = new Decimal(1.05)
                if (hasUpgrade('q', 22)) base = new Decimal(1.1)
                let power = base.pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Prestiges\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Increment by x" + format(buyableEffect(this.layer, this.id), 4)+" per second"
            },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return hasUpgrade('q', 12) },
        },
        32: {
            title: "Quantum Multiplier 4",
            cost(x) { 
                let cost = new Decimal(106).times(new Decimal(1.1).pow(x)).round()
                return cost 
            },
            effect(x){
                let base = new Decimal(1.05)
                if (hasUpgrade('q', 22)) base = new Decimal(1.1)
                let power = base.pow(x)
                return power
            },
            display() { let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " Stars\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Multiplies Increment by x" + format(buyableEffect(this.layer, this.id), 4)+" per second"
            },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            autoBuy() { return false },
            unlocked() { return hasUpgrade('q', 12) },
        },
    },
    challenges: {
        11: {
            name: "Challenge-less",
            challengeDescription(){
                return "All Prestige Challenge's Rewards are disabled."
            },
            goalDescription() {
                return '1e1530 Game Points'
            },
            rewardEffect(){
                let b = new Decimal(0.12).times(new Decimal(challengeCompletions(this.layer, this.id)))
                return b.add(1)
            },
            rewardDescription: "Gain a +^0.12 boost to Every Quantum boost.",
            rewardDisplay() {
                return "^" + format(tmp[this.layer].challenges[this.id].rewardEffect)
            },
            canComplete() { return player.points.gte('1e1530') },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
            },
        },
        12: {
            name: "Starless",
            challengeDescription(){
                return "Stellar boosts and upgrades does nothing."
            },
            goalDescription() {
                return '1e1670 Game Points'
            },
            rewardEffect(){
                let b = player.q.points.times(new Decimal(challengeCompletions(this.layer, this.id))).add(1).pow(100)
                b = softcap(b, new Decimal(1), new Decimal(1).div(b.log(10).add(1).pow(0.097)))
                return b
            },
            rewardDescription: "Divide Star scaling based on your Quantum Points, and unlock Nova.",
            rewardDisplay() {
                return "/" + format(tmp[this.layer].challenges[this.id].rewardEffect)
            },
            canComplete() { return player.points.gte('1e1670') },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
            },
        },
        21: {
            name: "Parents",
            challengeDescription(){
                return "There is now parents who are counteracting with your playerbase. These parents grow exponentially and divides your Game Point gain."
            },
            goalDescription() {
                return '1e2750 Game Points'
            },
            rewardEffect(){
                let b = new Decimal(4).div(player.q.points.add(10).log(10).div(10).pow(0.5)).add(2)
                return b
            },
            rewardDescription: "The Power buff scales even slower based on your Quantum.",
            rewardDisplay() {
                return "Base " + format(tmp[this.layer].challenges[this.id].rewardEffect)
            },
            canComplete() { return player.points.gte('1e2750') },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
                player.q.parents = new Decimal(1)
            },
            onExit(){
                player.q.parents = new Decimal(0)
            },
        },
        22: {
            name: "All-in-one",
            challengeDescription(){
                return "Prestige Challenges 1,2,4 at once. However, Prestige gain is squared."
            },
            goalDescription() {
                return '1e410 Game Points'
            },
            rewardEffect(){
                let b = player.q.points.pow(32)
                return b
            },
            rewardDescription: "Prestige gain is boosted by Quantum.",
            rewardDisplay() {
                return format(tmp[this.layer].challenges[this.id].rewardEffect) + "x" 
            },
            canComplete() { return player.points.gte('1e410') },
            onEnter(){
                setBuyableAmount('g', 11, new Decimal(0))
                setBuyableAmount('g', 12, new Decimal(0))
                setBuyableAmount('g', 21, new Decimal(0))
                setBuyableAmount('g', 22, new Decimal(0))
                player.q.parents = new Decimal(1)
            },
            onExit(){
                player.q.parents = new Decimal(0)
            },
        },
    },
    bars: {
        buff: {
            direction: RIGHT,
            width: 750,
            height: 25,
            req(){
                let x = player.q.buff
                let req = new Decimal(1)
                if (x.lte(6)) req = new Decimal(10).pow(new Decimal(2).pow(x).pow(1.25))
                else req = new Decimal(1e310)
                return req
            },
            progress() {
                return (player.q.increment.add(1).log(10)).div(tmp[this.layer].bars[this.id].req.add(1).log(10))
            },
            unlocked() { return true },
            display() {
                if (player[this.layer].buff.lte(6)) return "Next buff at: "+formatWhole(tmp[this.layer].bars[this.id].req)+" Increments ("+format(100-tmp[this.layer].bars[this.id].progress, 3)+"%)"
                else return "Maxed!"
            },
            fillStyle: {"background-color": "#229028"},
        },
        limit: {
            direction: RIGHT,
            width: 750,
            height: 25,
            req(){
                let x = tmp.q.limit.effect
                return x
            },
            progress() {
                return (player.q.increment.add(1).log(10)).div(tmp[this.layer].bars[this.id].req.add(1).log(10))
            },
            unlocked() { return true },
            display() {
                if (tmp.q.limit.time.lte(0.1)) return `Increment Limit: ${format(tmp.q.limit.effect)} (${format(100-tmp[this.layer].bars[this.id].progress, 3)}%), Maxed!`
                else return `Increment Limit: ${format(tmp.q.limit.effect)} (${format(100-tmp[this.layer].bars[this.id].progress, 3)}%), ~${format(tmp.q.limit.time)}s till limit`
            },
            fillStyle() {
                let r = 34 + (158) * tmp.q.bars.limit.progress * (2);
                let g = 144 + (48) * tmp.q.bars.limit.progress * (2);
                let b = 40 - (40) * tmp.q.bars.limit.progress;
                if (tmp.q.bars.limit.progress.gte(0.5)) r = 192 + (16) * (tmp.q.bars.limit.progress.minus(0.5)) * (2)
                if (tmp.q.bars.limit.progress.gte(0.5)) g = 192 - (192) * (tmp.q.bars.limit.progress.minus(0.5)) * (2)
                return {
                    "background-color": ("rgb(" + r + ", " + g + ", " + b + ")")
                }
            },
        },
        power: {
            direction: RIGHT,
            width: 750,
            height: 25,
            req(){
                let x = player.q.power
                let req = new Decimal(1e3)
                let base = new Decimal(10)
                let pow = new Decimal(1.01)
                if (hasUpgrade('q', 34)) base = new Decimal(6)
                if (hasChallenge('q', 21)) base = challengeEffect('q', 21)
                if (hasUpgrade('q', 34)) pow = new Decimal(1.007)
                req = req.times(new Decimal(base).pow(new Decimal(pow).pow(x).times(x)))
                return req
            },
            base(){
                let x = player.q.power
                let req = new Decimal(1e3)
                let base = new Decimal(10)
                let pow = new Decimal(1.01)
                if (hasUpgrade('q', 34)) base = new Decimal(6)
                if (hasChallenge('q', 21)) base = challengeEffect('q', 21)
                if (hasUpgrade('q', 34)) pow = new Decimal(1.007)
                if (x.lte(0)) req = new Decimal(1)
                else if (x.lte(1)) req = new Decimal(1e3)
                else req = req.times(new Decimal(base).pow(new Decimal(pow).pow(x.minus(1)).times(x.minus(1))))
                return req
            },
            progress() {
                return (player.q.increment.add(1).log(10).minus(tmp[this.layer].bars[this.id].base.add(1).log(10))).div(tmp[this.layer].bars[this.id].req.add(1).log(10).minus(tmp[this.layer].bars[this.id].base.add(1).log(10)))
            },
            unlocked() { return hasUpgrade('q', 11) },
            display() {
                return `Next Power buff at: ${formatWhole(tmp[this.layer].bars[this.id].req)} Increments (${(format(100-tmp[this.layer].bars[this.id].progress, 3))}%)`
            },
            fillStyle: {"background-color": "#229028"},
        },
    },
    milestones:{
        0: {requirementDescription: "1 Quantum",
        done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
        effectDescription: "Keep your Game upgrades, Prestige Milestones (Except 3rd) and Stellar Milestone 3 on Row 4 resets.",
        },
        1: {requirementDescription: "5 Quantum",
        done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
        effectDescription: "Keep your Prestige Upgrades on Row 4 resets.",
        },
        2: {requirementDescription: "10 Quantum",
        done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
        effectDescription: "Keep your Stellar Milestones and Upgrades on Row 4 resets.",
        },
        3: {requirementDescription: "300 Quantum",
        done() {return player[this.layer].best.gte(300)}, // Used to determine when to give the milestone
        effectDescription: "Stellar resets reset nothing, and autobuy Stars.",
        },
        4: {requirementDescription: "1250 Quantum",
        done() {return player[this.layer].best.gte(1250)}, // Used to determine when to give the milestone
        effectDescription: "Keep all your bought choices on Row 4 resets.",
        },

    },
    tabFormat: {
        "Increment": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Your Increment is ${format(player.q.increment)}` }, { 'font-size': '19.8px', 'color': 'silver' }],
                ['display-text', function() { return `boosting Game Point gain by ${format(tmp.q.increment.effect)}x`}, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(1)) return `boosting Games gain by ${format(tmp.q.increment.effect2)}x`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(2)) return `boosting Prestige gain by ${format(tmp.q.increment.effect3)}x`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(3)) return `boosting Prestige Power gain by ${format(tmp.q.increment.effect4)}x`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(4)) return `Divide Star requirement by /${format(tmp.q.increment.effect5)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(5)) return `Boost Tier 2 Game Buyables' Base multiplier by +${format(tmp.q.increment.effect6)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(6)) return `Power up Quality and Playerbase gain to ^${format(tmp.q.increment.effect7, 4)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() { 
                    if (player.q.buff.gte(7)) return `and Unlock Infinite choices.`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                "blank",
                ['display-text', function() { return `Increment Multiplier: x${format(tmp.q.increment.mps, 4)} / sec` }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    if (hasUpgrade('q', 11)) return `You have ${format(player.q.power)} power buffs, powering the Multiplier to ^${format(tmp.q.power.effect)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Increment limit: ${format(tmp.q.limit.effect)}`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ["bar", "buff"],
                ["bar", "power"],
                ["bar", "limit"],
                "buyables",

            ],
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Increment Multiplier: x${format(tmp.q.increment.mps, 4)} / sec` }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    if (hasUpgrade('q', 11)) return `You have ${format(player.q.power)} power buffs, powering the Multiplier to ^${format(tmp.q.power.effect)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Increment limit: ${format(tmp.q.limit.effect)}`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ["bar", "buff"],
                ["bar", "power"],
                ["bar", "limit"],
                "milestones",

            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Increment Multiplier: x${format(tmp.q.increment.mps, 4)} / sec` }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    if (hasUpgrade('q', 11)) return `You have ${format(player.q.power)} power buffs, powering the Multiplier to ^${format(tmp.q.power.effect)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Increment limit: ${format(tmp.q.limit.effect)}`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ["bar", "buff"],
                ["bar", "power"],
                ["bar", "limit"],
                "upgrades",

            ],
        },
        "Challenges": {
            content: [
                "main-display",
                "prestige-button",
                ['display-text', function() { return `Increment Multiplier: x${format(tmp.q.increment.mps, 4)} / sec` }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    if (hasUpgrade('q', 11)) return `You have ${format(player.q.power)} power buffs, powering the Multiplier to ^${format(tmp.q.power.effect)}`
                    else return
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Increment limit: ${format(tmp.q.limit.effect)}`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Increment gain is disabled in Quantum Challenges.`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ['display-text', function() {
                    return `Each completed challenge raises the limit by a compounding ^1.5 boost.`
                }, { 'font-size': '14.7px', 'color': 'silver' }],
                ["bar", "buff"],
                ["bar", "power"],
                ["bar", "limit"],
                "challenges",

            ],
            unlocked() {
                return (hasUpgrade('q', 34))
            }
        },
    },
    doReset(prestige) {
        // Stage 1, almost always needed, makes resetting this layer not delete your progress
        if (layers[prestige].row <= this.row) return
        
        // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 21, Milestones
        let keptUpgrades = [];
    
        // Stage 3, track which main features you want to keep - milestones
        let keep = [];
        keep.push("upgrades")
        keep.push("buyables")
    
        // Stage 4, do the actual data reset
        layerDataReset(this.layer, keep);
    
        // Stage 5, add back in the specific subfeatures you saved earlier
        player[this.layer].upgrades.push(...keptUpgrades);
    },
    layerShown(){return hasUpgrade('s', 15) ||  player[this.layer].unlocked}
})
