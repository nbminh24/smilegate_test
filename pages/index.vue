<template>
  <main>
    <div class="container">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">Game Management System</h1>
        <p class="page-subtitle">Manage and organize your game collection with ease</p>
      </div>

      <!-- Search Section Card -->
      <div class="card p-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-x-4 bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl border-2 border-transparent transition-all duration-300 focus-within:border-smilegate-blue focus-within:bg-white">
            <div class="relative md:col-span-2">
              <i class="pi pi-search absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"></i>
              <InputText
                v-model="searchKeyword"
                placeholder="Search games by ID, name, or category..."
                class="w-full !pl-11 bg-transparent border-none focus:ring-0 h-12 text-base"
              />
            </div>
            <div class="relative md:col-span-1">
              <Button 
                @click="toggleCategoryFilter"
                :class="['w-full bg-transparent border-none focus:ring-0 h-12 text-left px-3 flex items-center justify-between text-base', selectedCategory ? 'text-gray-800' : 'text-gray-500']"
              >
                <span>{{ selectedCategory ? selectedCategory : 'Category' }}</span>
                <i class="pi pi-chevron-down text-gray-400"></i>
              </Button>
              <Button 
                v-if="selectedCategory" 
                icon="pi pi-times" 
                class="absolute top-1/2 -translate-y-1/2 right-10 w-6 h-6 rounded-full !p-0 bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800"
                @click.stop="clearCategoryFilter"
              />
              <OverlayPanel ref="categoryOverlay" class="!p-0 !shadow-2xl !border-none !rounded-xl mt-2">
                <div class="bg-white rounded-xl p-4">
                  <div class="grid grid-cols-3 gap-2">
                    <Button 
                      v-for="category in categoryOptions" 
                      :key="category.value" 
                      :label="category.label"
                      @click="selectCategory(category.value)"
                      :class="['text-sm !font-normal !py-2 !border-none', selectedCategory === category.value ? '!bg-smilegate-blue !text-white' : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200']"
                    />
                  </div>
                </div>
              </OverlayPanel>
            </div>
          </div>
          <div class="flex-shrink-0 flex items-center gap-4">
            <Button @click="refreshGames" class="btn-warning">
              <i class="pi pi-refresh mr-2"></i>
              Refresh
            </Button>
            <NuxtLink to="/register/new">
              <Button class="btn-warning">
                <i class="pi pi-plus mr-2"></i>
                New Game
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Game Collection Card -->
      <div class="card">
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
              class="btn-danger"
            >
              <i class="pi pi-trash mr-2"></i>
              Delete Selected ({{ selectedGames.length }})
            </Button>
          </div>
        </div>
        
        <div class="card-body p-6">
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
            :value="paginatedGames" 
            :loading="loading" 
            v-model:selection="selectedGames" 
            dataKey="id"
            class="w-full"
            :pt="{
              bodyrow: { class: 'h-16' }
            }"
          >
            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            
            <!-- Game ID Column -->
            <Column field="id" header="Game ID" :sortable="true" style="width: 15%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" bodyClass="!pl-6">
              <template #body="{ data }">
                <span class="font-mono text-sm font-semibold text-gray-700">
                  <span v-html="highlightText(data.id, searchKeyword)"></span>
                </span>
              </template>
            </Column>
            
            <!-- Category Column -->
            <Column field="category" header="Category" :sortable="true" style="width: 15%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" bodyClass="!pl-6">
              <template #body="{ data }">
                <span class="category-badge">
                  <span v-html="highlightText(data.category, searchKeyword)"></span>
                </span>
              </template>
            </Column>
            
            <!-- English Name Column -->
            <Column field="name.en" header="English Name" :sortable="true" style="width: 20%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" bodyClass="!pl-6">
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
            <Column field="name.ko" header="Korean Name" :sortable="true" style="width: 20%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" bodyClass="!pl-6">
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
            <Column field="name.ja" header="Japanese Name" :sortable="true" style="width: 20%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" bodyClass="!pl-6">
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
            <Column header="Actions" style="width: 10%" headerClass="!text-left !pl-6 bg-gray-50 !py-4" :frozen="true" alignFrozen="right">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <NuxtLink :to="`/register/${data.id}`">
                    <Button
                      icon="pi pi-pencil"
                      class="btn-secondary !p-2 !w-8 !h-8"
                      v-tooltip.top="'Edit'"
                    />
                  </NuxtLink>
                  <Button
                    @click="showSingleDeleteConfirmation(data)"
                    icon="pi pi-trash"
                    class="btn-action-delete !p-2 !w-8 !h-8"
                    v-tooltip.top="'Delete'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Custom Paginator -->
          <div v-if="totalPages > 1" class="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
            <!-- Rows Per Page Dropdown -->
            <div class="flex items-center gap-2">
              <label for="rowsPerPage" class="text-sm text-gray-600">Rows:</label>
              <div class="flex items-center gap-2">
                <Button
                  v-for="option in [10, 20, 50, 100]"
                  :key="option"
                  @click="rowsPerPage = option"
                  :label="String(option)"
                  :class="[
                    'paginator-button !min-w-10',
                    { 'paginator-button-active': rowsPerPage === option }
                  ]"
                />
              </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex items-center gap-2">
              <Button @click="goToPage(1)" :disabled="currentPage === 1" icon="pi pi-angle-double-left" class="paginator-button" />
              <Button @click="prevPage" :disabled="currentPage === 1" icon="pi pi-angle-left" class="paginator-button" />
              <div class="text-sm text-gray-600">
                Page <span class="font-semibold text-gray-800">{{ currentPage }}</span> of <span class="font-semibold text-gray-800">{{ totalPages }}</span>
              </div>
              <Button @click="nextPage" :disabled="currentPage === totalPages" icon="pi pi-angle-right" class="paginator-button" />
              <Button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" icon="pi pi-angle-double-right" class="paginator-button" />
            </div>

            <!-- Page Info -->
            <div class="text-sm text-gray-600">
              Showing <span class="font-semibold text-gray-800">{{ (currentPage - 1) * rowsPerPage + 1 }} - {{ Math.min(currentPage * rowsPerPage, filteredGames.length) }}</span> of <span class="font-semibold text-gray-800">{{ filteredGames.length }}</span> games
            </div>
          </div>
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
        <Button label="Cancel" icon="pi pi-times" @click="showBulkDeleteDialog = false" class="btn-secondary" />
        <Button 
          label="Yes, Delete All" 
          icon="pi pi-check" 
          @click="confirmBulkDelete" 
          class="btn-danger" 
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
        <Button label="Cancel" icon="pi pi-times" @click="showSingleDeleteDialog = false" class="btn-secondary" />
        <Button 
          label="Yes, Delete" 
          icon="pi pi-check" 
          @click="confirmSingleDelete" 
          class="btn-danger" 
          :loading="deleting"
        />
      </template>
    </Dialog>


  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { $toast } = useNuxtApp()
