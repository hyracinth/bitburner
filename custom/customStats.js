// Sourced from https://steamcommunity.com/sharedfiles/filedetails/?id=2680734426&tscn=1640171988

/** @param {NS} ns **/
export async function main(ns) {
	const doc = eval("document"); // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
	const hook0 = doc.getElementById('overview-extra-hook-0');
	const hook1 = doc.getElementById('overview-extra-hook-1');
	while (true) {
		try {
			const headers = []
			const values = [];
			// Add script income per second
			headers.push("ScrInc");
			values.push(ns.getScriptIncome()[0].toPrecision(5) + '/sec');
			// Add script exp gain rate per second
			headers.push("ScrExp");
			values.push(ns.getScriptExpGain().toPrecision(5) + '/sec');
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