<template>
  <main>
    <div class="container">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">Game Management System</h1>
        <p class="page-subtitle">Manage and organize your game collection with ease</p>
      </div>

      <!-- Search Section Card -->
      <div class="search-section">
        <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div class="flex flex-col md:flex-row gap-6 flex-1">
            <div class="flex-1">
              <InputText 
                v-model="searchKeyword" 
                placeholder="Search games by ID, name, or category..." 
                class="w-full"
              />
            </div>
            <Dropdown 
              v-model="selectedCategory" 
              :options="categoryOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Filter by Category" 
              class="w-full md:w-64"
              showClear
              :showClear="selectedCategory !== null"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <div v-if="option.value" class="w-3 h-3 rounded-full" :style="{ backgroundColor: getCategoryColor(option.value) }"></div>
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </Dropdown>
          </div>
          <div class="flex gap-4">
            <Button @click="refreshGames" outlined>
              <i class="pi pi-refresh mr-2"></i>
              Refresh
            </Button>
            <NuxtLink to="/register/new">
              <Button>
                <i class="pi pi-plus mr-2"></i>
                New Game
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Game Collection Card -->
      <div class="game-collection">
        <div class="card-header">
          <div class="flex items-center gap-3">
            <i class="pi pi-gamepad"></i>
            <h2>Game Collection</h2>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-500">
              {{ filteredGames.length }} games found
            </div>
            <Button 
              v-if="selectedGames.length > 0"
              @click="showDeleteConfirmation" 
              severity="danger"
              outlined
            >
              <i class="pi pi-trash mr-2"></i>
              Delete Selected ({{ selectedGames.length }})
            </Button>
          </div>
        </div>
        
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="skeleton h-20 rounded-lg"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="filteredGames.length === 0" class="empty-state">
            <i class="pi pi-inbox"></i>
            <h3>No games found</h3>
            <p>Try adjusting your search criteria or add a new game to get started.</p>
            <NuxtLink to="/register/new">
              <Button>
                <i class="pi pi-plus mr-2"></i>
                Add First Game
              </Button>
            </NuxtLink>
          </div>
          
          <!-- Data Table -->
          <DataTable 
            v-else
            :value="filteredGames" 
            :paginator="true" 
            :rows="10"
            :rows-per-page-options="[5, 10, 20, 50]"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            current-page-report-template="Showing {first} to {last} of {totalRecords} games"
            responsive-layout="scroll"
            class="w-full"
            striped-rows
            v-model:selection="selectedGames"
            dataKey="id"
          >
            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            
            <!-- Game ID Column -->
            <Column field="id" header="Game ID" :sortable="true" style="width: 180px">
              <template #body="{ data }">
                <span class="font-mono text-sm font-semibold text-gray-700">
                  <span v-html="highlightText(data.id, searchKeyword)"></span>
                </span>
              </template>
            </Column>
            
            <!-- Category Column -->
            <Column field="category" header="Category" :sortable="true" style="width: 140px">
              <template #body="{ data }">
                <span class="category-badge">
                  <span v-html="highlightText(data.category, searchKeyword)"></span>
                </span>
              </template>
            </Column>
            
            <!-- English Name Column -->
            <Column field="name.en" header="English Name" :sortable="true" style="width: 200px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag en">EN</span>
                  <span class="font-medium">
                    <span v-html="highlightText(data.name.en || '-', searchKeyword)"></span>
                  </span>
                </div>
              </template>
            </Column>
            
            <!-- Korean Name Column -->
            <Column field="name.ko" header="Korean Name" :sortable="true" style="width: 200px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag ko">KO</span>
                  <span class="font-medium">
                    <span v-html="highlightText(data.name.ko || '-', searchKeyword)"></span>
                  </span>
                </div>
              </template>
            </Column>
            
            <!-- Japanese Name Column -->
            <Column field="name.ja" header="Japanese Name" :sortable="true" style="width: 200px">
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag ja">JA</span>
                  <span class="font-medium">
                    <span v-html="highlightText(data.name.ja || '-', searchKeyword)"></span>
                  </span>
                </div>
              </template>
            </Column>
            
            <!-- Actions Column -->
            <Column header="Actions" style="width: 100px" :frozen="true" alignFrozen="right">
              <template #body="{ data }">
                <div class="action-btn">
                  <NuxtLink :to="`/register/${data.id}`" v-tooltip.top="'Edit Game'">
                    <Button class="action-btn edit" icon="pi pi-pencil" outlined />
                  </NuxtLink>
                  <Button 
                    @click="showSingleDeleteConfirmation(data)" 
                    class="action-btn delete"
                    v-tooltip.top="'Delete Game'"
                    icon="pi pi-trash"
                    outlined
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialogs -->
    <Dialog 
      v-model:visible="showBulkDeleteDialog" 
      modal 
      header="Confirm Bulk Delete" 
      :style="{ width: '450px' }"
      :closable="false"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: #fbbf24;" />
        <span>
          Are you sure you want to delete <strong>{{ selectedGames.length }}</strong> selected game{{ selectedGames.length > 1 ? 's' : '' }}?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="showBulkDeleteDialog = false" class="p-button-text" />
        <Button 
          label="Yes, Delete" 
          icon="pi pi-check" 
          @click="confirmBulkDelete" 
          class="p-button-danger" 
          :loading="deleting"
        />
      </template>
    </Dialog>

    <Dialog 
      v-model:visible="showSingleDeleteDialog" 
      modal 
      header="Confirm Delete" 
      :style="{ width: '450px' }"
      :closable="false"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: #fbbf24;" />
        <span>
          Are you sure you want to delete game <strong>{{ gameToDelete?.id }}</strong>?
        </span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="showSingleDeleteDialog = false" class="p-button-text" />
        <Button 
          label="Yes, Delete" 
          icon="pi pi-check" 
          @click="confirmSingleDelete" 
          class="p-button-danger" 
          :loading="deleting"
        />
      </template>
    </Dialog>

    <Toast />
  </main>