const categoryOverlay = ref()

// Reactive data
const games = ref([])
const loading = ref(true)
const searchKeyword = ref('')
const selectedCategory = ref(null)
const selectedGames = ref([])
const deleting = ref(false)

// Paginator State
const currentPage = ref(1)
const rowsPerPage = ref(10)

// Dialog states
const showBulkDeleteDialog = ref(false)
const showSingleDeleteDialog = ref(false)
const gameToDelete = ref(null)

// Computed properties
const totalPages = computed(() => Math.ceil(filteredGames.value.length / rowsPerPage.value))

const categoryOptions = ref([
  { label: 'Action', value: 'ACTION' },
  { label: 'Adventure', value: 'ADVENTURE' },
  { label: 'RPG', value: 'RPG' },
  { label: 'Strategy', value: 'STRATEGY' },
  { label: 'Sports', value: 'SPORTS' },
  { label: 'Racing', value: 'RACING' },
  { label: 'Puzzle', value: 'PUZZLE' },
  { label: 'Simulation', value: 'SIMULATION' },
  { label: 'Horror', value: 'HORROR' },
  { label: 'Comedy', value: 'COMEDY' },
  { label: 'Drama', value: 'DRAMA' },
  { label: 'Sci-Fi', value: 'SCI_FI' },
  { label: 'Fantasy', value: 'FANTASY' },
  { label: 'Fighting', value: 'FIGHTING' },
  { label: 'Platformer', value: 'PLATFORMER' },
  { label: 'Stealth', value: 'STEALTH' },
  { label: 'Survival', value: 'SURVIVAL' },
  { label: 'Music', value: 'MUSIC' }
])

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

const toggleCategoryFilter = (event) => {
  categoryOverlay.value.toggle(event)
}

const selectCategory = (categoryValue) => {
  selectedCategory.value = categoryValue
  categoryOverlay.value.hide()
}

const clearCategoryFilter = () => {
  selectedCategory.value = null
}

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredGames.value.slice(start, end);
});

// Methods
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
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
