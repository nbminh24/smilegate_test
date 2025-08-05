<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">
          Edit Game
        </h1>
        <p class="page-subtitle">
          Update game information and multilingual names
        </p>
      </div>

      <!-- Breadcrumb -->
      <div class="flex items-center justify-center text-sm text-gray-600 mb-6">
        <NuxtLink to="/" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center">
          <i class="pi pi-home mr-1" />
          Game List
        </NuxtLink>
        <i class="pi pi-chevron-right mx-2 text-xs text-gray-400" />
        <span class="text-gray-500 dark:text-gray-400">{{ gameData.id || 'Edit Game' }}</span>
      </div>

      <!-- Form Card -->
      <div class="max-w-4xl mx-auto card overflow-hidden">
        <div class="p-6 sm:p-8">
          <form class="space-y-0" @submit.prevent="updateGame">
            <!-- Basic Information Header -->
            <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <i class="pi pi-info-circle text-lg text-gray-500 dark:text-gray-400" />
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Basic Information
                </h2>
              </div>
            </div>

            <!-- Game ID & Category -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
              <div class="form-group !mb-0">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Game ID</label>
                <InputText
                  :model-value="gameData.id"
                  class="input-text"
                  readonly
                  disabled
                />
                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Game ID cannot be changed.
                </p>
              </div>

              <div class="form-group !mb-0">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Category <span class="text-red-500">*</span></label>
                <div class="relative">
                  <Button
                    :class="['input-text text-left w-full flex justify-between items-center', { '!border-red-500': validationErrors.category }]"
                    @click="toggleCategoryFilter"
                  >
                    <span :class="[gameData.category ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500']">
                      {{ selectedCategoryLabel || 'Select category' }}
                    </span>
                    <i class="pi pi-chevron-down text-gray-400" />
                  </Button>
                  <OverlayPanel ref="categoryOverlay" class="!p-0 !shadow-2xl !border-none !rounded-xl mt-2">
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-2 max-h-60 overflow-y-auto">
                      <div class="grid grid-cols-3 gap-2">
                        <Button
                          v-for="category in categoryOptions"
                          :key="category.value"
                          :label="category.label"
                          :class="['text-sm !font-normal !py-2 !border-none', gameData.category === category.value ? '!bg-smilegate-orange !text-white' : '!bg-gray-100 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-200 dark:hover:!bg-gray-600']"
                          @click="selectCategory(category.value)"
                        />
                      </div>
                    </div>
                  </OverlayPanel>
                </div>
                <small v-if="validationErrors.category" class="text-red-500 mt-1">{{ validationErrors.category }}</small>
              </div>
            </div>

            <!-- Multilingual Names Header -->
            <div class="pt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <i class="pi pi-globe text-lg text-gray-500 dark:text-gray-400" />
                  <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Game Names (Multilingual)
                  </h2>
                </div>
                <Button v-if="languagesToAdd.length > 0" label="Add Language" class="btn-add-language" @click="(e) => languageOverlay.toggle(e)" />
              </div>

              <OverlayPanel ref="languageOverlay" class="language-overlay">
                <div class="flex flex-col gap-2 p-2">
                  <Button
                    v-for="lang in languagesToAdd"
                    :key="lang.code"
                    :label="lang.name"
                    class="btn-overlay !border-0 !shadow-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700"
                    @click="addLanguage(lang)"
                  />
                </div>
              </OverlayPanel>
            </div>

            <!-- Language Name Inputs -->
            <div class="space-y-2 pt-2">
              <div v-for="lang in availableLanguages" :key="lang.code" class="relative bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <Button
                  v-if="gameData.defaultLanguage !== lang.code"
                  icon="pi pi-times"
                  class="absolute top-3 right-3 btn-icon-danger !w-6 !h-6"
                  @click="removeLanguage(lang.code)"
                />
                <div class="flex items-end gap-4">
                  <!-- Left Side: Language Name and Input (Wider) -->
                  <div class="flex-grow space-y-2">
                    <div class="flex items-center gap-3">
                      <span class="font-medium text-gray-700 dark:text-gray-200">{{ lang.name }} <span v-if="gameData.defaultLanguage === lang.code" class="text-red-500 ml-0.5">*</span></span>
                      <span v-if="gameData.defaultLanguage === lang.code" class="text-xs text-primary-600 dark:text-primary-400 font-medium">(Default)</span>
                    </div>
                    <InputText
                      v-model="gameData.name[lang.code]"
                      :placeholder="`${lang.name} game name`"
                      class="input-text w-full"
                      :class="{ 'p-invalid': validationErrors[`name_${lang.code}`] }"
                      @input="validateField(`name_${lang.code}`)"
                    />
                    <small v-if="validationErrors[`name_${lang.code}`]" class="text-xs text-red-500 mt-1 block h-4">{{ validationErrors[`name_${lang.code}`] }}</small>
                  </div>

                  <!-- Right Side: Controls (Single Row) -->
                  <div class="flex items-center gap-4 pb-5">
                    <div
                      v-if="gameData.defaultLanguage !== lang.code"
                      class="flex items-center cursor-pointer"
                      @click="gameData.defaultLanguage = lang.code"
                    >
                      <i class="pi pi-circle text-gray-400 hover:text-primary-500 transition-colors" />
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Set as Default</span>
                    </div>
                    <div v-else class="flex items-center">
                      <i class="pi pi-check-circle text-primary-500" />
                      <span class="ml-2 text-sm text-primary-600 dark:text-primary-400 font-medium">Default</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <small v-if="validationErrors.defaultLanguage" class="p-error">{{ validationErrors.defaultLanguage }}</small>

            <!-- Action Buttons -->
            <div class="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-end gap-3">
                <NuxtLink to="/">
                  <Button label="Cancel" class="btn-secondary" />
                </NuxtLink>
                <Button type="submit" label="Update Game" class="btn-warning" :loading="loading" :disabled="!isFormValid" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <Toast />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { z } from 'zod'
