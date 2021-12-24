// Sourced from https://steamcommunity.com/sharedfiles/filedetails/?id=2680734426&tscn=1640171988

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");
	const doc = eval("document"); 
	const hook0 = doc.getElementById('overview-extra-hook-0');
	const hook1 = doc.getElementById('overview-extra-hook-1');
	while (true) {
		try {
			const headers = []
			const values = [];
			// Add script income per second
			headers.push("Inc");
			values.push(ns.getScriptIncome()[0].toPrecision(2) + '/sec');
			// Add script exp gain rate per second
			headers.push("Exp");
			values.push(ns.getScriptExpGain().toPrecision(2) + '/sec');
			// TODO: Add more neat stuff

			// Now drop it into the placeholder elements
			hook0.innerText = headers.join(" \n");
			hook1.innerText = values.join("\n");
		} catch (err) { // This might come in handy later
			ns.print("ERROR: Update Skipped: " + String(err));
		}
		await ns.sleep(1000);
	}
}