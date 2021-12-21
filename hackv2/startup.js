import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.args[0];

	const homeServer = "home";

	if (host != homeServer) {
		var prepFile = "/utils/prepServer.js";
		var hackFile = "/hackv2/hackBatch.js";
	}

	var serverList = getServerList(ns, homeServer);

	await ns.scp(prepFile, homeServer, host);
	await ns.scp(hackFile, homeServer, host);

var serverLength = serverList.length;
	for (var ii = 0; ii < serverLength; ii++) {
		var target = serverList[ii];
		if (ns.getServerMaxMoney(target) > 0 && ns.getServerGrowth(target) > 0) {
			ns.print(`Prepping ${target} with ${host}. ${ii}/${serverLength}`);
			var pid = ns.exec(prepFile, host, 1, host, target);
			while (ns.isRunning(pid)) {
				await ns.sleep(5000);
			}
			ns.print(`Hacking ${target} with ${host}.`);
			ns.exec(hackFile, host, 1, host, target);
		}
	}

	while (true) {
		await ns.sleep(10000);
	}
}