/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	if (ns.args.length < 2) {
		ns.tprint("Usage: hackBatch.js HOST TARGET");
		return;
	}

	const homeServer = "home";
	const baseOpFile = "/hackv2/baseOperations.js";
	await ns.scp(baseOpFile, homeServer, host);

	var host = ns.args[0];
	var target = ns.args[1];
	var prepHost = ns.args[2];

	if (prepHost != null) {
		const prepFile = "/utils/prepServer.js";
		await ns.scp(prepFile, homeServer, prepHost);
		var pid = ns.exec(prepFile, prepHost, 1, prepHost, target, Date.now());
		while (ns.isRunning(pid)) {
			await ns.sleep(5000);
		}
	}

	var maxMoney = ns.getServerMaxMoney(target);
	var currMoney = maxMoney - maxMoney * ns.hackAnalyze(target);

	var reqMoney = maxMoney / currMoney;
	var hackThreads = 1;
	var growThreads = Math.max(1, Math.ceil(ns.growthAnalyze(target, reqMoney)));
	var weakThreads = Math.ceil((ns.growthAnalyzeSecurity(growThreads) + ns.hackAnalyzeSecurity(hackThreads)) / ns.weakenAnalyze(1));

	var ramNeeded = ns.getScriptRam(baseOpFile, homeServer) * (growThreads + hackThreads + weakThreads);
	var hostRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	if (host == homeServer) {
		hostRam -= 20;
	}

	ns.print(`Target: ${target} | Threads: ${hackThreads} Hack | ${growThreads} Grow | ${weakThreads} Weak | Total RAM: ${ramNeeded}`);

	if (hostRam < ramNeeded) {
		ns.print(`${host} does not have enough RAM. ${ramNeeded} GB Required.`)
		ns.sleep(5000);
	}
	while (true) {
		var diff1 = ns.getWeakenTime(target) - ns.getHackTime(target);
		var diff2 = ns.getWeakenTime(target) - ns.getGrowTime(target);

		var hostRemainingRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		if (hostRemainingRam >= ramNeeded) {
			ns.exec(baseOpFile, host, hackThreads, target, "HACK", diff1, Date.now());
			ns.exec(baseOpFile, host, growThreads, target, "GROW", diff2, Date.now());
			ns.exec(baseOpFile, host, weakThreads, target, "WEAK", 0, Date.now());
		}
		// magic number
		await ns.sleep(20);
		ns.print(`${ns.getServerMoneyAvailable(target)} | ${ns.getServerSecurityLevel(target)}`)
	}
}