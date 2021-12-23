/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");
	var op = (ns.args[0] == null) ? "WEAK" : ns.args[0];
	var host = (ns.args[1] == null) ? "iron-gym" : ns.args[1];
	var target = (ns.args[2] == null) ? "foodnstuff" : ns.args[2];

	var weakFile = "/common/moduleWeaken.js";
	var growFile = "/common/moduleGrow.js"
	var opFile = weakFile;

	switch (op) {
		case "WEAK":
			opFile = weakFile;
			break;
		case "GROW":
			opFile = growFile;
			break;
	}

	if (host != "home") {
		await ns.scp(opFile, "home", host);
	}

	while (true) {
		var waitTime = ns.getWeakenTime(target);
		var threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(opFile));
		if (threads > 0) {
			ns.exec(opFile, host, threads, target);
		}
		await ns.sleep(waitTime);
	}
}