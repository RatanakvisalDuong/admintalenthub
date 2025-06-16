export function convertPhoneNumberSpacing(phoneNumber: string): string {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 10) {
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}




export const getMajorName = (majorId: number | null): string => {

    const majors = [
        { 'id': 1, 'name': 'Computer Science' },
        { 'id': 2, 'name': 'Management of Information Systems' },
        { 'id': 3, 'name': 'Digital Arts and Design' }
    ];
    if (majorId == null) {
        return "";
    }

    const major = majors.find((m) => m.id === majorId);
    return major?.name || "";
};

export function sanitizeQuillHtml(html: string): string {
  if (!html || html === '<p><br></p>') return '';

  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/(<\/(?:p|div|h[1-6]|li|ul|ol)>)(<(?!\/|br|p|div|h[1-6]|li|ul|ol))/g, '$1 $2');
}