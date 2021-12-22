import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	var prepHost = (ns.args[0] == null) ? "pserv_0" : ns.args[0];
	var hackHost = (ns.args[1] == null) ? "pserv_1" : ns.args[1];
	var serversToHack = (ns.args[2] == null) ? 5 : ns.args[2];

	const homeServer = "home";

	if (hackHost != homeServer) {
		var hackFile = "/hackv2/hackBatch.js";
		await ns.scp(hackFile, homeServer, hackHost);
	}

	var serverList = getServerList(ns, homeServer);
	var serverLength = serverList.length;
	var filteredServers = [];

	for (var ii = 0; ii < serverLength; ii++) {
		var target = serverList[ii];
		if (ns.getServerMaxMoney(target) > 0 &&
			ns.getServerGrowth(target) > 0 &&
			ns.getServerRequiredHackingLevel(target) <= ns.getHackingLevel() &&
			ns.getWeakenTime(target) > (2 * 60)) {
			filteredServers.push([target, ns.getServerMaxMoney(target) / ns.getWeakenTime(target) * ns.hackAnalyzeChance(target)]);
		}
	}

	filteredServers.sort(function (x, y) {
		return y[1] - x[1];
	});

	ns.tprint(filteredServers);

	for (var ii = 0; ii < serversToHack; ii++) {
		var target = filteredServers[ii][0];
		ns.print(`Hacking ${target} with ${hackHost}. ${ii}/${filteredServers.length}`);
		ns.exec(hackFile, prepHost, 1, hackHost, target, prepHost, Date.now());
		await ns.sleep(100);
	}

	while (true) {
		await ns.sleep(10000);
	}
}