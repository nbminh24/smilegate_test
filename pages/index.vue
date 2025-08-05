<template>
  <main>
    <div class="container">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">
          Game Management System
        </h1>
        <p class="page-subtitle">
          Manage and organize your game collection with ease
        </p>
      </div>

      <!-- Search Section Card -->
      <div class="card p-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-grow flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl border-2 border-transparent transition-all duration-300 focus-within:border-smilegate-blue focus-within:bg-white">
            <div class="relative flex-grow">
              <i class="pi pi-search absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <InputText
                v-model="searchKeyword"
                placeholder="Search games by ID, name, or category..."
                class="w-full !pl-11 bg-transparent border-none focus:ring-0 h-12 text-base"
              />
            </div>
            <div class="hidden md:block w-px self-stretch bg-gray-400 dark:bg-gray-500 mx-2" />
            <div class="relative flex-shrink-0">
              <div class="w-full bg-transparent border-none focus:ring-0 h-12 px-3 flex items-center justify-between text-base cursor-pointer" @click="toggleCategoryFilter">
                <span v-if="!selectedCategory" class="text-gray-500">Category</span>
                <div v-else class="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-md px-2 py-1 text-sm font-medium">
                  <span>{{ selectedCategory }}</span>
                  <i class="i-carbon-close text-lg text-gray-500 hover:text-gray-800 cursor-pointer" @click.stop="clearCategoryFilter" />
                </div>
                <i class="pi pi-chevron-down text-gray-400" />
              </div>
              <OverlayPanel ref="categoryOverlay" class="!p-0 !shadow-2xl !border-none !rounded-xl mt-2">
                <div class="bg-white rounded-xl p-4">
                  <div class="grid grid-cols-3 gap-2">
                    <Button
                      label="All Categories"
                      :class="['text-sm !font-normal !py-2 !border-none', !selectedCategory ? '!bg-smilegate-blue !text-white' : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200']"
                      @click="clearAndCloseCategoryFilter"
                    />
                    <Button
                      v-for="category in categoryOptions"
                      :key="category.value"
                      :label="category.label"
                      :class="['text-sm !font-normal !py-2 !border-none', selectedCategory === category.value ? '!bg-smilegate-blue !text-white' : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200']"
                      @click="selectCategory(category.value)"
                    />
                  </div>
                </div>
              </OverlayPanel>
            </div>
          </div>
          <div class="flex-shrink-0 flex items-center gap-4">
            <Button class="btn-warning" @click="refreshGames">
              <i class="pi pi-refresh mr-2" />
              Refresh
            </Button>
            <NuxtLink to="/register/new">
              <Button class="btn-warning">
                <i class="pi pi-plus mr-2" />
                New Game
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Game Collection Table -->
      <div class="mt-12 bg-white rounded-xl shadow-sm">
        <div class="card-header">
          <div class="flex items-center gap-3">
            <i class="pi pi-gamepad" />
            <h2>Game Collection</h2>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-500">
              {{ filteredGames.length }} games found
            </div>
            <Button
              v-if="selectedGames.length > 0"
              class="btn-danger"
              @click="showDeleteConfirmation"
            >
              <i class="pi pi-trash mr-2" />
              Delete Selected ({{ selectedGames.length }})
            </Button>
          </div>
        </div>

        <div class="card-body p-6">
          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="skeleton h-20 rounded-lg" />
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredGames.length === 0" class="empty-state">
            <i class="pi pi-inbox" />
            <h3>No games found</h3>
            <p>Try adjusting your search criteria or add a new game to get started.</p>
          </div>

          <!-- Data Table -->
          <DataTable
            v-else
            v-model:selection="selectedGames"
            :value="paginatedGames"
            :loading="loading"
            data-key="id"
            class="w-full"
            :pt="{
              bodyrow: { class: 'h-16' }
            }"
          >
            <!-- Selection Column -->
            <Column selection-mode="multiple" header-style="width: 3rem" />

            <!-- Game ID Column -->
            <Column field="id" :sortable="true" style="width: 15%" header-class="!text-left !pl-6 bg-gray-50 !py-4" body-class="!pl-6">
              <template #header>
                <span class="mr-2">Game ID</span>
              </template>
              <template #body="{ data }">
                <span class="font-bold text-gray-800 dark:text-gray-100">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="highlightText(data.id, searchKeyword)" />
                </span>
              </template>
            </Column>

            <!-- Category Column -->
            <Column field="category" :sortable="true" style="width: 15%" header-class="!text-left !pl-6 bg-gray-50 !py-4" body-class="!pl-6">
              <template #header>
                <span class="mr-2">Category</span>
              </template>
              <template #body="{ data }">
                <span class="category-badge">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="highlightText(data.category, searchKeyword)" />
                </span>
              </template>
            </Column>

            <!-- English Name Column -->
            <Column field="name.en" :sortable="true" style="width: 20%" header-class="!text-left !pl-6 bg-gray-50 !py-4" body-class="!pl-6">
              <template #header>
                <span class="mr-2">English Name</span>
              </template>
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag en">EN</span>
                  <span class="font-medium">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="highlightText(data.name.en || '-', searchKeyword)" />
                  </span>
                </div>
              </template>
            </Column>

            <!-- Korean Name Column -->
            <Column field="name.ko" :sortable="true" style="width: 20%" header-class="!text-left !pl-6 bg-gray-50 !py-4" body-class="!pl-6">
              <template #header>
                <span class="mr-2">Korean Name</span>
              </template>
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag ko">KO</span>
                  <span class="font-medium">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="highlightText(data.name.ko || '-', searchKeyword)" />
                  </span>
                </div>
              </template>
            </Column>

            <!-- Japanese Name Column -->
            <Column field="name.ja" :sortable="true" style="width: 20%" header-class="!text-left !pl-6 bg-gray-50 !py-4" body-class="!pl-6">
              <template #header>
                <span class="mr-2">Japanese Name</span>
              </template>
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <span class="language-flag ja">JA</span>
                  <span class="font-medium">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="highlightText(data.name.ja || '-', searchKeyword)" />
                  </span>
                </div>
              </template>
            </Column>

            <!-- Actions Column -->
            <Column header="Actions" style="width: 10%" header-class="!text-left !pl-6 bg-gray-50 !py-4" :frozen="true" align-frozen="right">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <NuxtLink :to="`/register/${data.id}`">
                    <Button
                      v-tooltip.top="'Edit'"
                      icon="pi pi-pencil"
                      class="btn-secondary !p-2 !w-8 !h-8"
                    />
                  </NuxtLink>
                  <Button
                    v-tooltip.top="'Delete'"
                    icon="pi pi-trash"
                    class="btn-action-delete !p-2 !w-8 !h-8"
                    @click="showSingleDeleteConfirmation(data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Custom Paginator -->
          <div class="flex justify-between items-center mt-6">
            <!-- Rows Per Page Dropdown -->
            <div class="flex items-center gap-2">
              <label for="rowsPerPage" class="text-sm text-gray-600">Rows:</label>
              <div class="flex items-center gap-2">
                <Button
                  v-for="option in [10, 20, 50, 100]"
                  :key="option"
                  :label="String(option)"
                  :class="[
                    'paginator-button !min-w-10',
                    { 'paginator-button-active': rowsPerPage === option }
                  ]"
                  @click="rowsPerPage = option"
                />
              </div>
            </div>

            <!-- Pagination controls -->
            <div v-if="totalPages > 1" class="flex items-center gap-2">
              <Button :disabled="currentPage === 1" icon="pi pi-angle-double-left" class="paginator-button" @click="goToPage(1)" />
              <Button :disabled="currentPage === 1" icon="pi pi-angle-left" class="paginator-button" @click="prevPage" />
              <div class="text-sm text-gray-600">
                Page <span class="font-semibold text-gray-800">{{ currentPage }}</span> of <span class="font-semibold text-gray-800">{{ totalPages }}</span>
              </div>
              <Button :disabled="currentPage === totalPages" icon="pi pi-angle-right" class="paginator-button" @click="nextPage" />
              <Button :disabled="currentPage === totalPages" icon="pi pi-angle-double-right" class="paginator-button" @click="goToPage(totalPages)" />
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
      :style="{ width: '450px' }"
      :closable="false"
      :pt="{
        root: { class: '!rounded-2xl !shadow-2xl !border-none' },
        header: { class: 'hidden' },
        content: { class: '!p-0' },
      }"
    >
      <div class="p-6 bg-white dark:bg-gray-800 rounded-2xl flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-2xl text-amber-500" />
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">
              Confirm Bulk Deletion
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete {{ selectedGames.length }} selected game(s)?
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-end">
          <Button label="Cancel" class="btn-secondary" @click="showBulkDeleteDialog = false" />
          <Button label="Yes, Delete All" icon="pi pi-trash" class="btn-danger flex items-center gap-2" :loading="deleting" @click="confirmBulkDelete" />
        </div>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="showSingleDeleteDialog"
      modal
      :style="{ width: '450px' }"
      :closable="false"
      :pt="{
        root: { class: '!rounded-2xl !shadow-2xl !border-none' },
        header: { class: 'hidden' },
        content: { class: '!p-0' },
      }"
    >
      <div v-if="gameToDelete" class="p-6 bg-white dark:bg-gray-800 rounded-2xl flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-2xl text-amber-500" />
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">
              Confirm Deletion
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong>{{ gameToDelete.name.en || gameToDelete.id }}</strong>?
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-end">
          <Button label="Cancel" class="btn-secondary" @click="showSingleDeleteDialog = false" />
          <Button label="Yes, Delete" icon="pi pi-trash" class="btn-danger flex items-center gap-2" :loading="deleting" @click="confirmSingleDelete" />
        </div>
      </div>
    </Dialog>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const categoryOverlay = ref()

