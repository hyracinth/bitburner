import HBBConstants from "libHBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args.length < 2) {
		ns.tprint("Usage: run prepServer.js HOST TARGET");
		return;
	}

	let host = ns.args[0];
	let target = ns.args[1];

	let baseOpRam = ns.getScriptRam(HBBConstants.SCRIPT_BASE_OPERATIONS);
	let availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	let weakAnalyze = ns.weakenAnalyze(1);

	await ns.scp(HBBConstants.SCRIPT_BASE_OPERATIONS, "home", host);
	await ns.scp(HBBConstants.SCRIPT_HBBCONSTANTS, "home", host);

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
			let threadsToUse = Math.min(threadsToMaxMoney, Math.floor(availRam / baseOpRam));
			let pid = ns.exec(HBBConstants.SCRIPT_BASE_OPERATIONS, host, threadsToUse, target, "GROW", 0);

			let timeToSleep = ns.getGrowTime(target) + 100;
			ns.print(`Growing ${target}: ${threadsToUse} / ${threadsToMaxMoney} threads. ETA: ${Math.round(timeToSleep / 1000)} secs`);
			await ns.sleep(timeToSleep);
			while (ns.isRunning(pid)) {
				await ns.sleep(1000);
			}

			currMoney = ns.getServerMoneyAvailable(target);
			reqMoney = maxMoney / currMoney;
		}
		ns.print(`${target} Current Money: ${currMoney / 1000000}M | Max Money: ${maxMoney / 1000000}M`);
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

			let timeToSleep = ns.getWeakenTime(target) + 100;
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