import { Database } from 'types/database';
import { Ref } from 'vue';

type Department = Database['public']['Tables']['departments']['Row'];

export const useDepartmentsRepository = () => {
  const { $uuid } = useNuxtApp();
  const supabase = useSupabaseClient<Database>();

  return {
    getByManagerId: async (manager_id: string) => {
      return await useAsyncData(`departments-by-manager-id-${manager_id}`, async () => {
        const { data, error } = await supabase.from('departments').select('*').eq('manager_id', manager_id);

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
    getByIdOrNew: async (id: string, manager_id: string) => {
      if (id === 'new') {
        return ref<Department>({
          id: $uuid(),
          name: '',
          manager_id: manager_id,
          created_at: null,
          updated_at: null,
        });
      } else {
        const { data: department, error } = await useAsyncData(`department-by-id-${id}`, async () => {
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

        if (error.value) {
          throw error.value;
        }

        return department as Ref<Department>;
      }
    },
    upsert: async (department: Department) => {
      const { data, error } = await supabase.from('departments').upsert(department);

      if (!error) {
        navigateTo('/departments');
      }

      return null;
    },
  };
};
