export const getKoreaFormattedTimeStamp = (): string => {
  const now = new Date();

  const kstString = now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
  const kstDate = new Date(kstString);

  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  const hh = String(kstDate.getHours()).padStart(2, '0');
  const min = String(kstDate.getMinutes()).padStart(2, '0');
  const ss = String(kstDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};