import { useRoute, navigateTo } from '#app'

const $toast = useToast()
const route = useRoute()

// Zod Schema for validation
const gameSchema = z.object({
  id: z.string().min(1, 'Game ID is required.'),
  category: z.string().min(1, 'Category is required.'),
  name: z.object({
    en: z.string().min(1, 'English name is required.'),
    ko: z.string().optional(),
    ja: z.string().optional()
  }),
  defaultLanguage: z.string(),
  enabled: z.boolean()
})

const loading = ref(false)
const allGames = ref([])
const gameData = ref({
  id: '',
  category: '',
  name: { en: '', ko: '', ja: '' },
  defaultLanguage: 'en',
  enabled: true
})

const validationErrors = ref({})

const allLanguages = ref([
  { name: 'English', code: 'en' },
  { name: 'Korean', code: 'ko' },
  { name: 'Japanese', code: 'ja' }
])

const availableLanguages = ref([])

const languagesToAdd = computed(() => {
  return allLanguages.value.filter(lang => !availableLanguages.value.some(al => al.code === lang.code))
})

const addLanguage = (lang) => {
  if (lang && !availableLanguages.value.some(al => al.code === lang.code)) {
    availableLanguages.value.push(lang)
    // Also add a blank name to the gameData
    if (!gameData.value.name[lang.code]) {
      gameData.value.name[lang.code] = ''
    }
    languageOverlay.value.hide()
  }
}

const categories = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Simulation', 'Horror', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Historical', 'Educational'
]

const categoryOptions = categories.map(category => ({ label: category, value: category }))

const languageOverlay = ref(null)
const categoryOverlay = ref(null)

const toggleCategoryFilter = (event) => {
  categoryOverlay.value.toggle(event)
}

