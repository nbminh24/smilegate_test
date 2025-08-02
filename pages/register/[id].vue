<template>
  <main>
    <div class="container">
      <!-- Page Title Section -->
      <div class="page-title-section">
        <h1 class="page-title">Edit Game</h1>
        <p class="page-subtitle">Update game information and multilingual names</p>
      </div>

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">
          <i class="pi pi-home mr-1"></i>
          Game List
        </NuxtLink>
        <i class="pi pi-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-current">{{ gameData.id || 'Loading...' }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="skeleton h-32 rounded-lg"></div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!gameData.id" class="empty-state">
        <i class="pi pi-exclamation-triangle"></i>
        <h3>Game not found</h3>
        <p>The game you're looking for doesn't exist or has been deleted.</p>
        <NuxtLink to="/">
          <Button>
            <i class="pi pi-arrow-left mr-2"></i>
            Back to Game List
          </Button>
        </NuxtLink>
      </div>

      <!-- Edit Form -->
      <div v-else>
        <div class="form-card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <i class="pi pi-pencil"></i>
              <h2>Basic Information</h2>
            </div>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="updateGame" class="space-y-8">
              <!-- Game ID & Category -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="form-group">
                  <label class="form-label">
                    Game ID
                  </label>
                  <InputText 
                    v-model="gameData.id" 
                    placeholder="Enter unique game ID"
                    class="w-full"
                    required
                    readonly
                  />
                  <p class="form-hint">Game ID cannot be changed</p>
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    Category
                    <span class="text-red-500">*</span>
                  </label>
                  <Dropdown 
                    v-model="gameData.category" 
                    :options="categories" 
                    placeholder="Select category"
                    class="w-full"
                    :class="{ 'p-invalid': validationErrors.category }"
                    required
                    @change="validateField('category')"
                  />
                  <small v-if="validationErrors.category" class="p-error">{{ validationErrors.category }}</small>
                </div>
              </div>

              <!-- Multilingual Names -->
              <div class="form-group">
                <div class="flex items-center justify-between mb-4">
                  <label class="form-label">
                    Game Names (Multilingual)
                    <span class="text-red-500">*</span>
                  </label>
                  <Button 
                    type="button"
                    @click="addLanguage"
                    outlined
                    size="small"
                  >
                    <i class="pi pi-plus mr-2"></i>
                    Add Language
                  </Button>
                </div>
                
                <div class="space-y-6">
                  <div v-for="(lang, index) in availableLanguages" :key="lang.code" class="language-input-group">
                    <div class="flex items-center justify-between mb-2">
                      <label class="form-label">
                        <span class="language-flag" :class="lang.code">{{ lang.code.toUpperCase() }}</span>
                        {{ lang.name }} Name
                        <span v-if="gameData.defaultLanguage === lang.code" class="text-xs text-primary-color font-medium ml-2">
                          (Default)
                        </span>
                        <span v-if="lang.code === 'en'" class="text-red-500 ml-1">*</span>
                      </label>
                      <div class="flex items-center gap-2">
                        <Checkbox 
                          v-model="gameData.defaultLanguage" 
                          :value="lang.code"
                          :disabled="!gameData.name[lang.code]"
                          :binary="true"
                          @change="validateDefaultLanguage"
                        />
                        <span class="text-xs text-gray-500">Default</span>
                        <Button 
                          v-if="availableLanguages.length > 1 && gameData.name[lang.code]"
                          @click="removeLanguage(lang.code)"
                          icon="pi pi-times"
                          text
                          rounded
                          severity="danger"
                          size="small"
                        />
                      </div>
                    </div>
                    <div class="relative">
                      <InputText 
                        v-model="gameData.name[lang.code]" 
                        :placeholder="`${lang.name} game name`"
                        class="w-full"
                        :class="{ 'p-invalid': validationErrors[`name_${lang.code}`] }"
                        :required="lang.code === 'en'"
                        @input="validateField(`name_${lang.code}`)"
                        @blur="validateField(`name_${lang.code}`)"
                      />
                      <div v-if="gameData.name[lang.code]" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {{ gameData.name[lang.code].length }} chars
                      </div>
                    </div>
                    <small v-if="validationErrors[`name_${lang.code}`]" class="p-error">{{ validationErrors[`name_${lang.code}`] }}</small>
                    
                    <!-- Copy from default button -->
                    <div v-if="lang.code !== gameData.defaultLanguage && gameData.name[gameData.defaultLanguage]" class="mt-2">
                      <Button 
                        type="button"
                        @click="copyFromDefault(lang.code)"
                        text
                        size="small"
                        class="text-primary-color"
                      >
                        <i class="pi pi-copy mr-1"></i>
                        Copy from {{ getLanguageName(gameData.defaultLanguage) }}
                      </Button>
                    </div>
                  </div>
                </div>
                <small v-if="validationErrors.defaultLanguage" class="p-error">{{ validationErrors.defaultLanguage }}</small>
              </div>

              <!-- Action Buttons -->
              <div class="form-actions">
                <NuxtLink to="/">
                  <Button outlined>
                    <i class="pi pi-times mr-2"></i>
                    Cancel
                  </Button>
                </NuxtLink>
                <Button type="submit" :loading="saving" :disabled="!isFormValid">
                  <i class="pi pi-check mr-2"></i>
                  Update Game
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <Toast />
  </main>
</template>

<script setup>
const { $toast } = useNuxtApp()
const route = useRoute()

// Reactive data
const loading = ref(true)
const saving = ref(false)
const gameData = ref({
  id: '',
  category: '',
  name: {
    en: ''
  },
  defaultLanguage: 'en'
})

// Validation errors
const validationErrors = ref({})

// Available languages
const allLanguages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' }
]

