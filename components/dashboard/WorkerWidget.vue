<template>
  <v-card class="mx-auto">
    <v-img height="150" :src="profilePic"></v-img>

    <v-card-title>{{ worker.first_name }} {{ worker.last_name }}</v-card-title>

    <v-card-text>
      <v-textarea v-model="note" auto-grow variant="filled" color="deep-purple" label="Note" rows="1"></v-textarea>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="justify-end">
      <v-btn color="warning" elevation="2" icon="mdi-thumb-down-outline" @click="createNote(-1)"></v-btn>
      <v-btn color="primary" elevation="2" icon="mdi-thumb-up-outline" @click="createNote(1)"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

type Worker = Database['public']['Tables']['workers']['Row'];

const props = defineProps<{
  worker: Worker;
}>();

const emit = defineEmits<{
  (e: 'workerNoteCreated'): void;
}>();

const supabase = useSupabaseClient<Database>();

const { $uuid } = useNuxtApp();

const profilePic = props.worker.profile_pic
  ? supabase.storage.from('worker-profile-pics').getPublicUrl(props.worker.profile_pic).data.publicUrl
  : 'no-pic.png';

const note = ref('');

const createNote = async (sentiment: Number) => {
  const { data, error } = await supabase.from('worker_notes').insert([
    {
      id: $uuid(),
      worker_id: props.worker.id,
      note: note.value,
      sentiment: sentiment,
    },
  ]);

  if (!error) {
    emit('workerNoteCreated');

    return data;
  }

  return null;
};
</script>
