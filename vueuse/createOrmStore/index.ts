interface CreateOrmStoreOptions {}

export function createOrmStore(options: CreateOrmStoreOptions) {
  return createInjectionState(() => {
    return {}
  }, {})
}
