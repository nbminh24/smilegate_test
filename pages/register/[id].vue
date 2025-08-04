<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <main class="container mx-auto px-4 py-8">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">Edit Game</h1>
        <p class="page-subtitle">Update game information and multilingual names</p>
      </div>

      <!-- Breadcrumb -->
      <div class="flex items-center justify-center text-sm text-gray-600 mb-6">
        <NuxtLink to="/" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center">
          <i class="pi pi-home mr-1"></i>
          Game List
        </NuxtLink>
        <i class="pi pi-chevron-right mx-2 text-xs text-gray-400"></i>
        <span class="text-gray-500 dark:text-gray-400">{{ gameData.id || 'Edit Game' }}</span>
      </div>

      <!-- Form Card -->
      <div class="max-w-4xl mx-auto card overflow-hidden">
        <div class="p-6 sm:p-8">
          <form @submit.prevent="updateGame" class="space-y-0">
            <!-- Basic Information Header -->
            <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <i class="pi pi-info-circle text-lg text-gray-500 dark:text-gray-400"></i>
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Basic Information</h2>
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
                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Game ID cannot be changed.</p>
              </div>
              
              <div class="form-group !mb-0">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Category <span class="text-red-500">*</span></label>
                <div class="relative">
                  <Button 
                    @click="toggleCategoryFilter"
                    :class="['input-text text-left w-full flex justify-between items-center', { '!border-red-500': validationErrors.category }]"
                  >
                    <span :class="[gameData.category ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500']">
                      {{ selectedCategoryLabel || 'Select category' }}
                    </span>
                    <i class="pi pi-chevron-down text-gray-400"></i>
                  </Button>
                  <OverlayPanel ref="categoryOverlay" class="!p-0 !shadow-2xl !border-none !rounded-xl mt-2">
                    <div class="bg-white dark:bg-gray-800 rounded-xl p-2 max-h-60 overflow-y-auto">
                      <div class="grid grid-cols-3 gap-2">
                        <Button 
                          v-for="category in categoryOptions" 
                          :key="category.value" 
                          :label="category.label"
                          @click="selectCategory(category.value)"
                          :class="['text-sm !font-normal !py-2 !border-none', gameData.category === category.value ? '!bg-smilegate-orange !text-white' : '!bg-gray-100 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-200 dark:hover:!bg-gray-600']"
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
                  <i class="pi pi-globe text-lg text-gray-500 dark:text-gray-400"></i>
                  <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Game Names (Multilingual)</h2>
                </div>
                <Button v-if="languagesToAdd.length > 0" @click="(e) => languageOverlay.toggle(e)" label="Add Language" class="btn-add-language" />
              </div>

              <OverlayPanel ref="languageOverlay" class="language-overlay">
                <div class="flex flex-col gap-2 p-2">
                  <Button v-for="lang in languagesToAdd" :key="lang.code" @click="addLanguage(lang)" :label="lang.name" class="btn-overlay" />
                </div>
              </OverlayPanel>
            </div>

            <!-- Language Name Inputs -->
            <div class="space-y-2 pt-2">
              <div v-for="(lang, index) in availableLanguages" :key="lang.code" class="relative bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <Button 
                  v-if="gameData.defaultLanguage !== lang.code" 
                  @click="removeLanguage(lang.code)" 
                  icon="pi pi-times"
                  class="absolute top-3 right-3 btn-icon-danger !w-6 !h-6"
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
                      <RadioButton v-model="gameData.defaultLanguage" :inputId="`default_lang_${lang.code}`" name="defaultLanguage" :value="lang.code" />
                      <label :for="`default_lang_${lang.code}`" class="ml-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Set as Default</label>
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
import { useRoute, navigateTo } from '#app'
import { useToast } from 'primevue/usetoast'
import { z } from 'zod'

const $toast = useToast()
const route = useRoute()

// Zod Schema for validation
const gameSchema = z.object({
  id: z.string().min(1, 'Game ID is required.'),
  category: z.string().min(1, 'Category is required.'),
  name: z.object({
    en: z.string().min(1, 'English name is required.'),
    ko: z.string().optional(),
    ja: z.string().optional(),
  }),
  defaultLanguage: z.string(),
  enabled: z.boolean(),
})

const loading = ref(true)
const gameData = ref({ 
  id: '',
  category: '',
  name: { en: '', ko: '', ja: '' },
  defaultLanguage: 'en',
  enabled: true,
})

const validationErrors = ref({})

const allLanguages = ref([
  { name: 'English', code: 'en' },
  { name: 'Korean', code: 'ko' },
  { name: 'Japanese', code: 'ja' },
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
  return Object.keys(validationErrors.value).every(key => !validationErrors.value[key]) &&
         gameData.value.category &&
         gameData.value.name.en
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
      const langCode = field.split('_')[1];
      if (gameData.value.name[langCode]) {
          delete validationErrors.value[field];
      } else if (langCode === 'en') {
          validationErrors.value[field] = 'English name is required.';
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

const fetchGame = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/games/${route.params.id}`)
    gameData.value = { ...response }
    
    const nameKeys = Object.keys(response.name || {})
    availableLanguages.value = allLanguages.value.filter(lang => nameKeys.includes(lang.code))

    // If no languages are loaded from the server, default to showing English.
    if (availableLanguages.value.length === 0) {
      availableLanguages.value.push(allLanguages.value.find(l => l.code === 'en'))
    }

  } catch (error) {
    console.error('Error fetching game:', error)
    $toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load game data.', life: 3000 })
  } finally {
    loading.value = false
  }
}

const updateGame = async () => {
  const result = gameSchema.safeParse(gameData.value)
  if (!result.success) {
    const errors = {}
    result.error.errors.forEach(err => {
      errors[err.path[0]] = err.message
    })
    validationErrors.value = errors
    $toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fix the errors.', life: 3000 })
    return
  }

  loading.value = true
  try {
    await $fetch(`/api/games/${route.params.id}`, { method: 'PUT', body: result.data })
    $toast.add({ severity: 'success', summary: 'Success', detail: 'Game updated successfully!', life: 3000 })
    await navigateTo('/')
  } catch (error) {
    $toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update game.', life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(fetchGame)
</script>