import { Database } from 'types/database';
import { Ref } from 'vue';

type Department = Database['public']['Tables']['departments']['Row'];

export const useDepartmentsRepository = () => {
  const { $uuid } = useNuxtApp();
  const supabase = useSupabaseClient<Database>();

  return {
    new: (managerId: string) => {
      return ref<Department>({
        id: $uuid(),
        name: '',
        manager_id: managerId,
      } as Department);
    },
    getById: async (id: string) => {
      return await useAsyncData(`department-by-id-${id}`, async () => {
        const { data, error } = await supabase.from('departments').select('*').eq('id', id);

        if (error) {
          throw createError({
            message: error.message,
            statusCode: 500,
            fatal: true,
          });
        }

        if (data.length == 0) {
          throw createError({
            statusCode: 404,
            fatal: true,
          });
        }

        return data[0];
      });
    },
    getByManagerId: async (managerId: string) => {
      return await useAsyncData(`departments-by-manager-id-${managerId}`, async () => {
        const { data, error } = await supabase.from('departments').select('*').eq('manager_id', managerId);

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
    upsert: async (department: Department) => {
      const { data, error } = await supabase.from('departments').upsert(department);

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
