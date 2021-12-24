import HBBConstants from "libHBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	//ns.enableLog("exec");

	if (ns.args.length < 2) {
		ns.tprint("Usage: hackStaggerBatch.js HOST TARGET ?PREP-HOST");
		return;
	}

	let hostHack = ns.args[0];
	let target = ns.args[1];
	let hostPrep = (ns.args[2] == null) ? hostHack : ns.args[2];

	const homeServer = HBBConstants.CONST_HOME;
	await ns.scp(HBBConstants.SCRIPT_BASE_OPERATIONS, homeServer, hostHack);
	await ns.scp(HBBConstants.SCRIPT_PREPSERVER, homeServer, hostPrep);

	ns.print(`Prepping ${target} with ${hostPrep}.`)
	let pid = ns.exec(HBBConstants.SCRIPT_PREPSERVER, hostPrep, 1, hostPrep, target, Date.now());
	while (ns.isRunning(pid)) {
		await ns.sleep(5000);
	}
	ns.print(`${target} prepped:`);
	ns.print(`${ns.nFormat(ns.getServerMoneyAvailable(target), "($0.00 a)")}/${ns.nFormat(ns.getServerMaxMoney(target), "($0.00 a)")} | ${ns.getServerSecurityLevel(target)}/${ns.getServerMinSecurityLevel(target)}`);

	let maxMoney = ns.getServerMaxMoney(target);
	let currMoney = maxMoney - maxMoney * ns.hackAnalyze(target);

	let reqMoney = maxMoney / currMoney;
	let hackThreads = 1;
	let growThreads = Math.max(1, Math.ceil(ns.growthAnalyze(target, reqMoney)));
	let weakThreads = Math.ceil(ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1));
	weakThreads += 1; // for hack thread

	let ramNeeded = ns.getScriptRam(HBBConstants.SCRIPT_BASE_OPERATIONS, homeServer) * (growThreads + hackThreads + weakThreads);
	let hostRam = ns.getServerMaxRam(hostHack) - ns.getServerUsedRam(hostHack);
	if (hostHack == homeServer) {
		hostRam -= 20;
	}

	ns.print(`Target: ${target} | Threads: ${hackThreads} Hack | ${growThreads} Grow | ${weakThreads} Weak | Total RAM: ${ramNeeded}`);
	if (hostRam < ramNeeded) {
		ns.print(`${hostHack} does not have enough RAM. ${ramNeeded} GB Required.`)
		return;
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

	let bufTimeThread = 10;
	let t = ns.getWeakenTime(target);
	let delayW1 = 0;
	let delayW2 = 2 * bufTimeThread;
	let delayG = t + bufTimeThread - ns.getGrowTime(target);
	let delayH = t - bufTimeThread - ns.getHackTime(target);

	let bufTimeBatch = 100;
	let threadCount = 3000;
	if (t / bufTimeBatch * (hackThreads + growThreads + weakThreads) > threadCount) {
		bufTimeBatch = Math.floor(t / threadCount);
	}

	while (true) {
		let hostRemainingRam = ns.getServerMaxRam(hostHack) - ns.getServerUsedRam(hostHack);
		if (hostRemainingRam >= ramNeeded) {
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, hostHack, 1, target, "WEAK", delayW1, Date.now());
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, hostHack, weakThreads - 1, target, "WEAK", delayW2, Date.now());
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, hostHack, growThreads, target, "GROW", delayG, Date.now());
			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, hostHack, hackThreads, target, "HACK", delayH, Date.now());
		}
		// Wait for 
		await ns.sleep(bufTimeBatch);
		ns.print(`${Date.now()}: ${bufTimeBatch} | ${ns.nFormat(ns.getServerMoneyAvailable(target), "($0.00 a)")}/${ns.nFormat(ns.getServerMaxMoney(target), "($0.00 a)")} | ${ns.getServerSecurityLevel(target)}/${ns.getServerMinSecurityLevel(target)}`);
	}
}