<template>
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
  <!-- Поиск по ПИН и результат-->
  <div v-if="blockSettings.showSearchBlock" class="grid grid-cols-12 gap-3 mt-2 box p-5">
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
  <!-- Поиск по ПИН и результат-->
  <template v-if="!blockSettings.showSearchBlock">
    <!-- Анкета -->
    <div v-if="anketa.variant != null" class="intro-y box py-10 sm:py-20 mt-5">
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
            <div class="flex flex-col sm:flex-row mt-2" v-if="anketa.questions[anketa.currentIndex].multiple">
              <div class="form-check mr-2" v-for="item in anketa.questions[anketa.currentIndex].answers">
                <input @change="onChangeAnswer(item)" :id="'checkbox-switch-4'+item.id"
                       v-model="allAnswers[anketa.currentIndex].answertsMultiple"
                       required
                       class="form-check-input" type="checkbox" :value="item.id"/>
                <label v-if="$i18n.locale == 'ru'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameRu }}</label>
                <label v-if="$i18n.locale == 'en'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameEn }}</label>
                <label v-if="$i18n.locale == 'kg'" class="form-check-label"
                       :for="'checkbox-switch-4'+item.id">{{ item.nameKg }}</label>
              </div>
            </div>

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

</template>

<script setup>
import {inject, reactive, ref} from "vue";
import {PublicService} from "@/services";
import {createToast} from "mosha-vue-toastify";

const i18nLocale = inject('$i18n')

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
  isEndAnswer: false
})
const allAnswers = ref([])

function getAnketaByPin() {
  console.log(i18nLocale)
  anketa.value = null
  blockSettings.searchLoading = true
  PublicService.getAnketaByPin(data.pin).then(response => {
    blockSettings.searchLoading = false
    if (response.status == 204) {
      createToast({
        title: '',
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
    blockSettings.searchLoading = false
    createToast({
      title: '',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 3000
    })
  })
}

function startTest() {
  blockSettings.showSearchBlock = false
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
  console.log("Сохранение")
}
</script>