const selectCategory = (categoryValue) => {
  gameData.value.category = categoryValue
  validateField('category', categoryValue)
  if (categoryOverlay.value) {
    categoryOverlay.value.hide()
  }
}

const selectedCategoryLabel = computed(() => {
  const selected = categoryOptions.find(opt => opt.value === gameData.value.category)
  return selected ? selected.label : ''
})

// Computed
const isFormValid = computed(() => {
  const defaultLang = gameData.value.defaultLanguage
  return !validationErrors.value.category &&
         !validationErrors.value[`name_${defaultLang}`] &&
         gameData.value.category &&
         gameData.value.name[defaultLang]
})

// Methods
const validateField = (field) => {
  const result = gameSchema.pick({ [field.split('_')[0]]: true }).safeParse(gameData.value)

  if (result.success) {
    delete validationErrors.value[field]
  } else {
    const error = result.error.errors.find(e => e.path.includes(field.split('_').pop()) || e.path.includes(field))
    if (error) {
      validationErrors.value[field] = error.message
    } else {
      delete validationErrors.value[field]
    }
  }

  // Handle dynamic name fields
  if (field.startsWith('name_')) {
    const langCode = field.split('_')[1]
    if (gameData.value.name[langCode]) {
      delete validationErrors.value[field]
    } else if (langCode === 'en') {
      validationErrors.value[field] = 'English name is required.'
    }
  }
}

const removeLanguage = (langCode) => {
  const index = availableLanguages.value.findIndex(lang => lang.code === langCode)
  if (index > -1) {
    availableLanguages.value.splice(index, 1)
    delete gameData.value.name[langCode]
    delete validationErrors.value[`name_${langCode}`]
    if (gameData.value.defaultLanguage === langCode) {
      gameData.value.defaultLanguage = 'en'
    }
  }
}

const fetchAllGames = async () => {
  try {
    const response = await $fetch('/api/games')
    allGames.value = response.games || []
  } catch (error) {
    // Optional: show a non-critical warning
  }
}

const fetchGame = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/games/${route.params.id}`)

    // Map backend fields to frontend field names
    gameData.value = {
      ...response,
      defaultLanguage: response.default_language, // Map default_language to defaultLanguage
      id: response.game_id // Map game_id to id
    }

    const nameKeys = Object.keys(response.name || {})
    availableLanguages.value = allLanguages.value.filter(lang => nameKeys.includes(lang.code))

    // If no languages are loaded from the server, default to showing English.
    if (availableLanguages.value.length === 0) {
      availableLanguages.value.push(allLanguages.value.find(l => l.code === 'en'))
      gameData.value.defaultLanguage = 'en'
    }
  } catch (error) {
    $toast.add({ group: 'br', severity: 'error', summary: 'Error', detail: 'Failed to load game data.', life: 2000 })
  } finally {
    loading.value = false
  }
}

const updateGame = async () => {
  try {
    // Manually validate all required fields before submitting
    validateField('category')
    validateField(`name_${gameData.value.defaultLanguage}`)

    if (!isFormValid.value) {
      $toast.add({ group: 'br', severity: 'error', summary: 'Validation Error', detail: 'Please fix the errors before submitting.', life: 2000 })
      return
    }

    loading.value = true

    // Prepare the data to send to the API
    const updateData = {
      ...gameData.value,
      default_language: gameData.value.defaultLanguage, // Map to backend field name
      game_id: gameData.value.id // Make sure game_id is included
    }

    const response = await $fetch(`/api/games/${route.params.id}`, {
      method: 'PUT',
      body: updateData
    })

    if (response) {
      $toast.add({
        group: 'br',
        severity: 'success',
        summary: 'Success',
        detail: 'Game updated successfully!',
        life: 2000
      })
      await navigateTo('/')
    }
  } catch (error) {

    $toast.add({
      group: 'br',
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to update game. Please try again.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  Promise.all([
    fetchGame(),
    fetchAllGames()
  ])
})
</script>
