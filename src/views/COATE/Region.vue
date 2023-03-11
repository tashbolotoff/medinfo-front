<template>
  <h2 class="intro-y text-lg font-medium mt-5">
    Организации здравоохранения
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
      <table class="table table-report" id="table_id">
        <thead>
          <tr class="whitespace-nowrap">
            <th>Название</th>
            <th>ATE код</th>
            <th>Код области</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-s whitespace-nowrap"
            v-for="region in regions"
            :key="region.id"
          >
            <td>{{ region.nameRu }}</td>
            <td>{{ region.ateCode }}</td>
            <td>{{ region.oblastCode }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RegionService } from '@/services'
import $ from 'jquery'

const regions = ref(null)

onMounted(async () => {
  regions.value = await RegionService.getRegions()
})
</script>
