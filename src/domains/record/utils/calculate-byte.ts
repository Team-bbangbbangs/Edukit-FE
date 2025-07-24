export const calculateByte = (data: string): number => {
  return encodeURI(data).split(/%..|./).length - 1;
};
