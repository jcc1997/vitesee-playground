import { createInjectionState } from '@vueuse/core'
import type { FunctionalComponent, Slot } from 'vue-demi'
import { shallowReactive } from 'vue-demi'
import { camelize } from '@vueuse/shared'

const [provideContext, injectContext] = createInjectionState(() => {
  const renderMap = shallowReactive<Record<string, Slot | undefined>>({})

  return {
    renderMap,
  }
})

export function useDefineSection(name: string) {
  const { renderMap } = injectContext()!

  const DefineSection: FunctionalComponent = (_, { slots }) => {
    renderMap[name] = slots.default
    return null
  }

  return DefineSection
}

export interface UseSectionOptions {
  /**
   * Inherit attrs from reuse component.
   *
   * @default true
   */
  inheritAttrs?: boolean
}

export function useSection(options: UseSectionOptions) {
  const { renderMap } = provideContext()

  const { inheritAttrs = true } = options

  const Section: FunctionalComponent<{ name: string }> = (props, { attrs, slots }) => {
    const render = renderMap[props.name]
    if (!render)
      return slots.default?.()

    const vnode = render({ ...keysToCamelKebabCase(attrs), $slots: slots })
    return (inheritAttrs && vnode?.length === 1) ? vnode[0] : vnode
  }
  Section.props = {
    name: {
      type: String,
      required: true,
    },
  }

  return Section
}

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj)
    newObj[camelize(key)] = obj[key]
  return newObj
}
