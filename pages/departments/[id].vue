<template>
  <FormsTitle entity-name="Department" :edit="!!department!.created_at" :title="department!.name!"></FormsTitle>
  <v-card>
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-text-field v-model="department!.name" label="Name" required></v-text-field>

      <h3>Levels</h3>
      <div v-for="departmentLevel in departmentLevels">
        <v-text-field v-model="departmentLevel.name" label="Name" required></v-text-field>
        <v-btn class="mr-4" @click="onDeleteLevel(departmentLevel.id)">Delete level</v-btn>
      </div>

      <v-btn class="mr-4" @click="onAddLevel">Add level</v-btn>

      <br />
      <v-btn class="mr-4" type="submit" color="primary">Save</v-btn>
      <v-btn class="mr-4" @click="onCancel">Cancel</v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
const departmentsRepository = useDepartmentsRepository();
const departmentLevelsRepository = useDepartmentLevelsRepository();

const user = useSupabaseUser();
const route = useRoute();

const department =
  route.params.id === 'new'
    ? departmentsRepository.new(user.value?.id!)
    : (await departmentsRepository.getById(route.params.id as string)).data;

const { data: departmentLevels } = await departmentLevelsRepository.getByDepartmentId(department.value!.id);

const departmentLevelsIdsToDelete: string[] = [];

const onAddLevel = () => {
  departmentLevels.value!.push(departmentLevelsRepository.new(department.value!.id).value);
};

const onDeleteLevel = (departmentLevelId: string) => {
  departmentLevels.value!.splice(
    departmentLevels.value!.findIndex((d) => d.id === departmentLevelId),
    1
  );
  departmentLevelsIdsToDelete.push(departmentLevelId);
};

const onSubmit = async () => {
  await departmentsRepository.upsert(department.value!);

  await Promise.all([
    departmentLevelsRepository.upsert(departmentLevels.value!),
    departmentLevelsRepository.deleteByIds(departmentLevelsIdsToDelete),
  ]);

  navigateTo('/departments');
};

const onCancel = () => {
  navigateTo('/departments');
};

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
