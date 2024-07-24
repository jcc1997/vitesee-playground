<script lang="ts" setup>
import { useDefineSection } from '../composable';

const DefineSectionHeader = useDefineSection('header')
const DefineSectionMain = useDefineSection('main')

const counter = ref(0)
</script>

<template>
  <DefineSectionHeader>
    <div @click="counter++">
      DefineSectionHeader {{ counter }}
    </div>
  </DefineSectionHeader>
  <DefineSectionMain>
    <div @click="counter++">
      DefineSectionMain {{ counter}}
    </div>
  </DefineSectionMain>
</template>
