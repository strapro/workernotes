import { Database } from 'types/database';

type DepartmentLevel = Database['public']['Tables']['department_levels']['Row'];

export const useDepartmentLevelsRepository = () => {
  const { $uuid } = useNuxtApp();
  const supabase = useSupabaseClient<Database>();

  return {
    new: (departmentID: string) => {
      return ref<DepartmentLevel>({
        id: $uuid(),
        name: '',
        department_id: departmentID,
      } as DepartmentLevel);
    },
    getByDepartmentId: async (departmentId: string) => {
      return await useAsyncData(`department-levels-by-department-id-${departmentId}`, async () => {
        const { data, error } = await supabase.from('department_levels').select('*').eq('department_id', departmentId);

        if (error) {
          throw createError({
            message: error.message,
            statusCode: 500,
            fatal: true,
          });
        }

        return data;
      });
    },
    getByManagerId: async (managerId: string) => {
      return await useAsyncData(`department-levels-by-manager-id-${managerId}`, async () => {
        const { data, error } = await supabase
          .from('department_levels')
          .select('*, departments!inner(id)')
          .eq('departments.manager_id', managerId);

        if (error) {
          throw createError({
            message: error.message,
            statusCode: 500,
            fatal: true,
          });
        }

        return data;
      });
    },
    upsert: async (departmentLevel: DepartmentLevel | DepartmentLevel[]) => {
      const { data, error } = await supabase.from('department_levels').upsert(departmentLevel);

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 500,
          fatal: true,
        });
      }

      return data;
    },
    deleteByIds: async (departmentLevelIds: string[]) => {
      const { data, error } = await supabase.from('department_levels').delete().in('id', departmentLevelIds);

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 500,
          fatal: true,
        });
      }

      return data;
    },
  };
};
