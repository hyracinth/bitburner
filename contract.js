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

				case "Total Ways to Sum":
					// https://www.geeksforgeeks.org/generate-unique-partitions-of-an-integer/
					let sumCount = 0;
					// array to store partition
					let partition = [data];
					// index of last element in partition
					let prevInd = 0
					// first partition is number itself
					partition[prevInd] = data;

					while (true) {
						sumCount++;
						//ns.tprint(partition);

						// find rightmost value that is NOT a one
						let remVal = 0;
						while (prevInd >= 0 && partition[prevInd] == 1) {
							remVal += partition[prevInd];
							prevInd--;
						}

						// if k < 0, all values are 1, so quit
						if (prevInd < 0) {
							break;
						}

						partition[prevInd]--;
						remVal++;

						// if remVal has increased, the no longer sorted.
						// divide remVal in different values of size p[k] and copy positions after p[k]
						while (remVal > partition[prevInd]) {
							partition[prevInd + 1] = partition[prevInd];
							remVal = remVal - partition[prevInd];
							prevInd++;
						}

						// copy remVal to next position and increase position
						partition[prevInd + 1] = remVal;
						prevInd++;
					}
					// ns.tprint(data);
					// ns.tprint(sumCount);

					// answer = sumCount;
					break;

				case "Array Jumping Game":
					let targetInd = data.length;
					let currInd = 0;
					let canHop = 1;

					for (let ii = 0; ii < targetInd; ii++) {
						if (data[ii] == 0 && currInd != targetInd) {
							canHop = 0;
							break;
						}
						else {
							currInd += data[ii];
						}
					}
					ns.tprint(canHop);
					ns.tprint(data);
					answer = canHop;
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

					for (let ii = 1; ii < row; ii++) {
						for (let jj = 0; jj < data[ii].length; jj++) {
							if (jj == 0) {
								data[ii][jj] += data[ii - 1][jj];
							}
							else if (jj == ii) {
								data[ii][jj] += data[ii - 1][jj - 1];
							}
							else {
								data[ii][jj] += Math.min(data[ii - 1][jj - 1], data[ii - 1][jj]);
							}
						}
					}
					answer = Math.min(...data[row - 1]);
					break;
			}
			if (answer != null) {
				result = ns.codingcontract.attempt(answer, currFile, currServer, { returnReward: true });

				if (result != null)
					prettyText = `${currFile} @ ${currServer}: ${result}`;
				else
					prettyText = `${currFile} @ ${currServer} WRONG! WRONG! WRONG!`

				if (result != null) {
					ns.print(prettyText);
					ns.tprint(prettyText);
					ns.toast(prettyText);
				}
			}
		}
	}
}