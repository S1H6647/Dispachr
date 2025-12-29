export const caplitalize = (string) => {
    if (string.length == 0) {
        return "";
    }
    return string.replace(/\b\w/g, (c) => c.toUpperCase());
};
