addLayer("ac", {
    startData() { return {                 
        unlocked: true,                     
        points: new Decimal(0),             
    }},
    name: "Achievement",
    symbol: "a",
    color: "#ffff00",                      
    resource: "Achievement Points",           
    row: "side",                                            

    type: "none",     
    effect() {
        let effect = new Decimal(1.01).pow(player[this.layer].points)
        return effect
    },
    effectDescription(){
        return "boosting Game point gain by x" + format(tmp[this.layer].effect)      
    },                                           

    layerShown() { return true },
    achievements: {
        11: {
            name: "Start your gaming Journey",
            tooltip: "Get a Game.",
            done() { return player.g.points.gte(1) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        12: {
            name: "Reinforce!",
            tooltip: "Get the first Game Upgrade.",
            done() { return hasUpgrade('g', 11) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        13: {
            name: "Tomozaki's Fame",
            tooltip: "Get 10 Players.",
            done() { return player.g.players.gte(10) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        14: {
            name: "Faker Games",
            tooltip: "Get the fifth Game Upgrade.",
            done() { return hasUpgrade('g', 21) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        21: {
            name: "Prestige!",
            tooltip: "Prestige.",
            done() { return player.p.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        22: {
            name: "Insane Quality",
            tooltip: "Get 1e8 Game Quality.",
            done() { return player.g.quality.gte(1e8) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        23: {
            name: "CHALLENGE MODE",
            tooltip: "Complete a challenge.",
            done() { return challengeCompletions('p', 11) >= 1 },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        24: {
            name: "The World Likes the Game",
            tooltip() {
                return "Get 8.106e9 Players. Reward: A small boost on Game point gain based on your total time played. Currently: " + format(achievementEffect(this.layer, this.id))+"x"
            },
            done() { return player.g.players.gte(8.106e9) },
            effect() {
                let effect = new Decimal(player.timePlayed).add(2).log(2).pow(0.05)
                return effect
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        31: {
            name: "Power Up!",
            tooltip: "Unlock Prestige Power.",
            done() { return player.pp.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        32: {
            name: "Infinite Impression",
            tooltip: "Make your game quality over 1.8e308.",
            done() { return player.g.quality.gte('1.8e308') },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        33: {
            name: "Prestige god",
            tooltip: "Have 1e10 Prestige Power.",
            done() { return player.pp.power.gte(1e10) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        34: {
            name: "Haters",
            tooltip() {
                return "Get 1e20 Games on Prestige Challenge 1. Reward: A small boost on Game gain based on your total time played. Currently: " + format(achievementEffect(this.layer, this.id))+"x"
            },
            done() { return player.g.points.gte(1e20) && inChallenge('p', 11) },
            effect() {
                let effect = new Decimal(player.timePlayed).add(2).log(2).pow(0.07)
                return effect
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        41: {
            name: "Prima Stella",
            tooltip: "Go Stellar. Reward: A flat 2x boost on Game point gain.",
            done() { return player.s.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        42: {
            name: "The Universe isn't enough",
            tooltip: "Have 1e27 players.",
            done() { return player.g.players.gte(1e27) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        43: {
            name: "Star Game",
            tooltip: "Gain a 1e10x boost on Stellar Upgrade 1. Reward: A flat 5x boost to Prestige Power gain.",
            done() { return upgradeEffect('s', 11).gte(1e10) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        44: {
            name: "What is the meaning of Challenge?",
            tooltip() {
                return "Get 1e20 Prestige without any Challenge completed. Reward: A small boost on Prestige gain based on your total time played. Currently: " + format(achievementEffect(this.layer, this.id))+"x"
            },
            done() { return player.p.points.gte(1e20) && new Decimal(challengeCompletions('p', 11)).add(new Decimal(challengeCompletions('p', 12))).add(new Decimal(challengeCompletions('p', 21))).add(new Decimal(challengeCompletions('p', 22))).lte(0) },
            effect() {
                let effect = new Decimal(player.timePlayed).add(2).log(2).pow(0.075)
                return effect
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        51: {
            name: "How to choose?",
            tooltip: "Gain your first choice.",
            done() { return player.c.points.gte(1) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        52: {
            name: "Choose 'em all!",
            tooltip: "Have 4 choices at once.",
            done() {
                let count = new Decimal(0)
                let o = false
                for(i=11;i<16;i++){ //columns
                    if (hasUpgrade('c', i)) count = count.add(1)
                }
                if (count.gte(4)) o = true
                return o
            },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        53: {
            name: "How to game in lockdown",
            tooltip: "Have 1e4 games in Prestige Challenge 3.",
            done() { return player.g.points.gte(1e4) && inChallenge('p', 21) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        54: {
            name: "My Power is Unstoppable",
            tooltip: "Have 308 Prestige Power Points.",
            done() { return player.pp.points.gte(308) },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        61: {
            name: "Quantum",
            tooltip: "Go Quantum.",
            done() { return player.q.unlocked },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
        62: {
            name: "Girlfriend Paradox",
            tooltip: "Have 1.8e308 Increments.",
            done() { return player.q.increment.gte('1.8e308') },
            onComplete() {
                player[this.layer].points = player[this.layer].points.add(1)
            }
        },
    } 
    
})
