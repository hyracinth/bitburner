import HBBConstants from "libHBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");
	let op = (ns.args[0] == null) ? "WEAK" : ns.args[0];
	let host = (ns.args[1] == null) ? "iron-gym" : ns.args[1];
	let target = (ns.args[2] == null) ? "foodnstuff" : ns.args[2];

	let opFile;

	switch (op) {
		case "WEAK":
			opFile = HBBConstants.SCRIPT_MODULE_WEAKEN;
			break;
		case "GROW":
			opFile = HBBConstants.SCRIPT_MODULE_GROW;
			break;
	}

	if (host != "home") {
		await ns.scp(opFile, "home", host);
	}

	while (true) {
		let waitTime = ns.getWeakenTime(target);
		let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(opFile));
		if (threads > 0) {
			ns.exec(opFile, host, threads, target);
		}
		await ns.sleep(waitTime);
	}
}