/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	//ns.enableLog("exec");

	if (ns.args.length < 2) {
		ns.tprint("Usage: hackStaggerBatch.js HOST TARGET ?PREP-HOST");
		return;
	}

	var hostHack = ns.args[0];
	var target = ns.args[1];
	var hostPrep = (ns.args[2] == null) ? hostHack : ns.args[2];

	const homeServer = "home";
	const baseOpFile = "/common/baseOperations.js";
	const prepFile = "/utils/prepServer.js";
	await ns.scp(baseOpFile, homeServer, hostHack);
	await ns.scp(prepFile, homeServer, hostPrep);

	ns.print(`Prepping ${target} with ${hostPrep}.`)
	var pid = ns.exec(prepFile, hostPrep, 1, hostPrep, target, Date.now());
	while (ns.isRunning(pid)) {
		await ns.sleep(5000);
	}
	ns.print(`${target} prepped:`);
	ns.print(`${ns.nFormat(ns.getServerMoneyAvailable(target), "($0.00 a)")}/${ns.nFormat(ns.getServerMaxMoney(target), "($0.00 a)")} | ${ns.getServerSecurityLevel(target)}/${ns.getServerMinSecurityLevel(target)}`);

	var maxMoney = ns.getServerMaxMoney(target);
	var currMoney = maxMoney - maxMoney * ns.hackAnalyze(target);

	var reqMoney = maxMoney / currMoney;
	var hackThreads = 1;
	var growThreads = Math.max(1, Math.ceil(ns.growthAnalyze(target, reqMoney)));
	var weakThreads = Math.ceil(ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1));
	weakThreads += 1; // for hack thread

	var ramNeeded = ns.getScriptRam(baseOpFile, homeServer) * (growThreads + hackThreads + weakThreads);
	var hostRam = ns.getServerMaxRam(hostHack) - ns.getServerUsedRam(hostHack);
	if (hostHack == homeServer) {
		hostRam -= 20;
	}

	ns.print(`Target: ${target} | Threads: ${hackThreads} Hack | ${growThreads} Grow | ${weakThreads} Weak | Total RAM: ${ramNeeded}`);
	if (hostRam < ramNeeded) {
		ns.print(`${hostHack} does not have enough RAM. ${ramNeeded} GB Required.`)
		ns.sleep(5000);
	}

	// W |---------------|
	// W   |---------------|
	// G    |-------------|
	// H        |-------|

	// End times where t is first weak end time (aka weakenTime)
	// w1 = t
	// w2 = t + 2*bufferEnd
	// g  = t + bufferEnd
	// h  = t - bufferEnd

	// Delay times where t = wTime
	// w1 = t + 0*bufferEnd - wTime
	// w2 = t + 2*bufferEnd - wTime
	// g  = t + 1*bufferEnd - gTime
	// h  = t - 1*bufferEnd - hTime

	var bufferTime = 10;
	var t = ns.getWeakenTime(target);
	var delayW1 = 0;
	var delayW2 = 2 * bufferTime;
	var delayG = t + bufferTime - ns.getGrowTime(target);
	var delayH = t - bufferTime - ns.getHackTime(target);

	while (true) {
		var hostRemainingRam = ns.getServerMaxRam(hostHack) - ns.getServerUsedRam(hostHack);
		if (hostRemainingRam >= ramNeeded) {
			ns.exec(baseOpFile, hostHack, 1, target, "WEAK", delayW1, Date.now());
			ns.exec(baseOpFile, hostHack, weakThreads - 1, target, "WEAK", delayW2, Date.now());
			ns.exec(baseOpFile, hostHack, growThreads, target, "GROW", delayG, Date.now());
			ns.exec(baseOpFile, hostHack, hackThreads, target, "HACK", delayH, Date.now());
		}
		// Wait for 
		await ns.sleep(100);
		ns.print(`${ns.nFormat(ns.getServerMoneyAvailable(target), "($0.00 a)")}/${ns.nFormat(ns.getServerMaxMoney(target), "($0.00 a)")} | ${ns.getServerSecurityLevel(target)}/${ns.getServerMinSecurityLevel(target)}`);
	}
}