import { getServerList } from "/lib/utils.js";
import hbbConstants from "/lib/hbbConstants.js";


/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	ns.tprint(hbbConstants.SCRIPT_MODULE_HACK);
	ns.tprint(getServerList(ns, "home"));

}