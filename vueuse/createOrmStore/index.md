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

const { findMany, findFirst, create, del, update, User } = useInjectOrmStore()

const searchingOrgId = ref('targetOrgId')
// const queryUsers = findMany(User).select('firstName', 'lastName').where({ org: { id: searchingOrgId } }).collect()
// const user = findFirst(User).where({ id: '' }).computed()
const queryUsers = findMany(User, {
  select: ['firstName', 'lastName'],
  where: { org: { id: searchingOrgId } }
})

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
