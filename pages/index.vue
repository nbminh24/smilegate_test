<template>
  <div>
    <AppHeader 
      title="Game List Page"
      :features="[
        'Manage the list of games',
        'Support search and filter by category and keyword',
        'Display games in a table format with pagination',
        'Support multi-select to delete games in bulk',
        'Include a button to register a new game'
      ]"
    />
    
    <div class="container">
      <!-- Game Management Section -->
      <div class="card p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Game Management</h2>
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Category</label>
            <Dropdown 
              v-model="filters.category" 
              :options="categories" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select Category"
              class="w-full"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Keyword</label>
            <InputText 
              v-model="filters.keyword" 
              placeholder="Search games..."
              class="w-full"
            />
          </div>
          <Button @click="searchGames" icon="pi pi-search" label="Search" />
        </div>
      </div>

      <!-- Game List Section -->
      <div class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Game List</h2>
          <div class="flex gap-2">
            <Button 
              @click="deleteSelected" 
              icon="pi pi-trash" 
              label="Delete Selected" 
              severity="danger"
              :disabled="selectedGames.length === 0"
            />
            <Button 
              @click="navigateToRegister" 
              icon="pi pi-plus" 
              label="Register New Game" 
              class="btn-primary"
            />
          </div>
        </div>

        <DataTable 
          :value="games" 
          v-model:selection="selectedGames"
          :loading="loading"
          selectionMode="multiple"
          dataKey="id"
          class="mb-4"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="id" header="ID" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-gamepad text-smilegate-blue"></i>
                {{ data.id }}
              </div>
            </template>
          </Column>
          <Column field="name" header="Name" sortable>
            <template #body="{ data }">
              {{ getDefaultName(data.name) }}
            </template>
          </Column>
          <Column field="category" header="Category" sortable></Column>
          <Column header="Actions" style="width: 100px">
            <template #body="{ data }">
              <Button 
                @click="editGame(data.id)" 
                icon="pi pi-pencil" 
                size="small"
                text
              />
            </template>
          </Column>
        </DataTable>

        <Paginator 
          v-model:first="pagination.first" 
          v-model:rows="pagination.rows"
          :totalRecords="pagination.totalItems"
          @page="onPageChange"
        />
      </div>
    </div>

    <ClientOnly>
      <Toast />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = process.client ? useToast() : null
const confirm = process.client ? useConfirm() : null

// Data
const games = ref([])
const selectedGames = ref([])
const loading = ref(false)

// Filters
const filters = ref({
  category: 'ALL',
  keyword: ''
})

// Pagination
const pagination = ref({
  first: 0,
  rows: 10,
  totalItems: 0
})

// Categories
const categories = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Adventure', value: 'ADVENTURE' },
  { label: 'Action', value: 'ACTION' },
  { label: 'RPG', value: 'RPG' },
  { label: 'Strategy', value: 'STRATEGY' }
]

// Methods
const getDefaultName = (names: any[]) => {
  const defaultName = names.find(name => name.isDefault)
  return defaultName ? defaultName.value : names[0]?.value || 'N/A'
}

const searchGames = async () => {
  loading.value = true
  try {
    const query = new URLSearchParams({
      category: filters.value.category,
      keyword: filters.value.keyword,
      page: Math.floor(pagination.value.first / pagination.value.rows) + 1,
      limit: pagination.value.rows
    })
    
    const response = await $fetch(`/api/games?${query}`)
    games.value = response.games
    pagination.value.totalItems = response.pagination.totalItems
  } catch (error) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load games',
        life: 3000
      })
    }
  } finally {
    loading.value = false
  }
}

const onPageChange = (event: any) => {
  pagination.value.first = event.first
  pagination.value.rows = event.rows
  searchGames()
}

const deleteSelected = () => {
  if (selectedGames.value.length === 0 || !confirm) return
  
  confirm.require({
    message: `Are you sure you want to delete ${selectedGames.value.length} selected game(s)?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await $fetch('/api/games/delete', {
          method: 'POST',
          body: { ids: selectedGames.value.map(game => game.id) }
        })
        
        if (toast) {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Successfully deleted ${selectedGames.value.length} game(s)`,
            life: 3000
          })
        }
        
        selectedGames.value = []
        searchGames()
      } catch (error) {
        if (toast) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete games',
            life: 3000
          })
        }
      }
    }
  })
}

const editGame = (id: string) => {
  navigateTo(`/register/${id}`)
}

const navigateToRegister = () => {
  navigateTo('/register')
}

// Load games on mount
onMounted(() => {
  searchGames()
})

// Watch filters
watch(filters, () => {
  pagination.value.first = 0
  searchGames()
}, { deep: true })
</script> 