import HBBConstants from "libHBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args.length < 2) {
		ns.tprint("Usage: run prepServer.js HOST TARGET");
		return;
	}

	let host = ns.args[0];
	let target = ns.args[1];

	let homeServer = HBBConstants.CONST_HOME;
	let baseOpRam = ns.getScriptRam(HBBConstants.SCRIPT_BASE_OPERATIONS);
	let availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	let weakAnalyze = ns.weakenAnalyze(1);

	if (host != homeServer) {
		await ns.scp(HBBConstants.SCRIPT_BASE_OPERATIONS, homeServer, host);
		await ns.scp(HBBConstants.SCRIPT_HBBCONSTANTS, homeServer, host);
	}

	let currSec = ns.getServerSecurityLevel(target);
	let minSec = ns.getServerMinSecurityLevel(target);
	// Lower security level to minimum
	if (currSec <= minSec) {
		ns.print(`${target} is already at minimum security.`);
	}
	else {
		ns.print(`Prepping to weaken ${target} with ${host}.`);
		while (currSec > minSec) {
			let threadsToMinSec = Math.ceil((currSec - minSec) / weakAnalyze);
			let threadsToUse = Math.min(threadsToMinSec, Math.floor(availRam / baseOpRam));
			let pid = ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, threadsToUse, target, "WEAK", 0);

			let timeToSleep = ns.getWeakenTime(target) + 50;
			ns.print(`Weakening ${target}: ${threadsToUse} / ${threadsToMinSec} threads. ETA: ${Math.round(timeToSleep / 1000)} secs`);
			await ns.sleep(timeToSleep);
			while (ns.isRunning(pid)) {
				await ns.sleep(1000);
			}

			currSec = ns.getServerSecurityLevel(target);
			availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
		}
		ns.print(`${target} Security Level: ${currSec} | Min Level: ${minSec}.`);
	}

	// Grow money to maximum
	let maxMoney = ns.getServerMaxMoney(target);
	let reqMoney = maxMoney / Math.max(1, ns.getServerMoneyAvailable(target));

	if (reqMoney == 0 || maxMoney == 0) {
		ns.print(`${target} has 0 maximum money.`);
	}
	else if (reqMoney == 1) {
		ns.print(`${target} is already at maximum money.`);
	}
	else {
		ns.print(`Prepping to grow ${target} with ${host}.`);
		let currMoney;
		while (reqMoney != 1) {
			let threadsToMaxMoney = Math.ceil(ns.growthAnalyze(target, reqMoney));
			let threadsAvailable = Math.floor(availRam / baseOpRam);

			let maxThreadsGrowPerWeak = Math.floor(ns.weakenAnalyze(1) / ns.growthAnalyzeSecurity(1));
			let threadsBatch = maxThreadsGrowPerWeak + 1;

			let numBatches = Math.floor(threadsAvailable / threadsBatch);

			let growThreads = Math.floor(numBatches * (threadsBatch - 1));

			growThreads = Math.min(growThreads, threadsToMaxMoney);
			let weakThreads = Math.min(threadsBatch, Math.floor(growThreads / maxThreadsGrowPerWeak))

			let delayBuffer = Math.ceil(ns.getWeakenTime(target) - ns.getGrowTime(target)) - 20;

			ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, growThreads, target, "GROW", delayBuffer);
			let pid = ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, weakThreads, target, "WEAK", 0);

			let timeToSleep = ns.getWeakenTime(target) + 100;
			ns.print(`Growing ${target}: ${growThreads} / ${threadsToMaxMoney} threads. ETA: ${Math.round(timeToSleep / 1000)} secs`);
			await ns.sleep(timeToSleep);
			while (ns.isRunning(pid)) {
				await ns.sleep(1000);
			}

			currMoney = ns.getServerMoneyAvailable(target);
			reqMoney = maxMoney / currMoney;
		}
		ns.print(`${target} Current Money: ${currMoney / 1000000}M | Max Money: ${maxMoney / 1000000}M`);
	}


}