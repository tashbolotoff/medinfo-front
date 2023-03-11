<script setup>
import {ref, onMounted, reactive} from 'vue'
import { AreaService } from '@/services'
import $api from "@/http";

const areas = ref(null)

const genResult = reactive({
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})

async function getRayonByParams(page) {
  try {
    await (async () => {
      await $api.get('/Rayons/',
        {
          params: {
            page: page,
            size: 10
          }
        }
      ).then(response => {
        genResult.result = response.data.result
        genResult.currentPage = response.data.currentPage
        genResult.pageSize = response.data.pageSize
        genResult.totalPages = response.data.totalPages
        genResult.totalItems = response.data.totalItems
        genResult.pagenumbersStart = genResult.currentPage - 1 > 1 ? genResult.currentPage - 1 : 1
        genResult.pagenumbersEnd = genResult.currentPage + 5 < genResult.totalPages ? genResult.currentPage + 5 : genResult.totalPages
        return genResult
      })
    })()
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  areas.value = await AreaService.getAreas()
  await getRayonByParams(1)
})

</script>

<template>
  <h2 class="intro-y text-lg font-medium mt-5">
    Районы
  </h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
      <table class="table table-report" id="table_id">
        <thead>
        <tr class="whitespace-nowrap">
          <th>Название</th>
          <th>ATE код</th>
          <th>Код района</th>
          <th>Область</th>
        </tr>
        </thead>
        <tbody>
        <tr
          class="text-s whitespace-nowrap"
          v-for="area in genResult.result"
          :key="area.id"
        >
          <td>{{ area.nameRu }}</td>
          <td>{{ area.ateCode }}</td>
          <td>{{ area.rayonCode }}</td>
          <td>{{ area.oblast?.nameRu }}</td>
        </tr>
        </tbody>
      </table>

      <!-- BEGIN: Pagination -->
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-5"
      >
        <ul class="pagination bg-gray-600 rounded-full">
          <li v-if="5 < genResult.currentPage">
            <a class="pagination__link " @click="getRayonByParams(1)">
              <ChevronsLeftIcon class="w-4 h-4 text-white"/>
            </a>
          </li>
          <li v-if="genResult.currentPage > 1">
            <a class="pagination__link"
               @click="getRayonByParams(genResult.currentPage - 1)">
              <ChevronLeftIcon class="w-4 h-4 text-white"/>
            </a>
          </li>
          <template v-for="page in genResult.pagenumbersEnd" v-bind:key='page'>
            <li v-if="genResult.pagenumbersStart <= page || page >= genResult.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === genResult.currentPage}"
                 @click="getRayonByParams(page)">
                <p class="text-white" v-bind:class="{ 'text-black' : page === genResult.currentPage}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="genResult.currentPage !== genResult.totalPages">
            <a class="pagination__link "
               @click="getRayonByParams(genResult.currentPage + 1)">
              <ChevronRightIcon class="w-4 h-4 text-white"/>
            </a>
          </li>
          <li v-if="genResult.currentPage < genResult.totalPages - 5">
            <a class="pagination__link"
               @click="getRayonByParams(genResult.totalPages)">
              <ChevronsRightIcon class="w-4 h-4 text-white"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
