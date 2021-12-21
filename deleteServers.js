/** @param {NS} ns **/
export async function main(ns) {
    var ownedServs = ns.getPurchasedServers();
	ownedServs.forEach(x => ns.deleteServer(x));
}