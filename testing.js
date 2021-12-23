import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	ns.tprint(getServerList(ns, "home"));

}