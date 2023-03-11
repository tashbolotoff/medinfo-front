<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10">Специалисты</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2"
      >
        <a
          href="javascript:;"
          data-toggle="modal"
          data-target="#specialist-add-modal"
          @click="openModal(null)"
          class="btn btn-primary shadow-md mr-2"
        >
          <PlusIcon class="w-4 h-4 mr-2"/> Добавить специалиста
        </a>

        <div class="hidden md:block mx-auto text-gray-600">
        </div>
        <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
          <div class="w-56 relative text-gray-700 dark:text-gray-300">
            <input
              type="text"
              class="form-control w-56 box pr-10 placeholder-theme-13"
              placeholder="Поиск..."
            />
            <SearchIcon
              class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
            />
          </div>
        </div>
      </div>
      <div class="intro-y col-span-12">
        <!-- BEGIN: Basic Table -->
        <div class="intro-y box">
          <div id="basic-table" class="p-5">
            <div class="preview">
              <div class="overflow-y-hidden">
                <table class="table">
                  <thead>
                  <tr>
                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      Действия
                    </th>
                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      ФИО специалиста
                    </th>
                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      ПИН
                    </th>
                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      Телефон
                    </th>
                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      Организация
                    </th>
                  </tr>
                  </thead>
                  <tbody v-if="isTableLoading">
                    <tr>
                      <td colspan="5">
                        <div class="col-span-12 flex flex-col justify-end items-center">
                          <LoadingIcon class="w-20 h-20" icon="puff"/>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else-if="specialists.length === 0">
                    <tr class="bg-gray-200 dark:bg-dark-1 text-center">
                      <td class="border-b dark:border-dark-5" colspan="5">
                        Нет данных
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr class="bg-gray-200 dark:bg-dark-1" v-for="item in specialists">
                      <td class="border-b dark:border-dark-5">
                        <div class="dropdown">
                          <button
                            class="dropdown-toggle btn btn-sm btn-primary shadow-md px-2"
                            aria-expanded="false"
                          >
                            <span class="flex items-center justify-center">
                              <ChevronDownIcon class="w-4 h-4 mr-2"/> Действия
                            </span>
                          </button>
                          <div class="dropdown-menu w-52">
                            <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                              <a
                                href="javascript:;"
                                data-toggle="modal"
                                data-target="#specialist-add-modal"
                                @click="openModal(item.id)"
                                class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                              >
                                <Edit3Icon class="w-4 h-4 mr-2" /> Редактировать
                              </a>
