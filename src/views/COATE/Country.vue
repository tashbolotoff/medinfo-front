<script setup>
import { ref, onMounted } from 'vue'
import { CountryService } from '@/services'

const countries = ref(null)

onMounted(async () => {
  countries.value = await CountryService.getCountries()
})
</script>

<template>
  <h2 class="intro-y text-lg font-medium mt-5">
    Страны
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
      <table class="table table-report" id="table_id">
        <thead>
        <tr class="whitespace-nowrap">
          <th>Название</th>
          <th>Код</th>
        </tr>
        </thead>
        <tbody>
        <tr
          class="text-s whitespace-nowrap"
          v-for="country in countries"
          :key="country.id"
        >
          <td>{{ country.nameRu }}</td>
          <td>{{ country.ateCode }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
