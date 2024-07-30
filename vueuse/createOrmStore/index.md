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

```ts
const entities: Record<string, Map<string, Modal>> = {}

function dispatchOperation(modal, op) {
  // ...
}

function pushMap(map, values)
function deleteMap(map, values)
function updateMap(map, values)
function mapToArray(map)

function create(modal, instances) {
  // ... check instances id existed

  pushMap(entities[modal.name], instances)

  dispatchOperation(modal, {
    type: 'create',
    targets: instances
  })
}

function findMany(modal, options) {

  const results = ref(filterByOptions(modal.all(), options))

  function isRelative(operation) {
    // ...
  }

  const removeListener = addListenerTo(modal, (all, operation) => {

    const relation = isRelative(operation)

    if (!isRelative(operation))
      return

    if (relation.type === 'reassign')
      results.value = filterByOptions(all, options)
    else if (operation.type === 'create')
      results.value = utils.addToList(results.value, operation.targets, options)
    else if (operation.type === 'delete')
      results.value = utils.delFromList(results.value, operation.targets, options)
    else if (operation.type === 'update')
      utils.updateFromList(results.value, operation.targets, options)
  })

  useScopeDispose(removeListener)

  return readonly(results)
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
