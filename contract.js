import { getServerList } from "/lib/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	const homeServer = "home";

	var serverList = getServerList(ns, homeServer);
	var contractList = [];

	for (let ii = 0; ii < serverList.length; ii++) {
		let currServer = serverList[ii];
		let result = ns.ls(currServer, ".cct");
		if (result.length > 0) {
			contractList.push([currServer, result]);
		}
	}

	for (let ii = 0; ii < contractList.length; ii++) {
		let currServer = contractList[ii][0];
		for (let jj = 0; jj < contractList[ii][1].length; jj++) {
			let currFile = contractList[ii][1][jj];
			ns.tprint("========================================");
			ns.tprint(`${currServer}: \t${contractList[ii][1][jj]}`);
			ns.tprint(`Contract Type: ${ns.codingcontract.getContractType(currFile, currServer)}`);
			// ns.tprint(`Data: ${ns.codingcontract.getData(currFile, currServer)}`);
			// ns.tprint(`Description: ${ns.codingcontract.getDescription(currFile, currServer)}`);
			// ns.tprint(`NumTries ${ns.codingcontract.getNumTriesRemaining(currFile, currServer)}`);
		}
	}

	for (let ii = 0; ii < contractList.length; ii++) {
		let currServer = contractList[ii][0];
		for (let jj = 0; jj < contractList[ii][1].length; jj++) {
			let currFile = contractList[ii][1][jj];
			let contractType = ns.codingcontract.getContractType(currFile, currServer);

			switch (contractType) {
				case "Subarray with Maximum Sum":
					let data = ns.codingcontract.getData(currFile, currServer);
					let sumMax = Number.NEGATIVE_INFINITY;
					for (let ii = 0; ii < data.length; ii++) {
						let rowSum = 0;
						for (let jj = ii; jj < data.length; jj++) {
							rowSum += data[jj];
							if (rowSum > sumMax) {
								sumMax = rowSum;
							}
						}
					}
					let result = ns.codingcontract.attempt(sumMax, currFile, currServer, { returnReward: true });
					let prettyText = `${currFile} @ ${currServer}: ${result}`;
					ns.print(prettyText);
					ns.tprint(prettyText);
					ns.toast(prettyText);
					break;
			}
		}
	}
}