<!--                              <a-->
<!--                                href=""-->
<!--                                class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"-->
<!--                              >-->
<!--                                <Trash2Icon class="w-4 h-4 mr-2" /> Удалить-->
<!--                              </a>-->
                              <a
                                href="javascript:;"
                                data-toggle="modal"
                                data-target="#user-schedule-modal"
                                @click="loadUserSchedule(item)"
                                class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                              >
                                <CalendarIcon class="w-4 h-4 mr-2" /> Установить график
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="border-b dark:border-dark-5">{{ item.lastName }} {{ item.firstName }} {{ item.patronymic }}</td>
                      <td class="border-b dark:border-dark-5">{{ item.pin }}</td>
                      <td class="border-b dark:border-dark-5">{{ item.phone }}</td>
                      <td class="border-b dark:border-dark-5">{{ item.orgName }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- BEGIN: Create Modal Content -->
  <div
    id="specialist-add-modal"
    class="modal"
    data-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto" v-if="isEdit"> Изменение данных специалиста </h2>
          <h2 class="font-medium text-base mr-auto" v-else> Добавление нового специалиста </h2>
        </div>
        <div class="modal-body">
          <div v-if="isModalLoading.value === true">
            <div class="col-span-12 flex flex-col justify-end items-center">
              <LoadingIcon class="w-20 h-20" icon="puff"/>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-1" v-else>
            <div class="intro-y col-span-12 lg:col-span-12">
              <!-- BEGIN: Form Layout -->
              <form class="p-5" @submit.prevent="submit">
                <div>
                  <label for="pin" class="form-label">ПИН(ИНН)<span class="text-theme-16"> *</span></label>
                  <div class="input-group mt-2">
                    <input
                      id="pin"
                      v-model.trim="v$.pin.$model"
                      :class="{ 'border-theme-21' : v$.pin.$error }"
                      @input="handlePinChange"
                      :disabled="pinLoading || isEdit"
                      type="number"
                      class="form-control"
                      placeholder="ПИН(ИНН)"
                    />
                    <div class="input-group-text" v-if="pinLoading">
                      <Spinner style="height: 20px; width: 41px;" />
                    </div>
                  </div>
                  <div v-if="v$.pin.$error">
                    <p
                      v-for="(error, index) in v$.pin.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>

                </div>
                <div class="mt-3">
                  <label for="surname" class="form-label">Фамилия<span class="text-theme-16"> *</span></label>
                  <input
                    id="surname"
                    type="text"
                    v-model.trim="v$.surname.$model"
                    :class="{ 'border-theme-21' : v$.surname.$error }"
                    disabled
                    class="form-control"
                    placeholder="Фамилия"
                  />
                  <div v-if="v$.surname.$error">
                    <p
                      v-for="(error, index) in v$.surname.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>
                <div class="mt-3">
                  <label for="name" class="form-label">Имя<span class="text-theme-16"> *</span></label>
                  <input
                    id="name"
                    v-model.trim="v$.firstName.$model"
                    :class="{ 'border-theme-21' : v$.firstName.$error }"
                    disabled
                    type="text"
                    class="form-control"
                    placeholder="Имя"
                  />
                  <div v-if="v$.firstName.$error">
                    <p
                      v-for="(error, index) in v$.firstName.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>
                <div class="mt-3">
                  <label for="patronymic" class="form-label">Отчество</label>
                  <input
                    id="patronymic"
                    v-model="newSpecialist.patronymic"
                    disabled
                    type="text"
                    class="form-control"
                    placeholder="Отчество"
                  />
                </div>

                <div class="mt-3">
                  <label for="phone" class="form-label">Номер телефона<span class="text-theme-16"> *</span></label>
                  <input
                    id="phone"
                    v-model.trim="v$.phone.$model"
                    :class="{ 'border-theme-21' : v$.phone.$error }"
                    type="text"
                    class="form-control"
                    placeholder="Номер телефона"
                  />
                  <div v-if="v$.phone.$error">
                    <p
                      v-for="(error, index) in v$.phone.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>

                <div class="mt-3">
                  <label for="organizationId" class="form-label">Организация<span class="text-theme-16"> *</span></label>
                  <select
                    id="organizationId"
                    class="form-select"
                    @change="handleOrgSelect"
                    :disabled="orgsForSelect.length === 0"
                    v-model.trim="v$.organizationId.$model"
                    :class="{ 'border-theme-21' : v$.organizationId.$error }">
                    <option class="flex-wrap" value="" disabled>Выберите организацию</option>
                    <option class="flex-wrap" v-for="item in orgsForSelect" :value="item.ozId">{{ item.ozShortName }}</option>
                  </select>
                  <div v-if="v$.organizationId.$error">
                    <p
                      v-for="(error, index) in v$.organizationId.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>

                <div class="mt-3">
                  <label for="typePersonal" class="form-label">Тип персонала</label>
                  <input
                    id="typePersonal"
                    v-model="newSpecialist.typePersonal"
                    disabled
                    type="text"
                    class="form-control"
                    placeholder="Тип персонала"
                  />
                </div>
                <div class="mt-3">
                  <label for="specialityWork" class="form-label">Специальность</label>
                  <input
                    id="specialityWork"
                    v-model="newSpecialist.specialityWork"
                    disabled
                    type="text"
                    class="form-control"
                    placeholder="Специальность"
                  />
                </div>
                <div class="mt-3">
                  <label for="doljnostId" class="form-label">Должность<span class="text-theme-16"> *</span></label>
                  <select
                    id="doljnostId"
                    class="form-select"
                    disabled
                    v-model.trim="v$.doljnostId.$model"
                    :class="{ 'border-theme-21' : v$.doljnostId.$error }">
                    <option class="flex-wrap" value="" disabled>Выберите должность</option>
                    <option class="flex-wrap" v-if="newSpecialist.doljnostId !== ''" :value="newSpecialist.doljnostId">{{ newSpecialist.doljnost }}</option>
                  </select>
                  <div v-if="v$.doljnostId.$error">
                    <p
                      v-for="(error, index) in v$.doljnostId.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>

                <div class="mt-3">
                  <div class="grid grid-cols-12 gap-1">
                    <div class="intro-y col-span-6">
                      <label for="etaj" class="form-label">Этаж<span class="text-theme-16"> *</span></label>
                      <input
                        id="etaj"
                        v-model.trim="v$.etaj.$model"
                        :class="{ 'border-theme-21' : v$.etaj.$error }"
                        type="text"
                        class="form-control"
                        placeholder="Этаж"
                      />
                      <div v-if="v$.etaj.$error">
                        <p
                          v-for="(error, index) in v$.etaj.$errors"
                          :key="index"
                          class="pt-2 pl-2 text-theme-21"
                        >
                          {{ error.$message }}
                        </p>
                      </div>
                    </div>
                    <div class="intro-y col-span-6">
                      <label for="cabinet" class="form-label">Кабинет</label>
                      <input
                        id="cabinet"
                        v-model.trim="v$.cabinet.$model"
                        :class="{ 'border-theme-21' : v$.cabinet.$error }"
                        type="text"
                        class="form-control"
                        placeholder="Кабинет"
                      />
                      <div v-if="v$.cabinet.$error">
                        <p
                          v-for="(error, index) in v$.cabinet.$errors"
                          :key="index"
                          class="pt-2 pl-2 text-theme-21"
                        >
                          {{ error.$message }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-5">
                  <div class="grid grid-cols-12 gap-1">
                    <div class="intro-y col-span-12 lg:col-span-3">
                      <div class="form-check mr-2">
                        <input
                          id="radio-switch-4"
                          class="form-check-input"
                          type="radio"
                          v-model.number="newSpecialist.typeDoctor"
                          name="horizontal_radio_button"
                          value="1" />
                        <label class="form-check-label" for="radio-switch-4">Узкий специалист</label>
                      </div>
                    </div>
                    <div class="intro-y col-span-12 lg:col-span-3">
                      <div class="form-check mr-2 mt-2 sm:mt-0">
                        <input
                          id="radio-switch-5"
                          class="form-check-input"
                          type="radio"
                          v-model.number="newSpecialist.typeDoctor"
                          name="horizontal_radio_button"
                          value="2" />
                        <label class="form-check-label" for="radio-switch-5">Семейный врач</label>
                      </div>
                    </div>
                    <div class="intro-y col-span-12 lg:col-span-3">
                      <div class="form-check mr-2 mt-2 sm:mt-0">
                        <input
                          id="radio-switch-6"
                          class="form-check-input"
                          type="radio"
                          v-model.number="newSpecialist.typeDoctor"
                          name="horizontal_radio_button"
                          value="3" />
                        <label class="form-check-label" for="radio-switch-6">Мед.сестра</label>
                      </div>
                    </div>
                    <div class="intro-y col-span-12 lg:col-span-3">
                      <div class="form-check mr-2 mt-2 sm:mt-0">
                        <input
                          id="radio-switch-7"
                          class="form-check-input"
                          type="radio"
                          v-model.number="newSpecialist.typeDoctor"
                          name="horizontal_radio_button"
                          value="4" />
                        <label class="form-check-label" for="radio-switch-7">Прочие</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <label for="identityRoleId" class="form-label">Роль<span class="text-theme-16"> *</span></label>
                  <select
                    id="identityRoleId"
                    class="form-select"
                    v-model.trim="v$.identityRoleId.$model"
                    :class="{ 'border-theme-21' : v$.identityRoleId.$error }">
                    <option class="flex-wrap" value="" disabled>Выберите роль</option>
                    <option class="flex-wrap" v-for="item in rolesForSelect" :value="item.id">{{ item.name }}</option>
                  </select>
                  <div v-if="v$.identityRoleId.$error">
                    <p
                      v-for="(error, index) in v$.identityRoleId.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label">Пароль<span class="text-theme-16"> *</span></label>
                  <div class="input-group">
                    <input :type="isShowPsw.isEmpty || isShowPsw.showPassword ? 'text' : 'password'"
                           class="form-control"
                           aria-describedby="input-group-price"
                           v-model="v$.password.$model"
                           @input="handlePasswordChange"
                           placeholder="Введите пароль"
                           :class="{ 'border-theme-21': v$.password.$error }"
                           autocomplete="off"
                    />
                    <button type="button" id="input-group-price" @click="showPsw" class="input-group-text">
                      <svg v-if="!isShowPsw" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off block mx-auto block mx-auto"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      <svg v-if="isShowPsw" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye block mx-auto block mx-auto"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                  <div v-if="v$.password.$error">
                    <p
                      v-for="(error, index) in v$.password.$errors"
                      :key="index"
                      class="pt-2 pl-2 text-theme-21"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>

                <div class="text-right mt-5">
                  <button id="close-btn-spec" type="button" @click="resetNewSpecialist" data-dismiss="modal" class="btn btn-outline-secondary w-24 mr-1">
                    Отменить
                  </button>
                  <button type="submit" class="btn btn-primary w-24">Сохранить</button>
                </div>
              </form>
              <!-- END: Form Layout -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Create Modal Content -->

  <!-- BEGIN: CreateWorkDay Modal Content -->
  <div
    id="user-schedule-modal1"
    class="modal"
    data-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Добавить рабочий день </h2>
        </div>
        <div class="modal-body">
          <div v-if="isModalLoading.value === true">
            <div class="col-span-12 flex flex-col justify-end items-center">
              <LoadingIcon class="w-20 h-20" icon="puff"/>
            </div>
          </div>
          <form class="grid grid-cols-12 gap-1" @submit.prevent="submitWorkTime" v-else>
            <div class="intro-y col-span-12 lg:col-span-12">
              <label for="dayOfWeek" class="form-label">День недели</label>
              <select
                id="dayOfWeek"
                class="form-select"
                v-model="currentSchedule.current.dayOfWeek">
                <option value="" disabled>Выберите день недели</option>
                <option value="1">Понедельник</option>
                <option value="2">Вторник</option>
                <option value="3">Среда</option>
                <option value="4">Четверг</option>
                <option value="5">Пятница</option>
                <option value="6">Суббота</option>
                <option value="0">Воскресенье</option>
              </select>
            </div>
            <div class="intro-y col-span-12 lg:col-span-6">
              <label for="startWorkTime" class="form-label">Время начала рабочего дня</label>
              <input
                class="form-control"
                id="startWorkTime"
                v-model="currentSchedule.current.startWorkTime"
                type="time">
            </div>
            <div class="intro-y col-span-12 lg:col-span-6">
              <label for="endWorkTime" class="form-label">Время конца рабочего дня</label>
              <input
                class="form-control"
                id="endWorkTime"
                v-model="currentSchedule.current.endWorkTime"
                type="time">
            </div>
            <div class="intro-y col-span-12">
              <div class="text-right mt-5">
                <button id="close-btn-work" type="button" @click="resetCurrentSchedulePart" data-dismiss="modal" class="btn btn-outline-secondary w-24 mr-1">
                  Отменить
                </button>
                <button type="submit" class="btn btn-primary w-24">Сохранить</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- END: CreateWorkDay Modal Content -->

  <!-- BEGIN: Super Large Slide Over Content -->
  <div id="user-schedule-modal" class="modal modal-slide-over" data-backdrop="static" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <a data-dismiss="modal"
           href="javascript:;"
           @click="resetCurrentSchedule">
          <XIcon class="w-8 h-8 text-gray-500" />
        </a>
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto"> Установить график </h2>
        </div>
        <div class="modal-body">
          <div v-if="isModalLoading.value === true">
            <div class="col-span-12 flex flex-col justify-end items-center">
              <LoadingIcon class="w-20 h-20" icon="puff"/>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-1" v-else>
            <div class="intro-y col-span-12 lg:col-span-12">
              <div class="text-center text-lg">
                <h1>{{ currentSchedule.lastName }} {{ currentSchedule.firstName }} {{ currentSchedule.patronymic }}</h1>
              </div>
            </div>
            <div class="intro-y col-span-12 lg:col-span-12">
              <div v-for="org in currentSchedule.userSchedule">

                <div id="basic-table" class="p-5">
                  <div class="preview">
                    <div class="overflow-y-hidden">
                      <table class="table text-center border">
                        <thead>
                        <tr class="bg-gray-200 dark:bg-dark-1">
                          <th class="border-b dark:border-dark-5" colspan="2">
                            <h2>{{ org.fullName }}</h2>
                          </th>
                          <th class="border-b dark:border-dark-5">
                            <a
                              href="javascript:;"
                              data-toggle="modal"
                              data-target="#user-schedule-modal1"
                              @click="openScheduleModal(null, org.organisationAndApplicationUserId)"
                              class="btn btn-sm btn-primary shadow-md mr-2"
                              v-if="currentSchedule.organisationAndApplicationUserId === org.organisationAndApplicationUserId"
                            >
                              <PlusIcon class="w-4 h-4 mr-2"/> Добавить
                            </a>
                          </th>
                        </tr>
                        <tr class="bg-theme-18 dark:bg-theme-18">
                          <th>День недели</th>
                          <th>Время</th>
                          <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody class="border dark:border-dark-5 whitespace-nowrap" v-if="org.userWorkTimes.length === 0">
                          <tr class="border-b dark:border-dark-5">
                            <td colspan="3">Нет данных</td>
                          </tr>
                        </tbody>
                        <tbody class="border dark:border-dark-5 whitespace-nowrap" v-else>
                        <tr class="border-b dark:border-dark-5" v-for="userWorkTime in org.userWorkTimes">
                          <td>{{getDayOfWeek(userWorkTime.dayOfWeek)}}</td>
                          <td>{{userWorkTime.startWorkTime}} - {{userWorkTime.endWorkTime}}</td>
                          <td v-if="currentSchedule.organisationAndApplicationUserId === org.organisationAndApplicationUserId">
                            <a
                              href="javascript:;"
                              data-toggle="modal"
                              data-target="#user-schedule-modal1"
                              @click="openScheduleModal(userWorkTime, null)"
                              class="text-primary-1">
                              <EditIcon class="w-4 h-4" />
                            </a>
                            <a
                              href="javascript:;"
                              data-toggle="modal"
                              data-target="#delete-work-time-modal"
                              @click="openDeleteModal(userWorkTime.id)"
                              class="text-theme-16 ml-2">
                              <Trash2Icon class="w-4 h-4" />
                            </a>
                          </td>
                          <td v-else>
                            У вас нет доступа
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-right mt-5">
                <button
                  id="close-btn"
                  type="button"
                  data-dismiss="modal"
                  @click="resetCurrentSchedule"
                  class="btn btn-outline-primary w-24 mr-1">
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Super Large Slide Over Content -->

  <!-- BEGIN: Delete modal Content -->
  <div id="delete-work-time-modal"
       class="modal"
       data-backdrop="static"
       tabindex="-1"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-21 mx-auto mt-3" />
            <div class="text-3xl mt-5">Вы уверены?</div>
            <div class="text-gray-600 mt-2">
              Вы действительно хотите удалить данную запись? <br />Удаленные записи невозможно восстановить.
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button id="close-btn-delete" type="button" @click="closeDeleteModal" data-dismiss="modal" class="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1">
              Отменить
            </button>
            <button type="button" @click="confirmDelete" class="btn btn-danger w-24">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Delete modal Content -->
</template>

<script setup>
  import Spinner from '@/app-components/UIComponents/Spinner.vue'
  import {computed, onMounted, reactive, ref, toRefs} from "vue";
  import SpecialistService from "@/services/SpecialistService";
  import store from '@/store'
  import {createToast} from "mosha-vue-toastify";
  import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
  import useVuelidate from "@vuelidate/core/dist/index.esm";
  import $ from 'jquery'
  import moment from "moment";
  import Vue3EasyDataTable from "vue3-easy-data-table";
  import 'vue3-easy-data-table/dist/style.css'

  // const headers = ref([
  //   { text: 'Действия', value: 'actions' },
  //   { text: 'ФИО специалиста', value: 'fio' },
  //   { text: 'ПИН', value: 'pin' },
  //   { text: 'Телефон', value: 'phone' },
  //   { text: 'Организация', value: 'orgName' },
  // ])
  const headers = ref([
    { text: "PLAYER", value: "player" },
    { text: "TEAM", value: "team"},
    { text: "NUMBER", value: "number"},
    { text: "POSITION", value: "position"},
    { text: "HEIGHT", value: "indicator.height"},
    { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true},
    { text: "LAST ATTENDED", value: "lastAttended", width: 200},
    { text: "COUNTRY", value: "country"},
  ]);
  const items = ref([
    { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: {"height": '6-2', "weight": 185}, lastAttended: "Davidson", country: "USA"},
    { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: {"height": '6-9', "weight": 250}, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA"},
    { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: {"height": '6-10', "weight": 240}, lastAttended: "Texas-Austin", country: "USA"},
    { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: {"height": '6-11', "weight": 242}, lastAttended: "Filathlitikos", country: "Greece"},
  ]);

  const currentUser = computed(() => store.state.auth.user)
  let isShowPsw = ref({
    isEmpty: true,
    showPassword: false
  })
  let isEdit = ref(false)
  let isTableLoading = ref(false)
  let isModalLoading = ref(false)
  let specialists = ref([])
  let newSpecialist = reactive({
    id: "",
    email: "",
    organizationId: "",
    identityRoleId: "",
    surname: "",
    firstName: "",
    patronymic: "",
    phone: "",
    pin: "",
    typeOrganisation: "",
    specialnost: "",
    doljnost: "",
    etaj: "",
    cabinet: "",
    typeDoctor: 1,
    doljnostId: "",
    specialityWork: "",
    typePersonal: "",
    password: "",
  })
  let pinLoading = ref(false)
  let orgsForSelect = ref([])
  let rolesForSelect = ref([])

  let workTimeForDeleteId = ref("")

  let currentSchedule = reactive({
    userId: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    organisationAndApplicationUserId: "",
    userSchedule: [],
    current: {
      id: "",
      startWorkTime: "",
      endWorkTime: "",
      dayOfWeek: "",
      organisationAndApplicationUserId: "",
    }
  })

  async function loadUserSchedule(user){
    SpecialistService.getUserSchedule(user.userId).then(
      (response) => {
        currentSchedule.userSchedule = response.data.result

        currentSchedule.userSchedule.forEach(item => {
          item.userWorkTimes.forEach(time => {
            time.startWorkTime = moment(time.startWorkTime).format('HH:mm')
            time.endWorkTime = moment(time.endWorkTime).format('HH:mm')
          })
        })

        currentSchedule.userId = user.userId
        currentSchedule.firstName = user.firstName
        currentSchedule.lastName = user.lastName
        currentSchedule.patronymic = user.patronymic
        currentSchedule.organisationAndApplicationUserId = user.id
      },
      (error) => {
        createToast({
          title: 'Внимание!',
          description: error,
        }, {
          type: 'warning',
          position: 'top-right',
          showIcon: true,
        })
      }
    )
  }

  function openDeleteModal(id){
    workTimeForDeleteId.value = id
  }

  function closeDeleteModal(){
    workTimeForDeleteId.value = ""
  }

  async function confirmDelete(){
    SpecialistService.deleteWorkTime(workTimeForDeleteId.value).then(
      async (response) => {
        createToast({
          title: 'Запись успешно удален!',
        }, {
          type: 'success',
          position: 'top-right',
          showIcon: true,
        })
        isModalLoading.value = false
        $('#close-btn-delete').click()
        await reloadUserSchedule(currentSchedule.userId)
      },
      (error) => {
        createToast({
          title: 'Внимание!',
          description: error,
        }, {
          type: 'warning',
          position: 'top-right',
          showIcon: true,
        })
      }
    )
  }

  async function reloadUserSchedule(userId){
    currentSchedule.userSchedule = []
    SpecialistService.getUserSchedule(userId).then(
      (response) => {
        currentSchedule.userSchedule = response.data.result

        currentSchedule.userSchedule.forEach(item => {
          item.userWorkTimes.forEach(time => {
            time.startWorkTime = moment(time.startWorkTime).format('HH:mm')
            time.endWorkTime = moment(time.endWorkTime).format('HH:mm')
          })
        })
      },
      (error) => {
        createToast({
          title: 'Внимание!',
          description: error,
        }, {
          type: 'warning',
          position: 'top-right',
          showIcon: true,
        })
      }
    )
  }

  function openScheduleModal(time, id){
    if(time !== null){
      currentSchedule.current.id = time.id
      currentSchedule.current.startWorkTime = time.startWorkTime
      currentSchedule.current.endWorkTime = time.endWorkTime
      currentSchedule.current.dayOfWeek = time.dayOfWeek
      currentSchedule.current.organisationAndApplicationUserId = time.organisationAndApplicationUserId
    } else {
      currentSchedule.current.organisationAndApplicationUserId = id
    }
  }

  function getDayOfWeek(num){
    switch (num) {
      case 0:
        return "Воскресенье"
        break
      case 1:
        return "Понедельник"
        break
      case 2:
        return "Вторник"
        break
      case 3:
        return "Среда"
        break
      case 4:
        return "Четверг"
        break
      case 5:
        return "Пятница"
        break
      case 6:
        return "Суббота"
        break
      default:
        return "Неизвестно"
    }
  }

  async function submitWorkTime() {
    isModalLoading.value = true
    if(currentSchedule.current.id === ""){
      SpecialistService.createWorkTime(currentSchedule.current).then(
        async (response) => {
          createToast({
            title: 'График успешно изменен!',
          }, {
            type: 'success',
            position: 'top-right',
            showIcon: true,
          })
          isModalLoading.value = false
          resetCurrentSchedulePart()
          $('#close-btn-work').click()
          await reloadUserSchedule(currentSchedule.userId)
        },
        (error) => {
          console.log(error)
          createToast({
            title: 'Произошла ошибка!',
          }, {
            type: 'danger',
            position: 'top-right',
            showIcon: true,
          })
          isModalLoading.value = false
        }
      )
    } else {
      SpecialistService.editWorkTime(currentSchedule.current).then(
        async (response) => {
          createToast({
            title: 'График успешно изменен!',
          }, {
            type: 'success',
            position: 'top-right',
            showIcon: true,
          })
          isModalLoading.value = false
          resetCurrentSchedulePart()
          $('#close-btn-work').click()
          await reloadUserSchedule(currentSchedule.userId)
        },
        (error) => {
          console.log(error)
          createToast({
            title: 'Произошла ошибка!',
          }, {
            type: 'danger',
            position: 'top-right',
            showIcon: true,
          })
          isModalLoading.value = false
        }
      )
    }
  }

  const rules = reactive({
    pin: {
      required: helpers.withMessage('Введите ПИН(ИНН)!', required),
      minLength: helpers.withMessage('ПИН(ИНН) должен состоять из 14 символов!', minLength(14)),
      maxLength: helpers.withMessage('ПИН(ИНН) должен состоять из 14 символов!', maxLength(14))
    },
    surname: {
      required: helpers.withMessage('Фамилия должна быть заполнена! (При правильном заполении поля ПИН(ИНН) Фамилия заполнится автоматически)', required),
    },
    firstName: {
      required: helpers.withMessage('Имя должно быть заполнено! (При правильном заполении поля ПИН(ИНН) Имя заполнится автоматически)', required),
    },
    phone: {
      required: helpers.withMessage('Номер телефона должен быть заполнен', required),
    },
    organizationId: {
      required: helpers.withMessage('Выберите организацию', required),
    },
    identityRoleId: {
      required: helpers.withMessage('Выберите роль пользователя', required),
    },
    etaj: {
      required: helpers.withMessage('Этаж должен быть заполнен', required),
    },
    cabinet: {
      required: helpers.withMessage('Номер кабинета должен быть заполнен', required),
    },
    doljnostId: {
      required: helpers.withMessage('Должность должен быть заполнен. При выборе организации поле заполнится автоматически', required),
    },
    password: {
      required: helpers.withMessage('Введите пароль!', required),
    }
  })

  const v$ = useVuelidate(rules, toRefs(newSpecialist))

  async function submit() {
    v$.value.$touch()
    if (v$.value.$invalid) {
      createToast({
        title: 'Ошибка!',
        description: 'Обязательно заполните все поля.',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    } else {
      isModalLoading.value = true
      newSpecialist.typeDoctor = parseInt(newSpecialist.typeDoctor)
      if(isEdit.value === true){
        SpecialistService.editSpecialist(newSpecialist).then(
          async (response) => {
            createToast({
              title: 'Специалист успешно изменен!',
            }, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
            })
            isModalLoading.value = false
            resetNewSpecialist()
            $('#close-btn-spec').click()
            await loadList(currentUser.value.currentOrganisation.organisationId)
          },
          (error) => {
            console.log(error)
            createToast({
              title: 'Произошла ошибка!',
            }, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            })
            isModalLoading.value = false
          }
        )
      } else {
        SpecialistService.createSpecialist(newSpecialist).then(
          async (response) => {
            createToast({
              title: 'Специалист успешно добавлен!',
            }, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
            })
            isModalLoading.value = false
            $("#close-btn-spec").click()
            resetNewSpecialist()
            await loadList(currentUser.value.currentOrganisation.organisationId)
          },
          (error) => {
            console.log(error)
            createToast({
              title: 'Произошла ошибка!',
            }, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            })
            isModalLoading.value = false
          }
        )
      }
    }
  }

  function showPsw(){
    isShowPsw.value.showPassword = !isShowPsw.value.showPassword
  }

  async function handlePasswordChange(event) {
    let password = event.target.value
    isShowPsw.value.isEmpty = password.length === 0;
  }

  async function handleOrgSelect(event){
    let orgId = event.target.value
    await getOrgById(orgId)
  }

  async function handlePinChange(event){
    let pin = event.target.value
    if(pin.length === 14){
      await getByPin(pin, null)
    } else {
      newSpecialist.surname = ''
      newSpecialist.firstName = ''
      newSpecialist.patronymic = ''
      orgsForSelect.value = []
      newSpecialist.organizationId = ''
    }
  }

  function getOrgById(orgId){
    let selected = ref(null)
    orgsForSelect.value.forEach(item => {
      if(item.ozId === parseInt(orgId))
        selected.value = item
    })

    if(selected.value !== null){
      newSpecialist.specialityWork = selected.value.specialityWork
      newSpecialist.typePersonal = selected.value.typePersonal
      newSpecialist.doljnostId = selected.value.positionId
      newSpecialist.doljnost = selected.value.positionName
    }
  }

  async function getByPin(pin, orgId){
    pinLoading.value = true
    SpecialistService.getSpecialistByPin(pin).then(
      (response) => {
        newSpecialist.pin = pin
        newSpecialist.surname = response.data.surname
        newSpecialist.firstName = response.data.name
        newSpecialist.patronymic = response.data.patronymic
        orgsForSelect.value = response.data.ozs
        pinLoading.value = false
        if(orgId !== null){
          getOrgById(orgId)
        }
      },
      (error) => {
        pinLoading.value = false
        if(error.response.status === 400){
          createToast({
            title: 'Внимание!',
            description: 'Специалист по данному ПИН не найден',
          }, {
            type: 'warning',
            position: 'top-right',
            showIcon: true,
          })
        } else {
          console.log(error)
          createToast({
            title: 'Внимание!',
            description: error.message,
          }, {
            type: 'warning',
            position: 'top-right',
            showIcon: true,
          })
        }
      }
    )
  }

  async function loadList(orgId){
    isTableLoading.value = true
    specialists.value = []
    SpecialistService.getSpecialists(orgId).then(
      (response) => {
        specialists.value = response.data
        isTableLoading.value = false
      },
      (error) => {
        createToast({
          title: 'Внимание!',
          description: error,
        }, {
          type: 'warning',
          position: 'top-right',
          showIcon: true,
        })
        isTableLoading.value = false
      }
    )
  }

  async function openModal(id) {
    isModalLoading.value = true
    if(id !== null){
      isEdit.value = true
      SpecialistService.getSpecialistById(id).then(
        (response) => {
          newSpecialist.id = response.data.id
          newSpecialist.organizationId = response.data.organizationId
          newSpecialist.identityRoleId = response.data.identityRoleId
          newSpecialist.firstName = response.data.firstName
          newSpecialist.surname = response.data.lastName
          newSpecialist.patronymic = response.data.patronymic
          newSpecialist.phone = response.data.phone
          newSpecialist.pin = response.data.pin
          newSpecialist.typeOrganisation = response.data.typeOrganisation
          newSpecialist.specialnost = response.data.specialnost
          newSpecialist.doljnost = response.data.doljnost
          newSpecialist.etaj = response.data.etaj
          newSpecialist.cabinet = response.data.cabinet
          newSpecialist.typeDoctor = response.data.typeDoctor
          newSpecialist.doljnostId = response.data.doljnostId

          getByPin(newSpecialist.pin, newSpecialist.organizationId)
          isModalLoading.value = false
        },
        (error) => {
          console.log(error)
          createToast({
            title: 'Внимание!',
            description: error,
          }, {
            type: 'warning',
            position: 'top-right',
            showIcon: true,
          })
          isModalLoading.value = false
        }
      )
    } else {
      isEdit.value = false
      isModalLoading.value = false
    }
  }

  async function loadRoles(){
    SpecialistService.getRoles().then(
      (response) => {
        rolesForSelect.value = response.data.result
      },
      (error) => {
        createToast({
          title: 'Внимание!',
          description: error,
        }, {
          type: 'warning',
          position: 'top-right',
          showIcon: true,
        })
      }
    )
  }

  function resetNewSpecialist(){
    newSpecialist.id = ""
    newSpecialist.email = ""
    newSpecialist.organizationId = ""
    newSpecialist.identityRoleId = ""
    newSpecialist.firstName = ""
    newSpecialist.surname = ""
    newSpecialist.patronymic = ""
    newSpecialist.phone = ""
    newSpecialist.pin = ""
    newSpecialist.typeOrganisation = ""
    newSpecialist.specialnost = ""
    newSpecialist.doljnost = ""
    newSpecialist.etaj = ""
    newSpecialist.cabinet = ""
    newSpecialist.typeDoctor = 1
    newSpecialist.doljnostId = ""
    newSpecialist.specialityWork = ""
    newSpecialist.typePersonal = ""
    newSpecialist.password = ""

    orgsForSelect.value = []
    isEdit.value = false
  }

  function resetCurrentSchedule(){
    currentSchedule.userId = ""
    currentSchedule.firstName = ""
    currentSchedule.lastName = ""
    currentSchedule.patronymic = ""
    currentSchedule.organisationAndApplicationUserId = ""
    currentSchedule.userSchedule = []

    currentSchedule.current.id = ""
    currentSchedule.current.startWorkTime = ""
    currentSchedule.current.endWorkTime = ""
    currentSchedule.current.dayOfWeek = ""
    currentSchedule.current.organisationAndApplicationUserId = ""
  }

  function resetCurrentSchedulePart(){
    currentSchedule.current.id = ""
    currentSchedule.current.startWorkTime = ""
    currentSchedule.current.endWorkTime = ""
    currentSchedule.current.dayOfWeek = ""
    currentSchedule.current.organisationAndApplicationUserId = ""
  }

  onMounted(() => {
    if(currentUser) {
      loadList(currentUser.value.currentOrganisation.organisationId)
      loadRoles()
    } else {
      createToast({
        title: 'Внимание!',
        description: 'Вам нужно авторизоваться в системе для продолжения работы',
      }, {
        type: 'warning',
        position: 'top-right',
        showIcon: true,
      })
    }
  })

</script>

<style scoped>

</style>
