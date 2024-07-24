<script lang="ts" setup>
// import { useDefineSection } from '../composable'
import { defineHeaderSection, defineMainSection } from './sections'

// const DefineSectionHeader = useDefineSection('header')
// const DefineSectionMain = useDefineSection('main')

const DefineHeaderSection = defineHeaderSection()
const DefineMainSection = defineMainSection()

const counter = ref(0)
</script>

<template>
  <!-- <DefineSectionHeader>
    <div @click="counter++">
      DefineSectionHeader {{ counter }}
    </div>
  </DefineSectionHeader>
  <DefineSectionMain>
    <div @click="counter++">
      DefineSectionMain {{ counter }}
    </div>
  </DefineSectionMain> -->
  <DefineHeaderSection>
    <div @click="counter++">
      DefineHeaderSection {{ counter }}
    </div>
  </DefineHeaderSection>
  <DefineMainSection>
    <div @click="counter++">
      DefineMainSection {{ counter }}
    </div>
  </DefineMainSection>
</template>
