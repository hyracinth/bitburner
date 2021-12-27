/** @param {NS} ns **/
export async function main(ns) {
	// ? last opt farm / hack

	ns.exec("customStats.js", "home", 1);

	let pid;

	pid = ns.exec("utilsNukeAll.js", "home", 1);
	while (ns.isRunning(pid)) {
		await ns.sleep(500);
	}

	let hackingLvl = ns.getHackingLevel();
	let phantasyLvl = ns.getServerRequiredHackingLevel("phantasy");
	let targetv1, targetv3;

	if (hackingLvl < 10) {
		targetv3 = "n00dles"
		targetv1 = "n00dles;"
	}
	else if (hackingLvl < phantasyLvl) {
		targetv3 = "foodnstuff";
		targetv1 = "joesguns";
	}
	else {
		targetv3 = "phantasy";
		targetv1 = "foodnstuff";
	}


	pid = ns.exec("hackv3EarlyStartup.js", "home", 1, targetv3);
	while (ns.isRunning(pid)) {
		await ns.sleep(500);
	}
	pid = ns.exec("hackv1Controller.js", "home", 1, targetv1);
	while (ns.isRunning(pid)) {
		await ns.sleep(500);
	}

	if (ns.args[0] == "farm") {
		ns.exec("utilsExpFarm.js", "home", 1);
	}
	else if (ns.args[0] == "hack") {
		ns.exec("hackv3StaggerBatch.js", "home", 1, targetv3);
	}
}