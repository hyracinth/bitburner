import HBBConstants from "libHBBConstants.js";
import { getServerList } from "libUtils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	let prepHost = (ns.args[0] == null) ? "pserv_0" : ns.args[0];
	let hackHost = (ns.args[1] == null) ? "pserv_1" : ns.args[1];
	let serversToHack = (ns.args[2] == null) ? 5 : ns.args[2];

	const homeServer = HBBConstants.CONST_HOME;

	if (hackHost != homeServer) {
		await ns.scp(HBBConstants.SCRIPT_HACKV2, homeServer, hackHost);
	}

	let serverList = getServerList(ns, homeServer);
	let serverLength = serverList.length;
	let filteredServers = [];

	for (let ii = 0; ii < serverLength; ii++) {
		let target = serverList[ii];
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

	for (let ii = 0; ii < serversToHack; ii++) {
		let target = filteredServers[ii][0];
		ns.print(`Hacking ${target} with ${hackHost}. ${ii}/${filteredServers.length}`);
		ns.exec(HBBConstants.SCRIPT_HACKV2, prepHost, 1, hackHost, target, prepHost, Date.now());
		await ns.sleep(100);
	}

	while (true) {
		await ns.sleep(10000);
	}
}