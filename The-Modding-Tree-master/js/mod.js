let modInfo = {
	name: "The Tomozaki Game Tree",
	id: "tomozaki",
	author: "akivn",
	pointsName: "Game Points",
	modFiles: ["layers/game.js", "layers/prestige.js", "layers/prestigepower.js", "layers/stellar.js", "layers/choice.js", "layers/quantum.js", "layers/nova.js", "layers/achievement.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.001",
	name: "Le Tomozaki-kun Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0 (The Game Tree)</h3><br>
		- Added things up to Quantum (Row 4). Endgame at 100 Increments.<br>
		- 4 New Prestige Challenges!<br>
		- 5 New Buyables!<br>
		- Added some references!<br>
		- Added 8 achievements up to Prestige Power (Row 2)!
	<h3>v1.001 (The Tomozaki Game Tree)</h3><br>
		- kill shinwyste<br>
		- Added new Quantum buffs and Content!<br>
		- Quantum Challenges!<br>
		- Increment Limit and new formulae for buffs! You can now no longer break the game! xd<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('g', 13)) gain = gain.times(upgradeEffect('g', 13))
	if(hasUpgrade('g', 14)) gain = gain.times(upgradeEffect('g', 14))
	if(hasUpgrade('p', 14)) gain = gain.times(upgradeEffect('p', 14))
	if(hasUpgrade('pp', 11)) gain = gain.times(upgradeEffect('pp', 11))
	if(hasUpgrade('s', 13)) gain = gain.times(upgradeEffect('s', 13))
	if(hasUpgrade('c', 11)) gain = gain.times(1e5)
	gain = gain.times(tmp.g.effect)
	gain = gain.times(tmp.s.effect)
	gain = gain.times(tmp.q.increment.effect)
	gain = gain.times(tmp.ac.effect)
	if(hasAchievement('ac', 24)) gain = gain.times(achievementEffect('ac', 24))
	if(hasAchievement('ac', 41)) gain = gain.times(2)
	if(inChallenge('q', 21)) gain = gain.div(player.q.parents)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() { 
		if (inChallenge('q', 21)) return `Current Parents count: ${format(player.q.parents, 0)}`
		else return
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal('e7110'))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}