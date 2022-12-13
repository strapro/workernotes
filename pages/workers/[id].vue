<template>
  <v-sheet v-if="worker" elevation="1">
    <v-img height="150" :src="profilePic"></v-img>

    <h3>{{ worker.first_name }} {{ worker.last_name }}</h3>

    <h4>Notes</h4>
    <ul v-if="notes">
      <li v-for="note in notes">
        <span>Note: {{ note.note }}</span>
        <span>Sentiment: {{ note.sentiment }}</span>
        <span>Created at: {{ note.created_at }}</span>
      </li>
    </ul>
  </v-sheet>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const route = useRoute();

const [{ data: worker, refresh: refreshWorker }, { data: notes, refresh: refreshNotes }] = await Promise.all([
  useAsyncData(`worker-${route.params.id}`, async () => {
    if (user.value) {
      const { data, error } = await supabase.from('workers').select('*').eq('id', route.params.id).single();

      if (!data) {
        throw createError({
          statusCode: 404,
          fatal: true,
        });
      }

      if (!error) {
        return data;
      }
    }

    return null;
  }),
  useAsyncData('notes-${route.params.id}', async () => {
    if (user.value) {
      const { data, error } = await supabase.from('worker_notes').select('*').eq('worker_id', route.params.id);

      if (!error) {
        return data;
      }
    }

    return null;
  }),
]);

const profilePic =
  worker.value && worker.value.profile_pic
    ? supabase.storage.from('worker-profile-pics').getPublicUrl(worker.value.profile_pic).data.publicUrl
    : 'no-pic.png';

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
