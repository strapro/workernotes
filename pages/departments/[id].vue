<template>
  <FormsTitle entity-name="Department" :edit="!!department!.created_at" :title="department!.name!"></FormsTitle>
  <v-card>
    <v-form ref="form" @submit.prevent="onSubmit">
      <v-text-field v-model="department!.name" label="Name" required></v-text-field>

      <h3>Levels</h3>
      <div v-for="departmentLevel in departmentLevels">
        <v-text-field v-model="departmentLevel.name" label="Name" required></v-text-field>

        <div v-for="departmentLevelDimension in departmentLevelDimensionsIndexed[departmentLevel.id]">
          <v-text-field v-model="departmentLevelDimension.name" label="Name" required></v-text-field>
          <v-textarea v-model="departmentLevelDimension.description" label="Description" required></v-textarea>

          <v-btn class="mr-4" @click="onDeleteLevelDimension(departmentLevel.id, departmentLevelDimension.id)"
            >Delete Dimension</v-btn
          >
        </div>

        <v-btn class="mr-4" @click="onAddLevelDimension(departmentLevel.id)">Add Dimension</v-btn>

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
const departmentLevelDimensionsRepository = useDepartmentLevelDimensionsRepository();

const user = useSupabaseUser();
const route = useRoute();

const department =
  route.params.id === 'new'
    ? departmentsRepository.new(user.value?.id!)
    : (await departmentsRepository.getById(route.params.id as string)).data;

const [{ data: departmentLevels }, { data: departmentLevelDimensions }] = await Promise.all([
  departmentLevelsRepository.getByDepartmentId(department.value!.id),
  departmentLevelDimensionsRepository.getByDepartmentId(department.value!.id),
]);

type departmentLevelDimensionTupple = Record<
  string,
  Array<NonNullable<typeof departmentLevelDimensions.value>[number]>
>;

const departmentLevelDimensionsIndexed = departmentLevelDimensions.value!.reduce<departmentLevelDimensionTupple>(
  (a, v) => {
    const { department_level_id } = v;

    a[department_level_id!] = a[department_level_id!] ?? [];
    a[department_level_id!].push(v);

    return a;
  },
  {}
);

const departmentLevelsIdsToDelete: string[] = [];
const departmentLevelsDimensionIdsToDelete: string[] = [];

const onAddLevel = () => {
  const newDepartment = departmentLevelsRepository.new(department.value!.id);

  departmentLevels.value!.push(newDepartment.value);

  departmentLevelDimensionsIndexed[newDepartment.value.id] = [];
};

const onDeleteLevel = (departmentLevelId: string) => {
  departmentLevels.value = departmentLevels.value!.filter((deparmentLevel) => deparmentLevel.id !== departmentLevelId);
  departmentLevelsIdsToDelete.push(departmentLevelId);

  departmentLevelDimensions.value = departmentLevelDimensions.value!.filter(
    (deparmentLevelDimension) => deparmentLevelDimension.department_level_id !== departmentLevelId
  );
  departmentLevelsDimensionIdsToDelete.push(
    ...departmentLevelDimensionsIndexed[departmentLevelId].map((deparmentLevelDimension) => deparmentLevelDimension.id)
  );
  delete departmentLevelDimensionsIndexed[departmentLevelId];
};

const onAddLevelDimension = (departmentLevelId: string) => {
  const newDepartmentLevel = departmentLevelDimensionsRepository.new(departmentLevelId);

  departmentLevelDimensions.value!.push(newDepartmentLevel.value);
  departmentLevelDimensionsIndexed[departmentLevelId].push(newDepartmentLevel.value);

  triggerRef(departmentLevels);
};

const onDeleteLevelDimension = (departmentLevelId: string, departmentLevelDimensionId: string) => {
  departmentLevelDimensions.value = departmentLevelDimensions.value!.filter(
    (deparmentLevelDimension) => deparmentLevelDimension.id !== departmentLevelDimensionId
  );
  departmentLevelsDimensionIdsToDelete.push(departmentLevelDimensionId);
  departmentLevelDimensionsIndexed[departmentLevelId] = departmentLevelDimensionsIndexed[departmentLevelId].filter(
    (departmentLevelDimension) => departmentLevelDimension.id !== departmentLevelDimensionId
  );

  triggerRef(departmentLevels);
};

const onSubmit = async () => {
  await Promise.all([
    departmentsRepository.upsert(department.value!),
    departmentLevelDimensionsRepository.deleteByIds(departmentLevelsDimensionIdsToDelete),
  ]);

  await Promise.all([
    departmentLevelsRepository.upsert(departmentLevels.value!),
    departmentLevelsRepository.deleteByIds(departmentLevelsIdsToDelete),
  ]);

  await departmentLevelDimensionsRepository.upsert(departmentLevelDimensions.value!);

  navigateTo('/departments');
};

const onCancel = () => {
  navigateTo('/departments');
};

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});

useSeoMeta({
  title: () => `Department ${department.value!.name}`,
});
</script>
