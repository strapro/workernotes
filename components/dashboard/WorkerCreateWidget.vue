<template>
  <v-card class="mx-auto">
    <v-img height="150" :src="imageUrl"></v-img>

    <v-card-title>New Worker</v-card-title>

    <v-card-text>
      <v-file-input
        prepend-icon=""
        label="Profile pic"
        v-model="image"
        accept="image/png, image/jpeg, image/bmp"
        @change="onFileChange"
      />
      <v-text-field label="Worker first name" v-model="workerFirstName" />
      <v-text-field label="Worker last name" v-model="workerLastName" />
      <v-select
        label="Department"
        :items="departments"
        item-title="name"
        item-value="id"
        v-model="workerDepartmentId"
        @update:modelValue="onDepartmentChange"
      ></v-select>
      <v-select
        label="Level"
        :items="departmentLevels.filter((dl) => dl.department_id === workerDepartmentId)"
        item-title="name"
        item-value="id"
        v-model="workerDepartmentLevelId"
      ></v-select>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="justify-end">
      <v-btn color="primary" elevation="2" @click="createWorker"> Create worker </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

type Department = Database['public']['Tables']['departments']['Row'];
type DepartmentLevel = Database['public']['Tables']['department_levels']['Row'];

const props = defineProps<{
  departments: Array<Department>;
  departmentLevels: Array<DepartmentLevel>;
}>();

const emit = defineEmits<{
  (e: 'workerCreated'): void;
}>();

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { $uuid } = useNuxtApp();

const workerFirstName = ref('');
const workerLastName = ref('');
const workerDepartmentId = ref(null);
const workerDepartmentLevelId = ref(null);

const createWorker = async () => {
  if (user.value) {
    const { data, error } = await supabase.from('workers').insert([
      {
        id: $uuid(),
        first_name: workerFirstName.value,
        last_name: workerLastName.value,
        department_id: workerDepartmentId.value,
        department_level_id: workerDepartmentLevelId.value,
        manager_id: user.value.id,
        profile_pic: await uploadProfilePic(),
      },
    ]);

    if (!error) {
      emit('workerCreated');

      return data;
    }

    return null;
  }
};

const uploadProfilePic = async () => {
  let profilePicData = null;

  if (image && Array.isArray(image.value)) {
    const extension = image.value[0].name.split('.').pop();

    const { data, error } = await supabase.storage
      .from('worker-profile-pics')
      .upload(`${$uuid()}.${extension}`, image.value[0], {
        cacheControl: '3600',
        upsert: false,
      });

    if (!error) {
      profilePicData = data.path;
    }
  }

  return profilePicData;
};

const image = ref();
const imageUrl = ref('no-pic.png');

const onFileChange = () => {
  if (!image || !Array.isArray(image.value)) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    imageUrl.value = e?.target?.result as string;
  };

  reader.readAsDataURL(image.value[0]);
};

const onDepartmentChange = () => {
  workerDepartmentLevelId.value = null;
};
</script>
