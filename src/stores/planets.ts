import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { Planet } from '@/interfaces'

interface ListManager {
  lastFetchTs: number
  currentFetch?: Promise<void>
  loading: boolean
  list: Planet[]
}

export const usePlanetsStore = defineStore('counter', () => {
  const listManagerStorage = JSON.parse(
      localStorage.getItem('planets.listManager') ?? 'null'
    ) as ListManager | null,
    listManager = reactive<ListManager>({
      lastFetchTs: listManagerStorage?.lastFetchTs ?? 0,
      currentFetch: undefined,
      loading: false,
      list: listManagerStorage?.list ?? [],
    })

  const fetchList = () => {
    if (!listManager.currentFetch) {
      listManager.loading = true
      listManager.currentFetch = fetch('https://helldivers-2-dotnet.fly.dev/api/v1/planets')
        .then((response: Response) => {
          if (!response.ok) throw new Error(response.statusText)
          return response.json()
        })
        .then((planets: Planet[]) => {
          listManager.list = planets
        })
        .finally(() => {
          Object.assign(listManager, {
            currentFetch: undefined,
            loading: false,
          })
          listManager.currentFetch = undefined
          listManager.loading = false
        })
    }

    return listManager.currentFetch
  }

  return {
    list: computed(() => listManager.list),
    needsFetching: computed(() => !listManager.list.length && !listManager.loading),
    loading: computed(() => listManager.loading),
    fetch: fetchList,
  }
})
