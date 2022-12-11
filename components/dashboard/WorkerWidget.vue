<template>
  <v-card class="mx-auto">
    <v-img height="150" :src="profilePic"></v-img>

    <v-card-title>{{ worker.first_name }} {{ worker.last_name }}</v-card-title>

    <v-card-text>
      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

type Worker = Database['public']['Tables']['workers']['Row'];

const props = defineProps<{
  worker: Worker;
}>();

const supabase = useSupabaseClient<Database>();

const profilePic = props.worker.profile_pic
  ? supabase.storage.from('worker-profile-pics').getPublicUrl(props.worker.profile_pic).data.publicUrl
  : 'no-pic.png';
</script>
