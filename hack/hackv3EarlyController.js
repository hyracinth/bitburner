import HBBConstants from "/lib/HBBConstants.js";
import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	if(ns.args.length < 1) {
		ns.tprint("Usage: startupEarly.js TARGET ?RAM");
		return;
	}

	let target = ns.args[0];
	let ram = (ns.args[1] == null) ? 32 : ns.args[1];

	const homeServer = HBBConstants.CONST_HOME;
	let serverList = getServerList(ns, homeServer);

	ns.print(`Prepping ${target}`);
	let pid = ns.exec(HBBConstants.SCRIPT_PREPSERVER, homeServer, 1, homeServer, target);
	while (ns.isRunning(pid)) {
		await ns.sleep(1000);
	}

	ns.print(`Nuke all`);
	pid = ns.exec(HBBConstants.SCRIPT_NUKEALL, homeServer);
	while (ns.isRunning(pid)) {
		await ns.sleep(1000);
	}

	for (let ii = 0; ii < serverList.length; ii++) {
		let currServer = serverList[ii];
		if (ns.hasRootAccess(currServer) && ns.getServerMaxRam(currServer) >= ram) {
			await ns.scp(HBBConstants.SCRIPT_HACKV3, homeServer, currServer);
			await ns.scp(HBBConstants.SCRIPT_HBBCONSTANTS, homeServer, currServer);
			ns.exec(HBBConstants.SCRIPT_HACKV3, currServer, 1, currServer, target);
			await ns.sleep(200);
		}
	}

}