import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type Student } from '@/domains/record/types/record';
import { api } from '@/shared/lib/api';
import { type ApiResponseWithoutData } from '@/shared/types/response';

export const patchStudents = async (studentInfo: Student) => {
  return api.patch<ApiResponseWithoutData>(`/api/v1/students/${studentInfo.studentId}`, {
    grade: studentInfo.grade,
    classNumber: studentInfo.classNumber,
    studentNumber: studentInfo.studentNumber,
    studentName: studentInfo.studentName,
    recordTypes: studentInfo.recordTypes,
  });
};

interface MutationContext {
  previousData: Array<[queryKey: readonly unknown[], data: unknown]>;
}

export const usePatchStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponseWithoutData, Error, Student, MutationContext>({
    mutationFn: patchStudents,

    onMutate: async (updatedStudent): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ['students'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['students'] });

      queryClient.setQueriesData({ queryKey: ['students'] }, (oldData: unknown) => {
        if (!oldData) return oldData;

        if (typeof oldData === 'object' && oldData !== null && 'pages' in oldData) {
          const infiniteData = oldData as { pages: Array<{ students?: Student[] }> };
          return {
            ...infiniteData,
            pages: infiniteData.pages.map((page) => ({
              ...page,
              students:
                page.students?.map((student: Student) =>
                  student.studentId === updatedStudent.studentId ? updatedStudent : student,
                ) || page.students,
            })),
          };
        }

        if (typeof oldData === 'object' && oldData !== null && 'students' in oldData) {
          const queryData = oldData as { students: Student[] };
          return {
            ...queryData,
            students: queryData.students.map((student: Student) =>
              student.studentId === updatedStudent.studentId ? updatedStudent : student,
            ),
          };
        }

        return oldData;
      });

      return { previousData };
    },

    onError: (_err, _updatedStudent, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });

      queryClient.invalidateQueries({
        queryKey: ['studentsName'],
      });

      queryClient.invalidateQueries({
        queryKey: ['records'],
      });
    },
  });
};
