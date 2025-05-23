
export function validateNotNull(value, description) {
    if (value === null || value === undefined || value === '') {
        throw new Error(description);
    }
    return value;
}
