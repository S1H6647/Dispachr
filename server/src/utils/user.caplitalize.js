export const caplitalizeEachWord = (string) => {
    if (string.length === 0) {
        return "";
    }
    return string.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const caplitalizeFirstWord = (string) => {
    if (string.length === 0) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};
