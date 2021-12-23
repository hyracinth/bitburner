/** @param {NS} ns **/
export async function main(ns) {
    let ownedServs = ns.getPurchasedServers();
	ownedServs.forEach(x => ns.deleteServer(x));
}