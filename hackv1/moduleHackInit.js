/** @param {NS} ns **/
export async function main(ns) {
	if(ns.args.length < 2) {
		ns.print("Usage: moduleHackInit.js HOST TARGET");
		return;
	}
	var host = ns.args[0];
	var target = ns.args[1];
	var moneyThres = ns.getServerMaxMoney(target) * 0.75;
	var secThres = ns.getServerMinSecurityLevel(target) + 5;
	var hostRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);

	if (host == "home") {
		hostRam -= 20;
	}

	var weakenScript = "/common/moduleWeaken.js";
	var growScript = "/common/moduleGrow.js";
	var hackScript = "/common/moduleHack.js";

	var scriptRam;
	var pidCheck;
	while (true) {
		if (ns.getServerSecurityLevel(target) > secThres) {
			scriptRam = ns.getScriptRam(weakenScript);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(weakenScript, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		} else if (ns.getServerMoneyAvailable(target) < moneyThres) {
			scriptRam = ns.getScriptRam(growScript);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(growScript, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		} else {
			scriptRam = ns.getScriptRam(hackScript);
			var threads = Math.floor(hostRam / scriptRam);
			if (threads > 0) {
				pidCheck = ns.exec(hackScript, host, threads, target);
				while (ns.isRunning(pidCheck, host)) {
					await ns.sleep(1000);
				}
			}
		}
		await ns.sleep(3000);
	}
}