import { camelize } from '@vueuse/shared'
import type { EmitsOptions, FunctionalComponent, ShallowRef, Slot } from 'vue-demi'

export interface UseSectionOptions {
  /**
     * Inherit attrs from reuse component.
     *
     * @default true
     */
  inheritAttrs?: boolean
}

export function createSection<P = {}, E extends EmitsOptions | Record<string, any[]> = {}>(name: string, options?: UseSectionOptions) {
  function useSection() {
    const render = shallowRef<Slot | undefined>()
    provide(name, { render })

    const { inheritAttrs = true } = options ?? {}

    const Section: FunctionalComponent<P, E> = (_, { attrs, slots, emit }) => {
      if (!render.value)
        return slots.default?.()

      const vnode = render.value({ ...keysToCamelKebabCase(attrs), $slots: slots }, { emit })
      return (inheritAttrs && vnode?.length === 1) ? vnode[0] : vnode
    }

    return Section
  }

  function defineSection() {
    const { render } = inject<{ render: ShallowRef<Slot | undefined> }>(name)!

    const DefineSection: FunctionalComponent<{}, {}, { default: (props: P) => any }> = (_, { slots }) => {
      render.value = slots.default
      return null
    }

    return DefineSection
  }

  return makeDestructurable(
    { useSection, defineSection },
    [useSection, defineSection],
  )
}

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj)
    newObj[camelize(key)] = obj[key]
  return newObj
}