// Reactive data
const toast = useToast()
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
  { label: 'Sci-Fi', value: 'Sci-Fi' },
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
    filtered = filtered.filter(game => game.category.toLowerCase() === selectedCategory.value.toLowerCase())
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
  selectedCategory.value = ''
}

const clearAndCloseCategoryFilter = () => {
  clearCategoryFilter()
  categoryOverlay.value.hide()
}

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filteredGames.value.slice(start, end)
})

// Methods
function goToPage (page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage () {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage () {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const highlightText = (text, keyword) => {
  if (!keyword || !text) { return text || '-' }

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}

const fetchGames = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/games')
    games.value = response.games || []
  } catch (error) {
    toast.add({
      group: 'br',
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load games',
      life: 2000
    })
  } finally {
    loading.value = false
  }
}

const refreshGames = () => {
  fetchGames()
  toast.add({
    group: 'br',
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
  if (selectedGames.value.length === 0) { return }

  // Determine if the page will be empty *before* deleting.
  const itemsOnCurrentPage = paginatedGames.value.length
  const deletedItemsOnCurrentPage = selectedGames.value.filter(selectedGame =>
    paginatedGames.value.some(paginatedGame => paginatedGame.id === selectedGame.id)
  ).length
  const shouldDecrementPage = (itemsOnCurrentPage === deletedItemsOnCurrentPage) && (currentPage.value > 1)

  deleting.value = true
  try {
    const gameIds = selectedGames.value.map(game => game.id)

    await Promise.all(gameIds.map(gameId =>
      $fetch('/api/games/delete', {
        method: 'POST',
        body: { id: gameId }
      })
    ))

    toast.add({
      group: 'br',
      severity: 'success',
      summary: 'Success',
      detail: `${gameIds.length} game(s) deleted successfully`,
      life: 2000
    })

    await fetchGames()
    selectedGames.value = []

    if (shouldDecrementPage) {
      currentPage.value--
    }
  } catch (error) {
    toast.add({
      group: 'br',
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete games. Please try again.',
      life: 3000
    })
  } finally {
    deleting.value = false
    showBulkDeleteDialog.value = false // Always close the dialog
  }
}

const confirmSingleDelete = async () => {
  if (!gameToDelete.value) { return }

  // Determine if this is the last item on the page *before* deleting.
  const isDeletingLastItemOnPage = paginatedGames.value.length === 1 && currentPage.value > 1

  deleting.value = true
  try {
    const deletedGameId = gameToDelete.value.id

    await $fetch('/api/games/delete', {
      method: 'POST',
      body: { id: gameToDelete.value.id }
    })

    toast.add({
      group: 'br',
      severity: 'success',
      summary: 'Success',
      detail: `Game '${deletedGameId}' deleted successfully`,
      life: 2000
    })

    await fetchGames()

    if (isDeletingLastItemOnPage) {
      currentPage.value--
    }
  } catch (error) {
    toast.add({
      group: 'br',
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete game. Please try again.',
      life: 3000
    })
  } finally {
    deleting.value = false
    gameToDelete.value = null
    showSingleDeleteDialog.value = false // Always close the dialog
  }
}

// Lifecycle
// Watch for filter changes to reset pagination
watch([searchKeyword, selectedCategory], () => {
  // Reset to the first page whenever filters change
  currentPage.value = 1
})

// Watch for rowsPerPage changes to adjust current page if needed
watch(rowsPerPage, (newRowsPerPage, oldRowsPerPage) => {
  const totalItems = filteredGames.value.length
  const maxPage = Math.ceil(totalItems / newRowsPerPage)
  
  // If current page would be empty after the change, go to the last valid page
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage || 1 // Ensure at least page 1
  }
})

onMounted(() => {
  fetchGames()
})
</script>

<style scoped>
:deep(.p-checkbox-box.p-highlight .p-checkbox-icon) {
  display: none;
}

.p-datatable .p-column-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25em 0.6em;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid currentColor;
}

.search-highlight {
  background-color: #ffecb3; /* Or any highlight color you prefer */
  font-weight: bold;
}
</style>
