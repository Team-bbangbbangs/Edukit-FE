import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import type { RecordType, StudentRecord } from '@/types/api/student-record';

const recordTypeToTitle: Record<RecordType, string> = {
  subject: '세부능력 및 특기사항',
  behavior: '행동특성 및 종합의견',
  career: '창의적 체험활동 - 진로',
  free: '창의적 체험활동 - 자율',
  club: '창의적 체험활동 - 동아리',
};

export const downloadExcel = async (data: StudentRecord[], recordType: RecordType) => {
  const title = recordTypeToTitle[recordType];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  worksheet.columns = [
    { header: '학번', key: 'studentNumber', width: 15 },
    { header: '이름', key: 'name', width: 15 },
    { header: title, key: 'content', width: 300 },
  ];

  const extractData = data.map((record) => ({
    studentNumber: record.studentNumber,
    name: record.studentName,
    content: record.content,
  }));

  extractData.forEach((record) => {
    worksheet.addRow(record);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `${title}.xlsx`);
};
