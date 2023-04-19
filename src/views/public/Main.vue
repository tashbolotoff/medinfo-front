<template>
  <div class="grid grid-cols-12 gap-2 justify-items-center mt-3">
    <div class="col-span-12 flex flex-wrap">
       <button type="button" class="" @click="$i18n.locale = 'kg'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl" :class="$i18n.locale == 'kg' ? 'opacity-90' : 'opacity-20'" src="@/assets/flags/kg.png"></button>
       <button type="button" class="" @click="$i18n.locale = 'ru'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl" :class="$i18n.locale == 'ru' ? 'opacity-90' : 'opacity-20'" src="@/assets/flags/ru.png"></button>
       <button type="button" class="" @click="$i18n.locale = 'en'"><img class="w-16 h-10 mr-2 mb-2 rounded-xl shadow-xl" :class="$i18n.locale == 'en' ? 'opacity-90' : 'opacity-20'" src="@/assets/flags/usa.png"></button>
    </div>

  </div>
</template>

<script setup>


</script>