</template>

<script setup>
const { $toast } = useNuxtApp()

// Reactive data
const games = ref([])
const loading = ref(true)
const searchKeyword = ref('')
const selectedCategory = ref(null)
const selectedGames = ref([])
const deleting = ref(false)

// Dialog states
const showBulkDeleteDialog = ref(false)
const showSingleDeleteDialog = ref(false)
const gameToDelete = ref(null)

// Category colors for filter dropdown
const categoryColors = {
  'Adventure': '#3b82f6',
  'RPG': '#ef4444',
  'Strategy': '#10b981',
  'Sports': '#f59e0b',
  'Racing': '#8b5cf6',
  'Puzzle': '#6b7280',
  'Simulation': '#f97316',
  'Horror': '#059669',
  'Comedy': '#ec4899'
}

// Computed properties
const categoryOptions = computed(() => {
  const cats = [...new Set(games.value.map(game => game.category))]
  return [
    { label: 'All Categories', value: null },
    ...cats.map(cat => ({ label: cat, value: cat }))
  ]
})

const filteredGames = computed(() => {
  let filtered = games.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(game => 
      game.id.toLowerCase().includes(keyword) ||
      game.category.toLowerCase().includes(keyword) ||
      Object.values(game.name).some(name => 
        name ? name.toLowerCase().includes(keyword) : false
      )
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(game => game.category === selectedCategory.value)
  }

  return filtered
})

// Methods
const getCategoryColor = (category) => {
  return categoryColors[category] || '#6b7280'
}

const highlightText = (text, keyword) => {
  if (!keyword || !text) return text || '-'
  
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}

const fetchGames = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/games')
    games.value = response.games || []
  } catch (error) {
    console.error('Error fetching games:', error)
    $toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load games',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const refreshGames = () => {
  fetchGames()
  $toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Game list refreshed',
    life: 2000
  })
}

const showDeleteConfirmation = () => {
  showBulkDeleteDialog.value = true
}

const showSingleDeleteConfirmation = (game) => {
  gameToDelete.value = game
  showSingleDeleteDialog.value = true
}

const confirmBulkDelete = async () => {
  if (selectedGames.value.length === 0) return

  try {
    deleting.value = true
    const gameIds = selectedGames.value.map(game => game.id)
    
    for (const gameId of gameIds) {
      await $fetch(`/api/games/delete`, {
        method: 'POST',
        body: { id: gameId }
      })
    }
    
    selectedGames.value = []
    showBulkDeleteDialog.value = false
    await fetchGames()
    $toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${gameIds.length} games deleted successfully`,
      life: 3000
    })
  } catch (error) {
    console.error('Error deleting selected games:', error)
    $toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete selected games',
      life: 3000
    })
  } finally {
    deleting.value = false
  }
}

const confirmSingleDelete = async () => {
  if (!gameToDelete.value) return

  try {
    deleting.value = true
    
    await $fetch(`/api/games/delete`, {
      method: 'POST',
      body: { id: gameToDelete.value.id }
    })
    
    showSingleDeleteDialog.value = false
    gameToDelete.value = null
    await fetchGames()
    $toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game deleted successfully',
      life: 3000
    })
  } catch (error) {
    console.error('Error deleting game:', error)
    $toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete game',
      life: 3000
    })
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchGames()
})
</script>
