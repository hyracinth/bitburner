/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");
	var host = (ns.args[0] == null) ? "iron-gym" : ns.args[0];
	var target = (ns.args[1] == null) ? "foodnstuff" : ns.args[1];
	var weakFile = "/common/moduleWeaken.js"

	if(host != "home") {
		await ns.scp(weakFile, "home", host);
	}

	while (true) {
		var waitTime = ns.getWeakenTime(target);
		var threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(weakFile));
		if (threads > 0) {
			ns.exec(weakFile, host, threads, target);
		}
		await ns.sleep(waitTime);
	}
}