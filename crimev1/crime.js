/** @param {NS} ns **/
export async function main(ns) {
	while(!ns.isBusy()) {
		ns.commitCrime("rob store");
		await ns.sleep(5000);
	}
}