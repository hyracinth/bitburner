/** @param {NS} ns **/
export async function main(ns) {
    let target = ns.args[0];
    let func = ns.args[1];
    let time = (ns.args[2] == null) ? 0 : ns.args[2];

    switch (func) {
        case "HACK":
            await ns.sleep(time);
            await ns.hack(target);
            break;
        case "GROW":
            await ns.sleep(time);
            await ns.grow(target);
            break;
        case "WEAK":
            await ns.sleep(time);
            await ns.weaken(target);
            break;
    }
}