export const calculateByte = (data: string) => {
  return ~-encodeURI(data).split(/%..|./).length;
};
