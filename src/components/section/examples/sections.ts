import { createSection } from '../composable2'

export const [useHeaderSection, defineHeaderSection] = createSection('header', { inheritAttrs: true })
export const [useMainSection, defineMainSection] = createSection('main', { inheritAttrs: true })
