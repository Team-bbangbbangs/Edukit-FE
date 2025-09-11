export const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.warn('Invalid URI component:', str, error);
    return str;
  }
};

export const parseSearchParams = (searchParams: { id?: string; name?: string }) => {
  const recordId = searchParams.id ? Number(searchParams.id) : undefined;
  const studentName = searchParams.name ? safeDecodeURIComponent(searchParams.name) : undefined;

  const isIdValid = !searchParams.id || (!isNaN(recordId!) && recordId! > 0);

  return {
    recordId,
    studentName,
    isValid: isIdValid,
  };
};
