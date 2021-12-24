import { getServerList, getHackTarget } from "/lib/utils.js"
import HBBConstants from "/lib/HBBConstants.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	let target = ns.args[0];
	let homeServer = HBBConstants.CONST_HOME;
	let pid = ns.exec(HBBConstants.SCRIPT_NUKEALL, homeServer, 1);
	if (ns.isRunning(pid)) {
		await ns.sleep(2000);
	}

	let serverList = getServerList(ns, homeServer);
	target = (target == null) ? getHackTarget(ns, serverList) : target;

	ns.tprint("Targetted Server: " + target);
	ns.tprint("Server list: " + serverList);

	for (let ii = 0; ii < serverList.length; ii++) {
		let serv = serverList[ii];
		if (ns.getServerUsedRam(serv) == 0 && ns.getServerMaxRam(serv) >= 4 &&
			ns.hasRootAccess(serv)) {
			// Run all control scripts at home PC
			ns.killall(serv);
			ns.exec(HBBConstants.SCRIPT_HACKV1, homeServer, 1, serv, target);
		}
	}
}