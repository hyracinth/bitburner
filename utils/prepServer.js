/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args.length < 2) {
		ns.tprint("Usage: run prepServer.js HOST TARGET");
		return;
	}

	var host = ns.args[0];
	var target = ns.args[1];
	var baseOp = "/common/baseOperations.js";

	var baseOpRam = ns.getScriptRam(baseOp);
	var availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	var weakAnalyze = ns.weakenAnalyze(1);

	// Grow money to maximum
	var maxMoney = ns.getServerMaxMoney(target);
	var reqMoney = maxMoney / Math.max(1, ns.getServerMoneyAvailable(target));

	if (reqMoney == 0 || maxMoney == 0) {
		ns.print(`${target} has 0 maximum money.`);
	}
	else if (reqMoney == 1) {
		ns.print(`${target} is already at maximum money.`);
	}
	else {
		ns.print(`Prepping to grow ${target} with ${host}.`);
		while (reqMoney != 1) {
			var threadsToMaxMoney = Math.ceil(ns.growthAnalyze(target, reqMoney));
			var threadsToUse = Math.min(threadsToMaxMoney, Math.floor(availRam / baseOpRam));
			var pid = ns.exec(baseOp, host, threadsToUse, target, "GROW", 0);

			var timeToSleep = ns.getGrowTime(target) + 100;
			ns.print(`Growing ${target}: ${threadsToUse} / ${threadsToMaxMoney} threads. ETA: ${Math.round(timeToSleep / 1000)} secs`);
			await ns.sleep(timeToSleep);
			while (ns.isRunning(pid)) {
				await ns.sleep(1000);
			}

			var currMoney = ns.getServerMoneyAvailable(target);
			reqMoney = maxMoney / currMoney;
		}
		ns.print(`${target} Current Money: ${currMoney / 1000000}M | Max Money: ${maxMoney / 1000000}M`);
	}

	var currSec = ns.getServerSecurityLevel(target);
	var minSec = ns.getServerMinSecurityLevel(target);
	// Lower security level to minimum
	if (currSec <= minSec) {
		ns.print(`${target} is already at minimum security.`);
	}
	else {
		ns.print(`Prepping to weaken ${target} with ${host}.`);
		while (currSec > minSec) {
			var threadsToMinSec = Math.ceil((currSec - minSec) / weakAnalyze);
			var threadsToUse = Math.min(threadsToMinSec, Math.floor(availRam / baseOpRam));
			var pid = ns.exec(baseOp, host, threadsToUse, target, "WEAK", 0);

			var timeToSleep = ns.getWeakenTime(target) + 100;
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

}