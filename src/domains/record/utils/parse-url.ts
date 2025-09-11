export const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.warn('Invalid URI component:', str, error);
    return str;
  }
};

export const parseSearchParams = (searchParams: { id?: string; name?: string }) => {
  try {
    const recordId = searchParams.id ? Number(searchParams.id) : undefined;
    const studentName = searchParams.name ? decodeURIComponent(searchParams.name) : undefined;

    return { recordId, studentName, isValid: true };
  } catch {
    return { recordId: undefined, studentName: undefined, isValid: false };
  }
};
