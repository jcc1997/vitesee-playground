import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Fragment, h, isVue2 } from 'vue-demi'
import { createSection } from '.'

describe.skipIf(isVue2)('createSection', () => {
  it('should work', () => {
    const [DefineFoo, ReuseFoo] = createSection('foo', {})
    const [DefineBar, ReuseBar] = createSection('bar', {})
    const Zig = createSection('zig', {})

    const wrapper = mount({
      render() {
        return h(Fragment, null, [
          h(DefineFoo, () => ['Foo']),
          h(ReuseFoo),

          h(DefineBar, () => ['Bar']),
          h(Zig.defineSection, () => ['Zig']),
          h(ReuseFoo),
          h(ReuseBar),
          h(Zig.useSection),
        ])
      },
    })

    expect(wrapper.text()).toBe('FooFooBarZig')
  })
})
