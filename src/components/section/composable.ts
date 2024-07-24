import { createInjectionState } from "@vueuse/core";
import { defineComponent, shallowReactive, Slot } from "vue-demi"
// import { camelize } from '@vueuse/shared'

export function useDefineSection(section: string) {
  const { renderMap } = injectContext()!

  return defineComponent((_, { slots }) => {
    return () => {
      renderMap[section] = slots.default
    }
  })
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

  return defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      }
    },
    inheritAttrs,
    setup(props, { attrs, slots }) {
      return () => {
        const render = renderMap[props.name]
        if (!render) {
          return slots.default?.()
        }

        const vnode = render({ ...keysToCamelKebabCase(attrs), $slots: slots })
        return (inheritAttrs && vnode?.length === 1) ? vnode[0] : vnode
      }
    }
  })
}

const [provideContext, injectContext] = createInjectionState(() => {
  const renderMap = shallowReactive<Record<string, Slot | undefined>>({})

  return {
    renderMap
  }
})

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj)
    newObj[key] = obj[key]
  // newObj[camelize(key)] = obj[key]
  return newObj
}
