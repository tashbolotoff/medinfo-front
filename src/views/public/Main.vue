<template>
  <div style="position: fixed;
  left: 30%;
      right: 50%;
      z-index: 999999;
      width: 40%;
      height: 50%;
      top: 35%;" v-if="blockSettings.saveLoading">
    <div class="flex justify-center">
      <LoadingIcon style="z-index: 8888" class="w-24 h-24" icon="puff"/>
    </div>
    <div class="text-center text-xl font-medium italic text-theme-13">Сохранение....</div>
  </div>
  <!-- LOCALE-->
  <div class="grid grid-cols-12 gap-2 justify-items-center mt-3">
    <div class="col-span-12 flex flex-wrap">
      <button type="button" class="" @click="$i18n.locale = 'kg'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl"
                                                                       :class="$i18n.locale == 'kg' ? 'opacity-90' : 'opacity-20'"
                                                                       src="@/assets/flags/kg.png"></button>
      <button type="button" class="" @click="$i18n.locale = 'ru'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl"
                                                                       :class="$i18n.locale == 'ru' ? 'opacity-90' : 'opacity-20'"
                                                                       src="@/assets/flags/ru.png"></button>
      <button type="button" class="" @click="$i18n.locale = 'en'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl"
                                                                       :class="$i18n.locale == 'en' ? 'opacity-90' : 'opacity-20'"
                                                                       src="@/assets/flags/usa.png"></button>
    </div>
  </div>
  <!-- Поиск по ПИН и результат (старт)-->
  <div v-if="blockSettings.showSearchBlock && !blockSettings.finished" class="grid grid-cols-12 gap-3 mt-2 box p-5">
    <div class="col-span-12 justify-center flex font-bold text-xl">
      {{ $t('message.welcome') }}
    </div>
    <div class="col-span-12 justify-center flex font-light italic text-gray-600">
      {{ $t('message.welcomeDescr') }}
    </div>
    <!-- Поиск по ПИН-->
    <div class="col-span-12">
      <form class="grid grid-cols-12 gap-2" @submit.prevent="getAnketaByPin()">
        <div class="col-span-10">
          <div class="mt-3">
            <label for="regular-form-3" class="form-label">{{ $t('message.pin') }} <span class="text-primary-3">*</span></label>
            <input id="regular-form-3" maxlength="14"
                   v-model="data.pin" required
                   oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                   type="text" class="form-control" :placeholder="$t('message.pin')+'...'"/>
            <div class="form-help">
              {{ $t('message.pinHelp') }}
            </div>
          </div>
        </div>
        <div class="col-span-2 items-center flex mt-4">
          <button type="submit" class="btn btn-primary" :disabled="blockSettings.searchLoading">
            {{ $t('message.searchBtn') }}
            <LoadingIcon v-show="blockSettings.searchLoading" class="ml-2" color="white" icon="bars"/>
          </button>
        </div>
      </form>
    </div>
    <!-- Результат-->
    <template v-if="anketa.variant != null">
      <div class="col-span-12 justify-center flex">
        <p class="font-bold text-base">{{ $t('anketa.anketa') }}: <span class="font-normal">{{
            anketa.variant.name
          }}</span></p>
      </div>
      <div class="col-span-12 justify-center flex">
        <button class="btn btn-success" @click="startTest()">{{ $t('anketa.startTest') }}&nbsp;<PlayIcon/>
        </button>
      </div>
    </template>

  </div>
  <!-- Поиск по ПИН и результат (сама анкета)-->
  <template v-if="!blockSettings.showSearchBlock && !blockSettings.finished">
    <!-- Анкета -->
    <div v-if="anketa.variant != null" class="intro-y box py-10 sm:py-20 mt-5"
         :style="blockSettings.saveLoading ? 'pointer-events: none; filter: blur(5px);' : ''">
      <div
        class="wizard flex flex-col lg:flex-row justify-center px-5 sm:px-20"
      >
        <div
          class="intro-x lg:text-center flex items-center lg:block flex-1 z-10"
        >
          <button class="w-10 h-10 rounded-full btn btn-primary">{{ anketa.currentIndex + 1 }}</button>
          <div class="lg:w-32 font-medium text-base lg:mt-3 ml-3 lg:mx-auto">
            {{ anketa.variant.name }}
          </div>
        </div>
      </div>
      <div
        class="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200 dark:border-dark-5"
      >
        <form class="grid grid-cols-12 gap-4 gap-y-5 mt-5"
              @submit.prevent="!blockSettings.isEndAnswer && anketa.questions.length != anketa.currentIndex + 1 ? nextQuestion() : saveAnketa()">
          <div class="intro-y col-span-12 sm:col-span-6">
            <label v-if="$i18n.locale == 'ru'" class="form-label">{{
                anketa.questions[anketa.currentIndex].nameRu
              }}</label>
            <label v-if="$i18n.locale == 'en'" class="form-label">{{
                anketa.questions[anketa.currentIndex].nameEn
              }}</label>
            <label v-if="$i18n.locale == 'kg'" class="form-label">{{
                anketa.questions[anketa.currentIndex].nameKg
              }}</label>
            <!-- Checkbox -->
            <div class="flex flex-col sm:flex-row mt-2" v-if="anketa.questions[anketa.currentIndex].multiple">
              <div class="form-check mr-2" v-for="item in anketa.questions[anketa.currentIndex].answers" :key="item.id">
                <input @change="onChangeAnswer(item)" :id="'checkbox-switch-4'+item.id"
                       v-model="allAnswers[anketa.currentIndex].answertsMultiple" :name="'multi'+item.id"
                       :required="isRequired"
                       class="form-check-input" type="checkbox" :value="item.id"/>
                <label v-if="$i18n.locale == 'ru'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameRu }}</label>
                <label v-if="$i18n.locale == 'en'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameEn }}</label>
                <label v-if="$i18n.locale == 'kg'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameKg }}</label>
              </div>
            </div>

            <!-- Radio button-->
            <div class="flex flex-col sm:flex-row mt-2" v-else>
              <div class="form-check mr-2" v-for="item in anketa.questions[anketa.currentIndex].answers">
                <input @change="onChangeAnswer(item)" :id="'radio-switch-4'+item.id"
                       v-model="allAnswers[anketa.currentIndex].answersSingle"
                       required
                       :value="item.id" class="form-check-input" type="radio" name="horizontal_radio_button"/>
                <label v-if="$i18n.locale == 'ru'" class="form-check-label"
                       :for="'radio-switch-4'+item.id">{{ item.nameRu }}</label>
                <label v-if="$i18n.locale == 'kg'" class="form-check-label"
                       :for="'radio-switch-4'+item.id">{{ item.nameKg }}</label>
                <label v-if="$i18n.locale == 'en'" class="form-check-label"
                       :for="'radio-switch-4'+item.id">{{ item.nameEn }}</label>
              </div>
            </div>
          </div>
          <div class="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
            <button class="btn btn-secondary w-24" type="button" @click="prevQuestion()"
                    :disabled="anketa.currentIndex === 0">
              {{ $t('anketa.prev') }}
            </button>
            <button type="submit" class="btn btn-primary w-24 ml-2"
                    v-if="!blockSettings.isEndAnswer && anketa.questions.length != anketa.currentIndex + 1"
                    :disabled="anketa.questions.length == anketa.currentIndex + 1">{{ $t('anketa.next') }}
            </button>
            <button class="btn btn-primary w-24 ml-2" type="submit"
                    v-if="blockSettings.isEndAnswer || anketa.questions.length == anketa.currentIndex + 1">
              {{ $t('anketa.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>

  <!-- Блок для создания анкеты ВРУЧНУЮ-->
  <template v-if="blockSettings.showFieldsForCreate">
    <form class="grid grid-cols-12 gap-3 box p-5 mt-5" @submit.prevent="creationAnketaByPatient()">
      <div class="col-span-12 justify-center flex font-light text-sm">
        {{ $t('anketa.notFoundAnketa') }} *
      </div>
      <!-- Область-->
      <div class="col-span-12">
        <label>{{ $t('anketa.selectOblast') }}<span class="text-primary-3">*</span></label>
        <Select2 required :settings="select2Settings" @select="getRayonsByOblastId($event)"
                 :options="dictionaries.oblasts"/>
      </div>
      <!-- Район-->
      <div class="col-span-12">
        <label>{{ $t('anketa.selectRayon') }} <span class="text-primary-3">*</span></label>
        <Select2 required :settings="select2Settings" @select="getOzByRayonId($event)" :options="dictionaries.rayons"/>
      </div>
      <!-- ОЗ-->
      <div class="col-span-12">
        <label>{{ $t('anketa.selectOz') }}<span class="text-primary-3">*</span></label>
        <Select2 required :settings="select2Settings" @select="onChangeHospital($event)"
                 :options="dictionaries.hospitals"/>
      </div>
      <!-- Продолжить кнопка-->
      <div v-if="anketa.variant == null" class="col-span-12 justify-end flex">
        <button class="btn btn-primary" type="submit">{{ $t('anketa.continue') }}</button>
      </div>
      <!-- Результат-->
      <template v-if="anketa.variant != null">
        <div class="col-span-12 justify-center flex">
          <p class="font-bold text-base">{{ $t('anketa.anketa') }}: <span class="font-normal">{{
              anketa.variant.name
            }}</span></p>
        </div>
        <div class="col-span-12 justify-center flex">
          <button class="btn btn-success" @click="startTest()">{{ $t('anketa.startTest') }}&nbsp;<PlayIcon/>
          </button>
        </div>
      </template>
    </form>
  </template>

  <!-- Сообщение об успешном сохранении-->
  <template v-if="blockSettings.finished">
    <div class="grid grid-cols-12 gap-3 box p-5">
      <div class="col-span-12 justify-center flex">
        <CheckCircleIcon color="green" class="w-20 h-20"/>
      </div>
      <div class="col-span-12 justify-center flex">
        <p class="text-center font-bold text-xl">{{ $t('anketa.successFinished') }}</p>
      </div>
    </div>
  </template>

</template>

<script setup>
import {computed, reactive, ref} from "vue";
import {PublicService} from "@/services";
import {createToast} from "mosha-vue-toastify";
import {useI18n} from "vue-i18n";
import Select2 from "vue3-select2-component";
import {select2Settings} from "@/helpers/select2Settings";

const {t} = useI18n();

const data = reactive({
  pin: null
})
const anketa = reactive({
  id: null,
  variant: null,
  questions: [],
  currentIndex: 0
})
const blockSettings = reactive({
  searchLoading: false,
  showSearchBlock: true,
  isEndAnswer: false,
  saveLoading: false,
  finished: false,
  showFieldsForCreate: false
})
const allAnswers = ref([])
const isRequired = computed(() => allAnswers.value[anketa.currentIndex].answertsMultiple.length === 0);
const dictionaries = reactive({
  oblasts: [],
  rayons: [],
  hospitals: []
})
const datasCreateAnketa = reactive({
  ozName: null,
  ozCode: null,
  ozCodeOld: null,
  ozId: null,
  ozParentCode: null
})

function getAnketaByPin() {
  blockSettings.showFieldsForCreate = false
  anketa.variant = null
  blockSettings.searchLoading = true
  PublicService.getAnketaByPin(data.pin).then(response => {
    blockSettings.searchLoading = false
    if (response.status == 204) {
      createToast({
        title: t('anketa.notFoundAnketa'),
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
        timeout: 3000
      })
    } else {
      anketa.id = response.data.id
      anketa.variant = response.data.variant
      anketa.questions = response.data.variant.questions
    }
  }).catch(error => {
    blockSettings.showFieldsForCreate = true
    blockSettings.searchLoading = false
    getOblasts()
    createToast({
      title: t('anketa.notFoundAnketa'),
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
      timeout: 4000
    })
  })
}

function startTest() {
  blockSettings.showSearchBlock = false
  blockSettings.showFieldsForCreate = false
  allAnswers.value.push({question: anketa.questions[0].id, answersSingle: null, answertsMultiple: []})
}

function nextQuestion() {
  anketa.currentIndex++
  if (allAnswers.value[anketa.currentIndex] === undefined) {
    allAnswers.value.push({
      question: anketa.questions[anketa.currentIndex].id,
      answersSingle: null,
      answertsMultiple: []
    })
  }
}

function prevQuestion() {
  anketa.currentIndex--
}

function onChangeAnswer(item) {
  blockSettings.isEndAnswer = item.end
}

function saveAnketa() {
  let list = []
  allAnswers.value.forEach(item => {
    if (item.answersSingle != null) {
      list.push({answerId: item.answersSingle, patientVariantId: anketa.id})
    } else {
      item.answertsMultiple.forEach(it => {
        list.push({answerId: it, patientVariantId: anketa.id})
      })
    }
  })
  blockSettings.saveLoading = true
  PublicService.saveAnketaByPin(list).then(response => {
    blockSettings.saveLoading = false
    blockSettings.finished = true
    createToast({
      title: t('anketa.savedAnketa'),
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 3000
    })
  }).catch(error => {
    blockSettings.saveLoading = false
    createToast({
      title: t('anketa.notSavedAnketa'),
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 3000
    })
  })
}

//FUNCTIONS WHEN NOT FOUND ACTUAL ANKETA
function getOblasts() {
  PublicService.getOblasts().then(response => {
    dictionaries.oblasts = []
    response.data.result.forEach(item => {
      dictionaries.oblasts.push({id: item.id, text: item.nameRu})
    })
  }).catch(error => {
    console.log(error)
  })
}

function getRayonsByOblastId(event) {
  PublicService.getRayonsByOblastId(event.id).then(response => {
    if (response.data != null) {
      dictionaries.rayons = []
      response.data.forEach(item => {
        dictionaries.rayons.push({id: item.id, text: item.nameRu})
      })
    }
  }).catch(error => {
    console.log(error)
  })
}

function getOzByRayonId(event) {
  PublicService.getOzByRayonId(event.id).then(response => {
    if (response.data != null) {
      dictionaries.hospitals = []
      response.data.forEach(item => {
        dictionaries.hospitals.push(
          {
            id: item.id,
            text: item.nameRu,
            newCodeLPU: item.newCodeLPU,
            codeLPU: item.codeLPU,
            newParentCode: item.newParentCode
          }
        )
      })
    }
  }).catch(error => {
    console.log(error)
  })
}

function onChangeHospital(event) {
  datasCreateAnketa.ozId = event.id
  datasCreateAnketa.ozName = event.text
  datasCreateAnketa.ozCode = event.newCodeLPU
  datasCreateAnketa.ozCodeOld = event.codeLPU
  datasCreateAnketa.ozParentCode = event.newParentCode
}

function creationAnketaByPatient() {
  anketa.variant = null
  PublicService.creationAnketaByPatient(data.pin, datasCreateAnketa.ozName, datasCreateAnketa.ozCode, datasCreateAnketa.ozCodeOld, datasCreateAnketa.ozId, datasCreateAnketa.ozParentCode).then(response => {
    if (response.data != null) {
      anketa.id = response.data.id
      anketa.variant = response.data.variant
      anketa.questions = response.data.variant.questions
    }
  }).catch(error => {
    console.log(error)
  })
}
</script>
