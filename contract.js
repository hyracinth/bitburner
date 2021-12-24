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
			let data = ns.codingcontract.getData(currFile, currServer);
			let answer, result, prettyText;

			switch (contractType) {
				case "Subarray with Maximum Sum":
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
					answer = sumMax;
					break;

				case "Merge Overlapping Intervals":
					data = data.sort((a, b) => (a[0] > b[0] ? 1 : -1));
					let ii = 0;
					let finalCheck = true;
					let dataChanged = false;
					while (finalCheck) {
						if (data.length == 1) {
							break;
						}
						if (ii + 1 == data.length) {
							if (dataChanged) {
								ii = 0;
								dataChanged = false;
							}
							else {
								break;
							}
						}
						if (data[ii + 1][0] >= data[ii][0] && data[ii + 1][0] <= data[ii][1]) {
							data[ii][1] = Math.max(data[ii][1], data[ii + 1][1]);
							data.splice(ii + 1, 1);
							dataChanged = true;
						}
						else {
							ii++;
						}
					}
					answer = data;
					break;

				case "Minimum Path Sum in a Triangle":
					let row = data.length;

					for (let ii = 0; ii < row; ii++) {
						for (let jj = 0; jj < data[ii].length; jj++) {
							let adjCells = [];
							if (ii - 1 >= 0 && jj < data[ii - 1].length) {
								adjCells.push(data[ii - 1][jj]);
							}
							if (jj - 1 >= 0) {
								adjCells.push(data[ii][jj - 1]);
							}
							if (adjCells.length > 0) {
								data[ii][jj] += Math.min(...adjCells);
							}
						}
					}
					answer = Math.min(...data[row - 1]);
					break;
			}
			if (answer != null) {
				result = ns.codingcontract.attempt(answer, currFile, currServer, { returnReward: true });
				prettyText = `${currFile} @ ${currServer}: ${result}`;
				ns.print(prettyText);
				ns.tprint(prettyText);
				ns.toast(prettyText);
			}
		}
	}
}