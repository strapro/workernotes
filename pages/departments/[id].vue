<template>
  <FormsTitle entity-name="Department" :edit="!!department.created_at" :title="department.name!"></FormsTitle>
  <v-card>
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-text-field v-model="department.name" label="Name" required></v-text-field>
      <v-btn type="submit" color="primary" class="mr-4"> Save </v-btn>
      <v-btn class="mr-4" @click="onCancel"> Cancel </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';
import { Ref } from 'vue';

type Department = Database['public']['Tables']['departments']['Row'];

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { $uuid } = useNuxtApp();
const route = useRoute();

const getDepartment = async () => {
  if (route.params.id === 'new') {
    return ref<Department>({
      id: $uuid(),
      name: '',
      manager_id: user.value?.id!,
      created_at: null,
      updated_at: null,
    });
  } else {
    const { data: department, error } = await useAsyncData(`department-${route.params.id}`, async () => {
      const { data, error } = await supabase.from('departments').select('*').eq('id', route.params.id);

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
};

const department = await getDepartment();

const onSubmit = async () => {
  const { data, error } = await supabase.from('departments').upsert(department.value);

  if (!error) {
    navigateTo('/departments');
  }

  return null;
};

const onCancel = () => {
  navigateTo('/departments');
};

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
