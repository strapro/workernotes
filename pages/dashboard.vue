<template>
  <div>
    <v-row>
      <v-col v-for="worker in workers" cols="4">
        <DashboardWorkerWidget
          :worker="worker"
          :department-name="departmentsIndexed[worker.department_id!].name!"
          :department-level-name="departmentLevelsIndexed[worker.department_level_id!].name!"
        />
      </v-col>
      <v-col cols="4">
        <DashboardWorkerCreateWidget
          :departments="departments!"
          :department-levels="departmentLevels!"
          @worker-created="refreshWorkers"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const workersRepository = useWorkersRepository();
const departmentsRepository = useDepartmentsRepository();
const deparmentLevelsRepository = useDepartmentLevelsRepository();
const user = useSupabaseUser();

const [{ data: workers, refresh: refreshWorkers }, { data: departments }, { data: departmentLevels }] =
  await Promise.all([
    workersRepository.getByManagerId(user.value?.id!),
    departmentsRepository.getByManagerId(user.value?.id!),
    deparmentLevelsRepository.getByManagerId(user.value?.id!),
  ]);

type departmentTupple = Record<string, NonNullable<typeof departments.value>[number]>;
type departmentLevelTupple = Record<string, NonNullable<typeof departmentLevels.value>[number]>;

const departmentsIndexed = departments.value!.reduce<departmentTupple>((a, v) => ({ ...a, [v.id]: v }), {});
const departmentLevelsIndexed = departmentLevels.value!.reduce<departmentLevelTupple>(
  (a, v) => ({ ...a, [v.id]: v }),
  {}
);

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
