<template>
  <v-row class="mb-2">
    <v-col class="pt-5">
      <h3>{{ edit ? 'Edit' : 'New' }} {{ entityName }}{{ title ? `: ${title}` : '' }}</h3>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  edit: boolean;
  entityName: string;
  title: string;
}>();
</script>
