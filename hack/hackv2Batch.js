import HBBConstants from "/lib/HBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	if (ns.args.length < 2) {
		ns.tprint("Usage: hackv2Batch.js HOST TARGET");
		return;
	}

	const homeServer = HBBConstants.CONST_HOME;
	await ns.scp(HBBConstants.SCRIPT_BASE_OPERATIONS, homeServer, host);

	let host = ns.args[0];
	let target = ns.args[1];
	let prepHost = ns.args[2];

	if (prepHost != null) {
		await ns.scp(HBBConstants.SCRIPT_PREPSERVER, homeServer, prepHost);
		let pid = ns.exec(HBBConstants.SCRIPT_PREPSERVER, prepHost, 1, prepHost, target, Date.now());
		while (ns.isRunning(pid)) {
			await ns.sleep(5000);
		}
	}

	let maxMoney = ns.getServerMaxMoney(target);
	let currMoney = maxMoney - maxMoney * ns.hackAnalyze(target);

	let reqMoney = maxMoney / currMoney;
	let hackThreads = 1;
	let growThreads = Math.max(1, Math.ceil(ns.growthAnalyze(target, reqMoney)));
	let weakThreads = Math.ceil((ns.growthAnalyzeSecurity(growThreads) + ns.hackAnalyzeSecurity(hackThreads)) / ns.weakenAnalyze(1));

	let ramNeeded = ns.getScriptRam(HBBConstants.SCRIPT_BASE_OPERATIONS, homeServer) * (growThreads + hackThreads + weakThreads);
	let hostRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	if (host == homeServer) {
		hostRam -= 20;
	}

	ns.print(`Target: ${target} | Threads: ${hackThreads} Hack | ${growThreads} Grow | ${weakThreads} Weak | Total RAM: ${ramNeeded}`);

	if (hostRam < ramNeeded) {
		ns.print(`${host} does not have enough RAM. ${ramNeeded} GB Required.`)
		return;
	}
	while (true) {
		let diff1 = ns.getWeakenTime(target) - ns.getHackTime(target);
		let diff2 = ns.getWeakenTime(target) - ns.getGrowTime(target);

		let hostRemainingRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		if (hostRemainingRam >= ramNeeded) {
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, hackThreads, target, "HACK", diff1, Date.now());
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, growThreads, target, "GROW", diff2, Date.now());
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, weakThreads, target, "WEAK", 0, Date.now());
		}
		// magic number
		await ns.sleep(20);
		ns.print(`${ns.getServerMoneyAvailable(target)} | ${ns.getServerSecurityLevel(target)}`)
	}
}