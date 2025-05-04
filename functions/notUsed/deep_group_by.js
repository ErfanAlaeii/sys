function groupBy(arr, branch) {
    return Object.groupBy(arr, item => item[branch]);
}

function deepGroupBy(arr, branches) {
    if (typeof branches === 'string' || branches instanceof String) {
        branches = branches.split(',').map(function (item) { return item.trim(); });
    }
    if (Array.isArray(branches) === false) {
        return arr;
    }
    if (branches.length === 1) {
        return groupBy(arr, branches[0]);
    }
    const groupedObj = groupBy(arr, branches[0]);
    for (const prop of Object.keys(groupedObj)) {
        groupedObj[prop] = deepGroupBy(groupedObj[prop], branches.slice(1)); // notice the recursion here
    }
    return groupedObj;
}
module.exports = deepGroupBy