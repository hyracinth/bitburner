/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");
	let host = (ns.args[0] == null) ? "home" : ns.args[0];
	let target = (ns.args[1] == null) ? "joesguns" : ns.args[1];
	let threads = ns.args[2];
	let targetHackLvl = (ns.args[3] == null) ? 3000 : ns.args[3];
	let baseOp = "/common/baseOperations.js";

	if (host != "home") {
		await ns.scp(baseOp, "home", host);
	}

	while (ns.getHackingLevel() < targetHackLvl) {
		if (threads == null) {
			let bufferRam = 0;
			if(host == "home") {
				bufferRam = 5;
			}
			threads = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - bufferRam) / ns.getScriptRam(baseOp);
		}
		threads = Math.floor(threads);
		let waitTime = ns.getWeakenTime(target);
		let pid = ns.exec(baseOp, host, threads, target, "WEAK", 0);
		await ns.sleep(waitTime);
		if (ns.isRunning(pid)) {
			await ns.sleep(3000);
		}
	}
}