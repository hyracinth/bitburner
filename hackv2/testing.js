import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];

	var serverList = getServerList(ns, "home");

	for (var ii = 0; ii < serverList.length; ii++) {
		ns.exec("/utils/prepServer.js", "pserv_0", 1, "pserv_0", serverList[ii]);
	}
}