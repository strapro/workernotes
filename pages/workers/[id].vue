<template>
  <v-sheet v-if="worker" elevation="1">
    <v-img height="150" :src="$workerPicPuclicUrl(worker.profile_pic)"></v-img>

    <h3>{{ worker.first_name }} {{ worker.last_name }}</h3>

    <v-timeline side="end" density="comfortable">
      <v-timeline-item v-for="note in notes" size="large" dot-color="#FFF">
        <template v-slot:icon>
          <v-icon :icon="note.sentiment! > 0 ? 'mdi-thumb-up-outline' : 'mdi-thumb-down-outline'"></v-icon>
        </template>
        <template v-slot:opposite>
          <span>{{ $dayjs(note.created_at).format('DD/MM/YYYY') }}</span>
        </template>
        <div>{{ note.note }}</div>
      </v-timeline-item>
    </v-timeline>
  </v-sheet>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const route = useRoute();

const [{ data: worker, refresh: refreshWorker }, { data: notes, refresh: refreshNotes }] = await Promise.all([
  useAsyncData(`worker-${route.params.id}`, async () => {
    const { data, error } = await supabase.from('workers').select('*').eq('id', route.params.id).single();

    if (!data) {
      throw createError({
        statusCode: 404,
        fatal: true,
      });
    }

    if (error) {
      throw createError({
        statusCode: 500,
        fatal: true,
      });
    }

    return data;
  }),
  useAsyncData('notes-${route.params.id}', async () => {
    const { data, error } = await supabase.from('worker_notes').select('*').eq('worker_id', route.params.id);

    if (error) {
      throw createError({
        statusCode: 500,
        fatal: true,
      });
    }

    return data;
  }),
]);

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});

useSeoMeta({
  title: () => `Worker ${worker.value!.first_name}`,
});
</script>
