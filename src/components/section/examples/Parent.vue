<script setup lang="ts">
// import { useSection } from '../composable'
import HeaderMain from './HeaderMain.vue'
import { useHeaderSection, useMainSection } from './sections'

// const Section = useSection({})

const HeaderSection = useHeaderSection()
const MainSection = useMainSection()
</script>

<template>
  <!-- <header>
    <Section name="header">
      Default Header
    </Section>
  </header>
  <div class="flex">
    <nav>
      <Section name="nav">
        Default Nav
      </Section>
    </nav>
    <main>
      <Section name="main">
        Default Main
      </Section>
    </main>
  </div> -->
  <HeaderMain />
  <header>
    <HeaderSection>
      Default Header
    </HeaderSection>
  </header>
  <div class="flex">
    <nav>
      <Section name="nav">
        Default Nav
      </Section>
    </nav>
    <main>
      <MainSection>
        Default Main
      </MainSection>
    </main>
  </div>
</template>

<style lang="css">
header, nav, main, footer {
    padding: 20px;
}

header {
    background-color: #333;
    color: white;
    text-align: center;
}

nav {
    background-color: #bc7171;
}

main {
    background-color: #419256;
    flex: 1;
}

header {
    flex: 0 1 auto;
}

main {
    flex: 1;
}
</style>
