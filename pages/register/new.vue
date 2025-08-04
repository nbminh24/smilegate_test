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
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import RadioButton from 'primevue/radiobutton'

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
  switch (field) {
    case 'id':
      if (!gameData.value.id.trim()) { validationErrors.value.id = 'Game ID is required.' } else if (!/^[A-Z0-9_.]+$/.test(gameData.value.id)) { validationErrors.value.id = 'ID must be uppercase letters, numbers, underscores, or periods.' } else { delete validationErrors.value.id }
      break
    case 'category':
      if (!gameData.value.category) { validationErrors.value.category = 'Category is required.' } else { delete validationErrors.value.category }
      break
    default:
      if (field.startsWith('name_')) {
        const langCode = field.replace('name_', '')
        // Only validate if it's the default language
        if (langCode === gameData.value.defaultLanguage && !gameData.value.name[langCode]?.trim()) {
          validationErrors.value[field] = `${allLanguages.value.find(l => l.code === langCode).name} name is required as it is the default.`
        } else {
          delete validationErrors.value[field]
        }
      }
      break
  }
}

const resetForm = () => {
  const savedCategory = gameData.value.category
  gameData.value = JSON.parse(JSON.stringify(initialGameData))
  gameData.value.category = savedCategory

  availableLanguages.value = [allLanguages.value[0]]
  validationErrors.value = {}
}

const fetchAllGames = async () => {
  try {
    const response = await $fetch('/api/games')
    allGames.value = response.games || []
  } catch (error) {
    toast.add({ group: 'br', severity: 'warn', summary: 'Warning', detail: 'Could not verify duplicate games.', life: 3000 })
  }
}

onMounted(fetchAllGames)

const createGame = async () => {
  // 1. Manually validate all required fields before submitting
  validateField('id')
  validateField('category')
  validateField(`name_${gameData.value.defaultLanguage}`)

  if (!isFormValid.value) {
    toast.add({ group: 'br', severity: 'error', summary: 'Validation Error', detail: 'Please fix the errors before submitting.', life: 3000 })
    return
  }

  loading.value = true

  // 2. Check for duplicates
  const gameId = gameData.value.id.trim()
  const defaultLang = gameData.value.defaultLanguage
  const defaultName = gameData.value.name[defaultLang]?.trim()

  const isIdDuplicate = allGames.value.some(g => g.id.toLowerCase() === gameId.toLowerCase())
  if (isIdDuplicate) {
    toast.add({ group: 'br', severity: 'error', summary: 'Duplicate Error', detail: `Game ID '${gameId}' already exists.`, life: 3000 })
    loading.value = false
    return
  }

  const isNameDuplicate = allGames.value.some(g =>
    Object.values(g.name).some(name => name && defaultName && name.toLowerCase() === defaultName.toLowerCase())
  )
  if (isNameDuplicate) {
    toast.add({ group: 'br', severity: 'error', summary: 'Duplicate Error', detail: `A game with the name '${defaultName}' already exists.`, life: 3000 })
    loading.value = false
    return
  }

  // 3. Attempt to create the game
  try {
    await $fetch('/api/games', {
      method: 'POST',
      body: gameData.value,
      // The API returns a 201 status with an empty body on success.
      // We must ignore the response body to prevent a JSON parsing error.
      ignoreResponseError: true
    })

    // Success! Show notification, refresh the game list from the server, and reset the form.
    toast.add({ group: 'br', severity: 'success', summary: 'Success', detail: 'Game created successfully!', life: 2000 })
    await fetchAllGames()
    resetForm()
  } catch (error) {
    const errorMessage = error.data?.message || 'An unexpected error occurred.'
    toast.add({ group: 'br', severity: 'error', summary: 'Error', detail: `Failed to create game: ${errorMessage}`, life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>
