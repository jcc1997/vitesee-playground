# Concepts

```typescript
const User = defineModal({
  name: 'User',
  fields: {
    id: orm.str(),
    firstName: orm.str(),
    lastName: orm.str().nullable(),
    org: orm.hasOne<Org.Type>('Org', 'id')
  },
})

const Org = defineModal({
  name: 'Org',
  fields: {
    id: orm.str(),
    name: orm.str(),
    users: orm.hasMany<User.Type>('User', 'id')
  },
})

export const [useProvideOrmStore, useInjectOrmStore] = createOrmStore({
  entities: [User, Org]
})

// usage

const { findMany, findFirst, reassign, create, del, update, User } = useInjectOrmStore()

const searchingOrgId = ref('targetOrgId')
// const queryUsers = findMany(User).select('firstName', 'lastName').where({ org: { id: searchingOrgId } }).collect()
// const user = findFirst(User).where({ id: '' }).computed()
const queryUsers = findMany(User, {
  select: ['firstName', 'lastName'],
  where: { org: { id: searchingOrgId } }
})
const user = findFirst(User, {
  where: { id: '' }
})

// reassign 重新赋值
reassign(User, [
  { id: '', name: '', org: '' }
])

// create
create(User, [
  { id: '', name: '', org: '' }
])

// delete
del(User, { where: { firstName: orm.operator.contain('abc' )} })

// update
update(User, { firstName: 'abc' }, { where: { firstName: orm.operator.contain('abc' )} })
update(User, (origin) => ({ firstName: origin.firstName + 'Changed' }), { where: { firstName: orm.operator.contain('abc' )} })
```

implement

```ts
const entities: Record<string, Map<string, ModalData>> = {}

function dispatchOperation(modal, op) {
  // ...
}

function pushMap(map, values)
function deleteMap(map, values)
function updateMap(map, values)
function mapToArray(map)

/** indexes start */
class Index<M extends Modal> {
  constructor(
    public readonly modal: Modal,
    public readonly attrs: (keyof M)[],
  ) {}

  symbols = new Map()

  key(m: Modal): IndexKey {
    const keys = this.attrs.map(a => `${a}:${m[a]}`).join(',')

    if (!this.symbols.has(keys))
      this.symbols.set(keys, new Symbol(keys))

    return this.symbols.get(keys)!
  }
}

const indexes: Record<string, WeakMap<IndexKey, ModalData[]>> = {}
/** indexes end */

function create(modal, instances) {
  // ... check instances id existed

  pushMap(entities[modal.name], instances)

  dispatchOperation(modal, {
    type: 'create',
    targets: instances
  })
}

function findMany(modal, options) {

  const raws = ref(filterByOptions(modal.all(), options))

  /**
   * in OrgList
   * {
   *    users: WeakMap { '{org-id}': [OrgVO] }
   * }
   */
  const relationMap: Record<string, WeakMap<IndexKey, ModalData[]>> = {}

  function isRelative(operation) {
    // ...
    // check where match
  }

  const removeListener = addListenerTo(modal, (all, operation) => {

    const relation = isRelative(operation)

    if (!isRelative(operation))
      return

    if (relation.type === 'reassign') {
      raws.value = filterByOptions(all, options)
      rebuildRelationMap(all)
    }
    else if (operation.type === 'create') {
      raws.value = utils.addToList(raws.value, operation.targets, options)
      addRelationMap(operation.targets)
    }
    else if (operation.type === 'delete') {
      raws.value = utils.delFromList(raws.value, operation.targets, options)
    }
    else if (operation.type === 'update') {
      utils.updateFromList(raws.value, operation.targets, options)
    }
  })

  useScopeDispose(removeListener)

  const targets = reactive<Record<string, Record<string, ModalData>>>()
  const relations = reactive<Record<string, Record<string, ModalData | ModalData[]>>>({})

  // return readonly(raws)
  return computed(() => {
    // 处理联表
    return raw.map((v) => {
      // 联表
      return v
    })
  })
}

function joinRelationMany() {
  const result = ref<T>()

  const removeListener = addListenerTo(modal, (all, operation) => {
    // ...
  })

  useScopeDispose(removeListener)

  return [readonly(result), removeListener]
}

function joinRelationOne() {

}

function findFirst<T>(modal: Modal<T>, options) {

  const result = ref<T>()

  const removeListener = addListenerTo(modal, (all, operation) => {
    // ...
  })

  useScopeDispose(removeListener)

  return readonly(result)
}
```
