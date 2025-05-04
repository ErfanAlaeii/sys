function prepareSort(sortRaw, prependSort = []) {
    try {
        sort = JSON.parse(sortRaw);
        if(Array.isArray(sort[0])===false){
            
        }
        for (const [key, value] of Object.entries(sort)) {
            if (sort[key] === "1") {
                sort[key] = 1;
            }
            if (sort[key] === "-1") {
                sort[key] = -1;
            }
        }
        try {
            
            prependSort = JSON.parse(prependSort);
            for (const [key, value] of Object.entries(prependSort)) {
                delete sort[key];
            }
            sort = Object.assign(prependSort, sort);
        } catch {
            new Error('prepended sort is not parseable');
            preparedSort = sort
        }
    } catch {
        try {
            prependSort = JSON.parse(prependSort);
            new Error('sort is not parseable, prepended sort is applied');
            preparedSort = prependSort;

        } catch {
            new Error('prepended sort and sort is not parseable');
            preparedSort = [];

        }
    }

    return preparedSort;
}

module.exports = prepareSort