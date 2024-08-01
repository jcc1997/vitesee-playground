class ModalValueField<T extends string | number | any | unknown = unknown> {
  defaultValue?: T
}

type Relation = 'belongsTo' | 'belongsToMany' | 'hasMany' | 'hasOne'

class ModalRelationField<R extends Relation, RM extends Modal<string, ModalFields>> {
  constructor(
    public readonly relation: R,
    public readonly relatedModal: RM,
    public readonly relatedKey: keyof RM['fields'],
  ) {}
}

type ModalField = ModalValueField | ModalRelationField<Relation, Modal<string, ModalFields>>

type ModalFields = { [x in string]: ModalField }

interface Modal<Name extends string, Fields extends ModalFields> {
  readonly name: Name
  readonly fields: Fields
  // indexes
}

interface CreateOrmStoreOptions<Ms extends Modal<string, ModalFields>[]> {
  modals: Ms
}

// type ModalData<M extends Modal<string, ModalFields>> = M extends Modal<string, infer Fields> ? Fields : never
interface ModalData<M extends Modal<string, ModalFields>> {
  __primary_key: string
}

type Operation =
 | { type: 'reassign'; targets: ModalData<any>[] }
 | { type: 'create'; targets: ModalData<any>[] }
 | { type: 'update'; targets: ModalData<any>[] }
 | { type: 'delete'; targets: ModalData<any>[] }

export function createOrmStore<const Ms extends Modal<string, ModalFields>[]>(options: CreateOrmStoreOptions<Ms>) {
  return createInjectionState(() => {
    const modals: Record<string, Map<string, ModalData<Modal<string, ModalFields>>>> = {}
    const listeners: Record<string, Set<Function>> = {}
    const Modals: any = {}

    for (const m of options.modals) {
      Modals[m.name] = m
      modals[m.name] = new Map()
      listeners[m.name] = new Set()
    }

    function dispatchOperationTo<M extends Ms[number]>(Modal: M, op: Operation) {
      const all = Array.from(modals[Modal.name].values())
      for (const l of listeners[Modal.name])
        l(all, op)
    }

    function addListenerTo<M extends Ms[number]>(Modal: M, cb: Function) {
      listeners[Modal.name].add(cb)
      return () => listeners[Modal.name].delete(cb)
    }

    function reassign<M extends Ms[number]>(Modal: M, list: ModalData<M>[]) {
      modals[Modal.name].clear()
      for (const each of list)
        modals[Modal.name].set(each.__primary_key, each)

      dispatchOperationTo(Modal, { type: 'reassign', targets: list })
    }

    function create<M extends Ms[number]>(Modal: M, list: ModalData<M>[]) {
      for (const each of list)
        modals[Modal.name].set(each.__primary_key, each)

      dispatchOperationTo(Modal, { type: 'reassign', targets: list })
    }

    function update<M extends Ms[number]>(Modal: M, part: Partial<ModalData<M>>, where: any) {}

    function del<M extends Ms[number]>(Modal: M, where: any) {}

    function findMany<M extends Ms[number]>(Modal: M, where: any) {
      addListenerTo(Modal, () => {

      })
    }
    function findOne<M extends Ms[number]>(Modal: M, where: any) {}

    return {
      ...Modals as { [x in Ms[number] as x['name']]: x },
      reassign,
      create,
      update,
      del,
      findMany,
      findOne,
    }
  }, {})
}
