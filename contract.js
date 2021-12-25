import { getServerList } from "libUtils.js";

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

	if (contractList.length == 0) {
		ns.tprint("No contracts are available.");
	}

	for (let ii = 0; ii < contractList.length; ii++) {
		let currServer = contractList[ii][0];
		for (let jj = 0; jj < contractList[ii][1].length; jj++) {
			let currFile = contractList[ii][1][jj];
			ns.tprint("========================================");
			ns.tprint(`${currServer}: \t${contractList[ii][1][jj]}`);
			ns.tprint(`Contract Type: ${ns.codingcontract.getContractType(currFile, currServer)}`);
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
				case "Find Largest Prime Factor":
					let maxPrime = 1;

					while (data % 2 == 0) {
						maxPrime = 2;
						data /= 2;
					}
					while (data % 3 == 0) {
						maxPrime = 3;
						data /= 3;
					}

					for (let ii = 5; ii <= Math.sqrt(data); ii += 6) {
						while (data % ii == 0) {
							maxPrime = ii;
							data = data / ii;
						}
						while (data % (ii + 2) == 0) {
							maxPrime = ii + 2;
							data = data / (ii + 2);
						}
					}

					if (data > 4)
						maxPrime = data;

					answer = maxPrime;
					break;

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

				// case "Total Ways to Sum":
				// 	for (let ii = data - 1; ii > 0; ii--) {
				// 		let currSum = ii;
				// 		let currComp = [ii];
				// 		if (failSafe-- < 0) break;
				// 		for (let jj = ii; jj > 0; jj--) {
				// 			if (failSafe-- < 0) break;

				// 			if (currSum + jj == data) {
				// 				sumCount++;
				// 				currSum += jj;
				// 				currComp.push(jj);

				// 				ns.tprint(`${sumCount}\t${currSum}\t${ii}\t${jj}\t${currComp} FOUND`);

				// 				currSum = ii;
				// 				currComp = [ii];

				// 			}
				// 			else if (currSum + jj < data) {
				// 				ns.tprint(`HERE ${currSum} ${jj}`);
				// 				currSum += jj;
				// 				currComp.push(jj);
				// 				jj = ii;
				// 				ns.tprint(`${sumCount}\t${currSum}\t${ii}\t${jj}\t${currComp}`);
				// 			}
				// 			else {

				// 				ns.tprint(`${sumCount}\t${currSum}\t${ii}\t${jj}\t${currComp}`);
				// 			}
				// 		}
				// 	}

				// 	ns.tprint(sumCount);
				// 	break;

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