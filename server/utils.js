function judgeDiff_(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function toArray_(object) {
    return Array.isArray(object) ? object : [];
}