import { Database } from 'types/database';

export const useWorkersRepository = () => {
  const supabase = useSupabaseClient<Database>();

  return {
    getByManagerId: async (managerId: string) => {
      return await useAsyncData(`departments-by-worker-id-${managerId}`, async () => {
        const { data, error } = await supabase.from('workers').select('*').eq('manager_id', managerId);

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
  };
};
