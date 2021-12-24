/** @param {NS} ns **/
export async function main(ns) {
    let target = ns.args[0];
	ns.tprint(target);
	ns.tprint("Hack Level: " + ns.getServerRequiredHackingLevel(target));
	ns.tprint("Ports Required: " + ns.getServerNumPortsRequired(target));
	ns.tprint("Growth: " + ns.getServerGrowth(target));
	ns.tprint("Max Money: " + ns.getServerMaxMoney(target));
	ns.tprint("Money Available: " + ns.getServerMoneyAvailable(target));
	ns.tprint("Security: " + ns.getServerSecurityLevel(target));
	ns.tprint("Min Security: " + ns.getServerMinSecurityLevel(target));
}