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
const departmentsRepository = useDepartmentsRepository();
const user = useSupabaseUser();
const route = useRoute();

const department = await departmentsRepository.getByIdOrNew(route.params.id as string, user.value?.id!);

const onSubmit = async () => {
  await departmentsRepository.upsert(department.value);
};

const onCancel = () => {
  navigateTo('/departments');
};

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
