/** @param {NS} ns **/
export async function main(ns) {
	var host = (ns.args[0] == null) ? "home" : ns.args[0];
	var target = (ns.args[1] == null) ? "joesguns" : ns.args[1];
	var threads = ns.args[2];
	var targetHackLvl = (ns.args[3] == null) ? 3000 : ns.args[3];

	var baseOp = "/common/baseOperations.js";

	if (host != "home") {
		await ns.scp(baseOp, "home", host);
	}

	while (ns.getHackingLevel() < targetHackLvl) {
		if (threads == null) {
			threads = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(baseOp);
		}
		var waitTime = ns.getWeakenTime(target);
		var pid = ns.exec(baseOp, host, threads, target, "WEAK", 0);
		// while (ns.isRunning(pid)) {
		await ns.sleep(waitTime);
		// }
	}
}