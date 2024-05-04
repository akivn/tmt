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
    } 
    
})
