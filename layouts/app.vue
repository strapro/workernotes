<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app> </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <LayoutLogoutButton></LayoutLogoutButton>
    </v-app-bar>

    <v-main>
      <v-container> <slot /></v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const drawer = ref(true);
</script>
