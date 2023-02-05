import { Database } from 'types/database';

type DepartmentLevelDimension = Database['public']['Tables']['department_level_dimensions']['Row'];

export const useDepartmentLevelDimensionsRepository = () => {
  const { $uuid } = useNuxtApp();
  const supabase = useSupabaseClient<Database>();

  return {
    new: (departmentLevelId: string) => {
      return ref<DepartmentLevelDimension>({
        id: $uuid(),
        name: '',
        description: '',
        department_level_id: departmentLevelId,
        created_at: null,
        updated_at: null,
      });
    },
    getByDepartmentId: async (departmentId: string) => {
      return await useAsyncData(`department-level-dimensions-by-department-id-${departmentId}`, async () => {
        const { data, error } = await supabase
          .from('department_level_dimensions')
          .select('*, department_levels!inner(id)')
          .eq('department_levels.department_id', departmentId);

        if (error) {
          throw createError({
            message: error.message,
            statusCode: 500,
            fatal: true,
          });
        }

        return data.map((d) => {
          const { department_levels, ...cleanD } = d;

          return cleanD;
        });
      });
    },
    upsert: async (departmentLevelDimensions: DepartmentLevelDimension | DepartmentLevelDimension[]) => {
      const { data, error } = await supabase.from('department_level_dimensions').upsert(departmentLevelDimensions);

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 500,
          fatal: true,
        });
      }

      return data;
    },
    deleteByIds: async (departmentLevelDimensionsIds: string[]) => {
      const { data, error } = await supabase
        .from('department_level_dimensions')
        .delete()
        .in('id', departmentLevelDimensionsIds);

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