const availableLanguages = ref([
  { code: 'en', name: 'English' }
])

// Categories
const categories = [
  'Action',
  'Adventure', 
  'RPG',
  'Strategy',
  'Sports',
  'Racing',
  'Puzzle',
  'Simulation',
  'Horror',
  'Comedy',
  'Drama',
  'Fantasy',
  'Sci-Fi',
  'Historical',
  'Educational'
]

// Computed
const isFormValid = computed(() => {
  return Object.keys(validationErrors.value).length === 0 && 
         gameData.value.category &&
         Object.values(gameData.value.name).some(name => name && name.trim())
})

// Methods
const getLanguageName = (code) => {
  return allLanguages.find(lang => lang.code === code)?.name || code
}

const validateField = (field) => {
  delete validationErrors.value[field]
  
  switch (field) {
    case 'category':
      if (!gameData.value.category) {
        validationErrors.value.category = 'Category is required'
      }
      break
      
    default:
      if (field.startsWith('name_')) {
        const langCode = field.replace('name_', '')
        if (langCode === 'en' && !gameData.value.name[langCode]?.trim()) {
          validationErrors.value[field] = 'English name is required'
        }
      }
      break
  }
  
  validateDefaultLanguage()
}

const validateDefaultLanguage = () => {
  delete validationErrors.value.defaultLanguage
  
  if (!gameData.value.defaultLanguage) {
    validationErrors.value.defaultLanguage = 'Default language must be selected'
  } else if (!gameData.value.name[gameData.value.defaultLanguage]?.trim()) {
    validationErrors.value.defaultLanguage = 'Default language must have a name'
  }
}

const copyFromDefault = (targetLang) => {
  const defaultName = gameData.value.name[gameData.value.defaultLanguage]
  if (defaultName) {
    gameData.value.name[targetLang] = defaultName
    validateField(`name_${targetLang}`)
  }
}

const addLanguage = () => {
  const unusedLanguages = allLanguages.filter(lang => 
    !availableLanguages.value.find(available => available.code === lang.code)
  )
  
  if (unusedLanguages.length > 0) {
    const newLang = unusedLanguages[0]
    availableLanguages.value.push(newLang)
    gameData.value.name[newLang.code] = ''
  }
}

const removeLanguage = (langCode) => {
  if (availableLanguages.value.length <= 1) return
  
  const index = availableLanguages.value.findIndex(lang => lang.code === langCode)
  if (index > -1) {
    availableLanguages.value.splice(index, 1)
    delete gameData.value.name[langCode]
    delete validationErrors.value[`name_${langCode}`]
    
    // If removed language was default, set first available as default
    if (gameData.value.defaultLanguage === langCode) {
      gameData.value.defaultLanguage = availableLanguages.value[0].code
      validateDefaultLanguage()
    }
  }
}

const fetchGame = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/games/${route.params.id}`)
    gameData.value = response
    
    // Set available languages based on existing data
    const existingLanguages = Object.keys(response.name || {})
    availableLanguages.value = allLanguages.filter(lang => 
      existingLanguages.includes(lang.code)
    )
  } catch (error) {
    console.error('Error fetching game:', error)
    $toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load game',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const updateGame = async () => {
  // Validate all fields
  validateField('category')
  availableLanguages.value.forEach(lang => {
    validateField(`name_${lang.code}`)
  })
  validateDefaultLanguage()
  
  if (!isFormValid.value) {
    $toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fix the errors before submitting',
      life: 3000
    })
    return
  }

  try {
    saving.value = true
    
    await $fetch(`/api/games/${route.params.id}`, {
      method: 'PUT',
      body: gameData.value
    })

    $toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Game updated successfully',
      life: 3000
    })

    // Navigate back to game list
    await navigateTo('/')
  } catch (error) {
    console.error('Error updating game:', error)
    $toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update game',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchGame()
})
</script> 