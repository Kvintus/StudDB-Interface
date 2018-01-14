/*

    Sorts an array of objects by given value and order from an object
    Example of the sorter object:
    sorter = {
        by: 'name',
        order: 'asc',
    }

*/

export default function dynamicSort(sorter) {
    let sortOrder = 1;
    if (sorter.order === 'asc') {
        sortOrder = -1;
    }
    return function (a, b) {
        const result = (a[sorter.by] < b[sorter.by]) ? -1 : (a[sorter.by] > b[sorter.by]) ? 1 : 0;
        return result * sortOrder;
    };
}
