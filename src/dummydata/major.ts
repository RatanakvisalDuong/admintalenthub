export const majors = [
    { 'id': 1, 'name': 'Computer Science' },
    { 'id': 2, 'name': 'Management of Information Systems' },
    { 'id': 3, 'name': 'Digital Arts and Design' }
];

export const getMajorName = (majorId: number | null): string => {
    if (majorId == null) {
        return "";
    }

    const major = majors.find((m) => m.id === majorId);
    return major?.name || "";
};