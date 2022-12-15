import { Database } from 'types/database';

export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient<Database>();

  return {
    provide: {
      workerPicPuclicUrl: (profile_pic: string | null) => {
        return profile_pic
          ? supabase.storage.from('worker-profile-pics').getPublicUrl(profile_pic).data.publicUrl
          : '/no-pic.png';
      },
    },
  };
});
