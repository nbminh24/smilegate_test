<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">
          Create New Game
        </h1>
        <p class="page-subtitle">
          Add a new game to your collection with multilingual support
        </p>
      </div>

      <!-- Breadcrumb -->
      <div class="flex items-center justify-center text-sm text-gray-600 mb-6">
        <NuxtLink to="/" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center">
          <i class="pi pi-home mr-1" />
          Game List
        </NuxtLink>
        <i class="pi pi-chevron-right mx-2 text-xs text-gray-400" />
        <span class="text-gray-500 dark:text-gray-400">New Game</span>
      </div>

      <!-- Form Card -->
      <div class="max-w-4xl mx-auto card overflow-hidden">
        <div class="p-6 sm:p-8">
          <form class="space-y-0" @submit.prevent="createGame">
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
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Game ID <span class="text-red-500">*</span></label>
                <InputText
                  v-model="gameData.id"
                  placeholder="e.g., com.smilegate.outerplane"
                  class="input-text"
                  :class="{ 'p-invalid': validationErrors.id }"
                  @input="validateField('id')"
                />
                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Unique identifier (uppercase letters, numbers, underscores).
                </p>
                <small v-if="validationErrors.id" class="text-xs text-red-500 mt-1 block">{{ validationErrors.id }}</small>
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
                          :class="['btn-secondary !font-normal !py-2 !text-sm !border-none', gameData.category === category.value ? '!bg-smilegate-orange !text-white' : '!bg-gray-100 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-200 dark:hover:!bg-gray-600']"
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
                  <Button v-for="lang in languagesToAdd" :key="lang.code" :label="lang.name" class="btn-overlay !border-none" @click="addLanguage(lang)" />
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
                    <div class="flex items-center">
                      <RadioButton v-model="gameData.defaultLanguage" :input-id="`default_lang_${lang.code}`" name="defaultLanguage" :value="lang.code" />
                      <label :for="`default_lang_${lang.code}`" class="ml-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Set as Default</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <small v-if="validationErrors.defaultLanguage" class="p-error">{{ validationErrors.defaultLanguage }}</small>

            <!-- Action Buttons -->
            <div class="flex justify-end pt-8 border-t border-gray-200 dark:border-gray-700">
              <div class="flex gap-4">
                <Button type="button" label="Cancel" class="btn-secondary" @click="navigateTo('/')" />
                <Button type="submit" label="Create Game" class="btn-warning" :loading="loading" :disabled="!isFormValid" />
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
import RadioButton from 'primevue/radiobutton'
import { useFetch, navigateTo } from '#imports'

const toast = useToast()

// Reactive data
const loading = ref(false)
const allGames = ref([])
const initialGameData = {
  id: '',
  category: '',
  name: {
    en: '',
    ko: '',
    ja: ''
  },
  defaultLanguage: 'en',
  enabled: true
}

const gameData = ref(JSON.parse(JSON.stringify(initialGameData)))

const validationErrors = ref({})

const allLanguages = ref([
  { name: 'English', code: 'en' },
  { name: 'Korean', code: 'ko' },
  { name: 'Japanese', code: 'ja' }
])
const availableLanguages = ref([allLanguages.value[0]]) // Start with English

const languagesToAdd = computed(() => {
  return allLanguages.value.filter(lang => !availableLanguages.value.some(al => al.code === lang.code))
})

const languageOverlay = ref(null)
const categoryOverlay = ref(null)

const categories = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Simulation', 'Horror', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Historical', 'Educational'
]

const categoryOptions = categories.map(category => ({ label: category, value: category }))

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

const addLanguage = (lang) => {
  if (lang && !availableLanguages.value.some(al => al.code === lang.code)) {
    availableLanguages.value.push(lang)
    languageOverlay.value.hide()
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

// Computed
const isFormValid = computed(() => {
  const defaultLang = gameData.value.defaultLanguage
  return !validationErrors.value.id &&
         !validationErrors.value.category &&
         !validationErrors.value[`name_${defaultLang}`] &&
         gameData.value.id &&
         gameData.value.category &&
         gameData.value.name[defaultLang]
})

// Methods
const validateField = (field) => {
  validationErrors.value[field] = ''

  if (field === 'id') {
    if (!gameData.value.id) {
      validationErrors.value[field] = 'Game ID is required'
    } else if (!/^[a-zA-Z0-9_-]{3,50}$/.test(gameData.value.id)) {
      validationErrors.value[field] = 'Game ID must be 3-50 characters long and can only contain letters, numbers, underscores and dashes'
    }
  } else if (field.startsWith('name_')) {
    const langCode = field.replace('name_', '')
    if (langCode === gameData.value.defaultLanguage && !gameData.value.name[langCode]?.trim()) {
      validationErrors.value[field] = 'Name is required for default language'
    }
  } else if (field === 'category' && !gameData.value.category) {
    validationErrors.value[field] = 'Category is required'
  } else if (field === 'defaultLanguage' && !gameData.value.defaultLanguage) {
    validationErrors.value[field] = 'Default language is required'
  }
}

const resetForm = () => {
  gameData.value = JSON.parse(JSON.stringify(initialGameData))
  availableLanguages.value = [allLanguages.value[0]]
  validationErrors.value = {}
}

const fetchAllGames = async () => {
  try {
    const { data } = await useFetch('/api/games')
    allGames.value = data.value?.games || []
  } catch (error) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Could not verify duplicate games.',
      life: 3000
    })
  }
}

const createGame = async () => {
  // Validate all fields
  Object.keys(gameData.value).forEach((field) => {
    if (field === 'name') {
      // Validate all name fields
      Object.keys(gameData.value.name).forEach((lang) => {
        if (lang === gameData.value.defaultLanguage) {
          validateField(`name_${lang}`)
        }
      })
    } else {
      validateField(field)
    }
  })

  // Check if any validation errors exist
  const hasErrors = Object.values(validationErrors.value).some(Boolean)
  if (hasErrors) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields correctly',
      group: 'br',
      life: 2000
    })
    return
  }

  try {
    loading.value = true

    // Prepare the game data
    const gameDataToSend = {
      id: gameData.value.id,
      category: gameData.value.category,
      name: {},
      defaultLanguage: gameData.value.defaultLanguage
    }

    // Only include non-empty names
    Object.entries(gameData.value.name).forEach(([lang, name]) => {
      if (name && name.trim()) {
        gameDataToSend.name[lang] = name.trim()
      }
    })

    // Send the request
    const { error } = await useFetch('/api/games', {
      method: 'POST',
      body: gameDataToSend
    })

    if (error.value) {
      throw error.value
    }

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game created successfully',
      group: 'br',
      life: 2000
    })

    // Keep the category but reset other fields for the next entry
    const currentCategory = gameData.value.category
    resetForm()

    // Restore the category for the next entry
    if (currentCategory) {
      gameData.value.category = currentCategory
      // Also update the selected category label
      const selected = categoryOptions.find(opt => opt.value === currentCategory)
      if (selected) {
        selectedCategoryLabel.value = selected.label
      }
    }
  } catch (error) {

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to create game. Please try again.',
      group: 'br',
      life: 2000
    })
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(fetchAllGames)
</script>
