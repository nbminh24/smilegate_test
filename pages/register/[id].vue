<template>
  <div>
    <AppHeader 
      title="Game Registration Page"
      :features="[
        'Create a new game or edit existing game information',
        'Input basic information with multilingual support for the game name',
        'Manage language entries: add, delete, and set default language',
        'Supported languages: **English (EN), Korean (KO), Japanese (JA)**',
        'Validate the input data before submitting'
      ]"
    />
    
    <div class="container">
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-6">Game Register / Edit</h2>
        
        <!-- Basic Info Section -->
        <div class="border rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <Dropdown 
                v-model="gameData.category" 
                :options="categories" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Category"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">ID</label>
              <InputText 
                v-model="gameData.id" 
                placeholder="Enter game ID"
                :disabled="isEdit"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Multi-languages Info Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">Multi-languages Info</h3>
          
          <div class="border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium">Input by language</th>
                  <th class="px-4 py-3 text-left text-sm font-medium">Default language</th>
                  <th class="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(name, index) in gameData.name" :key="index" class="border-t">
                  <td class="px-4 py-3">
                    <span class="font-medium">{{ getLanguageLabel(name.language) }}</span>
                    <span v-if="name.language === 'EN'"> ></span>
                  </td>
                  <td class="px-4 py-3">
                    <Checkbox 
                      v-model="name.isDefault" 
                      :binary="true"
                      @change="updateDefaultLanguage(index)"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <InputText 
                      v-model="name.value" 
                      placeholder="Enter game name"
                      class="w-full"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <Button 
                      @click="removeLanguage(index)" 
                      icon="pi pi-trash" 
                      size="small"
                      severity="danger"
                      text
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <Button 
            @click="showAddLanguageDialog = true" 
            icon="pi pi-plus" 
            label="+ Add language" 
            class="mt-4"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <Button 
            @click="navigateToList" 
            label="Return To List Page" 
            class="btn-secondary"
          />
          <Button 
            @click="saveGame" 
            :label="isEdit ? 'Update' : 'Register'" 
            class="btn-primary"
            :loading="saving"
          />
        </div>
      </div>
    </div>

    <!-- Add Language Dialog -->
    <Dialog 
      v-model:visible="showAddLanguageDialog" 
      header="Add Language" 
      modal 
      class="w-96"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Language</label>
          <Dropdown 
            v-model="newLanguage.language" 
            :options="availableLanguages" 
            optionLabel="label" 
            optionValue="value"
            placeholder="Select Language"
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Input name</label>
          <InputText 
            v-model="newLanguage.value" 
            placeholder="Enter game name"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button 
          @click="addLanguage" 
          icon="pi pi-plus" 
          label="+ Add" 
          class="btn-primary"
        />
      </template>
    </Dialog>

    <ClientOnly>
      <Toast />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = process.client ? useToast() : null
const route = useRoute()

// Data
const gameData = ref({
  id: '',
  category: '',
  name: []
})

const saving = ref(false)
const showAddLanguageDialog = ref(false)
const newLanguage = ref({
  language: '',
  value: '',
  isDefault: false
})

// Computed
const isEdit = computed(() => !!route.params.id)

// Categories
const categories = [
  { label: 'Adventure', value: 'ADVENTURE' },
  { label: 'Action', value: 'ACTION' },
  { label: 'RPG', value: 'RPG' },
  { label: 'Strategy', value: 'STRATEGY' }
]

// Languages
const allLanguages = [
  { label: 'English', value: 'EN' },
  { label: 'Korean', value: 'KO' },
  { label: 'Japanese', value: 'JA' }
]

const availableLanguages = computed(() => {
  const usedLanguages = gameData.value.name.map(name => name.language)
  return allLanguages.filter(lang => !usedLanguages.includes(lang.value))
})

// Methods
const getLanguageLabel = (code: string) => {
  const lang = allLanguages.find(l => l.value === code)
  return lang ? lang.label : code
}

const updateDefaultLanguage = (selectedIndex: number) => {
  gameData.value.name.forEach((name, index) => {
    if (index !== selectedIndex) {
      name.isDefault = false
    }
  })
}

const addLanguage = () => {
  if (!newLanguage.value.language || !newLanguage.value.value) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
        life: 3000
      })
    }
    return
  }

  gameData.value.name.push({
    language: newLanguage.value.language,
    value: newLanguage.value.value,
    isDefault: newLanguage.value.isDefault
  })

  // Reset form
  newLanguage.value = { language: '', value: '', isDefault: false }
  showAddLanguageDialog.value = false

  // Update default language if needed
  if (newLanguage.value.isDefault) {
    updateDefaultLanguage(gameData.value.name.length - 1)
  }
}

const removeLanguage = (index: number) => {
  gameData.value.name.splice(index, 1)
}

const validateForm = () => {
  if (!gameData.value.id || !gameData.value.category) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
        life: 3000
      })
    }
    return false
  }

  if (gameData.value.name.length === 0) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please add at least one language',
        life: 3000
      })
    }
    return false
  }

  const hasDefault = gameData.value.name.some(name => name.isDefault)
  if (!hasDefault) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please set at least one language as default',
        life: 3000
      })
    }
    return false
  }

  return true
}

const saveGame = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/games/${route.params.id}`, {
        method: 'PUT',
        body: gameData.value
      })
      
      if (toast) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Game updated successfully',
          life: 3000
        })
      }
    } else {
      await $fetch('/api/games', {
        method: 'POST',
        body: gameData.value
      })
      
      if (toast) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Game created successfully',
          life: 3000
        })
      }
    }
    
    navigateToList()
  } catch (error) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.data || 'Failed to save game',
        life: 3000
      })
    }
  } finally {
    saving.value = false
  }
}

const navigateToList = () => {
  navigateTo('/')
}

const loadGame = async () => {
  if (!isEdit.value) return
  
  try {
    const game = await $fetch(`/api/games/${route.params.id}`)
    gameData.value = { ...game }
  } catch (error) {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load game',
        life: 3000
      })
    }
    navigateToList()
  }
}

// Initialize
onMounted(() => {
  if (isEdit.value) {
    loadGame()
  } else {
    // Add default English language for new games
    gameData.value.name = [{
      language: 'EN',
      value: '',
      isDefault: true
    }]
  }
})
</script> 