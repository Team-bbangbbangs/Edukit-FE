export const RECORD_SUMMARY_RECORD_DATA = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1;
  const isEmpty = id % 5 === 0;
  const description = isEmpty
    ? ''
    : `이 학생은 ${['바른', '성실한', '적극적인', '책임감 있는'][i % 4]} 태도로 수업에 임합니다.`;

  const byteCount = new Blob([description]).size;

  return {
    recordId: id,
    description,
    byteCount,
  };
});
