import HBBConstants from "libHBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args.length < 2) {
		ns.tprint("Usage: moduleHackInit.js HOST TARGET");
		return;
	}
	ns.disableLog("ALL");
	ns.enableLog("exec");

	let host = ns.args[0];
	let target = ns.args[1];
	let moneyThres = ns.getServerMaxMoney(target) * 0.75;
	let secThres = ns.getServerMinSecurityLevel(target) + 5;
	let hostRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
	const homeServer = HBBConstants.CONST_HOME;

	if (host == homeServer) {
		hostRam -= 10;
	}

	await ns.scp(HBBConstants.SCRIPT_MODULE_WEAKEN, homeServer, host);
	await ns.scp(HBBConstants.SCRIPT_MODULE_GROW, homeServer, host);
	await ns.scp(HBBConstants.SCRIPT_MODULE_HACK, homeServer, host);

	let scriptRam;
	let pidCheck;
	while (true) {
		if (ns.getServerSecurityLevel(target) > secThres) {
			scriptRam = ns.getScriptRam(HBBConstants.SCRIPT_MODULE_WEAKEN);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(HBBConstants.SCRIPT_MODULE_WEAKEN, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		} else if (ns.getServerMoneyAvailable(target) < moneyThres) {
			scriptRam = ns.getScriptRam(HBBConstants.SCRIPT_MODULE_GROW);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(HBBConstants.SCRIPT_MODULE_GROW, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		} else {
			scriptRam = ns.getScriptRam(HBBConstants.SCRIPT_MODULE_HACK);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(HBBConstants.SCRIPT_MODULE_HACK, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		}
		await ns.sleep(3000);
	}
}