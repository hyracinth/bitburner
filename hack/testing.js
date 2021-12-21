/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];

	ns.tprint(`weakenAnalyze\t${ns.weakenAnalyze(1)}`);
	ns.tprint(`hackAnalyzeSecurity\t${ns.hackAnalyzeSecurity(1)}`);
	ns.tprint(`growthAnalyzeSecurity\t${ns.growthAnalyzeSecurity(1)}`);
}