import { getServerList } from "/lib/utils.js";
import HBBConstants from "/lib/HBBConstants.js";


/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	ns.enableLog("exec");

	ns.tprint(ns.ls("home", ".js"));



}