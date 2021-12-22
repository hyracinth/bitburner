/** @param {NS} ns **/
export async function main(ns) {
	var host = (ns.args[0] == null) ? "home" : ns.args[0];
	var target = (ns.args[1] == null) ? "joesguns" : ns.args[1];
	var targetHackLvl = (ns.args[2] == null) ? 200000 : ns.args[2];
	var baseOp = "/common/baseOperations.js";

	if (host != "home") {
		await ns.scp(baseOp, "home", host);
	}

	while (ns.getHackingLevel() < targetHackLvl) {
		var waitTime = ns.getWeakenTime(target);
		var pid = ns.exec(baseOp, host, targetHackLvl, target, "WEAK", 0);
		// while (ns.isRunning(pid)) {
		await ns.sleep(waitTime);
		// }
	}
}