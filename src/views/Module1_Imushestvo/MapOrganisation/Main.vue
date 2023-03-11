<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-full mt-5">
      <h1 class="text-md font-bold">Карта организаций/имуществ</h1>
    </div>
    <div class="col-span-12 lg:col-span-8 xl:col-span-9">
      <div id="map" style="height: 600px">
      </div>
    </div>
    <div class="col-span-12 lg:col-span-4 xl:col-span-3  mt-5">
      <!-- Выбор областей для перехода по масштабу-->
      <div>
        <h5 style="display: flex" class="font-semibold text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-map-pin" width="24" height="24"
               viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="11" r="3"/>
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
          </svg>
          Показать на карте
        </h5>
        <h5 class="mt-2">
          <select class='form-control' @change="changeRegion($event)" id='change_reg'>
            <option value='0' selected>Вся страна</option>
            <option value='1'>г.Бишкек</option>
            <option value='2'>Чуйская область</option>
            <option value='3'>Таласская область</option>
            <option value='4'>Нарынская область</option>
            <option value='5'>Ошская область</option>
            <option value='6'>Джалал–Абадская область</option>
            <option value='7'>Баткенская область</option>
            <option value='8'>Иссык-Кульская область</option>
          </select>
        </h5>
      </div>
      <!-- Кнопка перезагрузки-->
      <button @click="refreshData" class="btn btn-warning w-38 mr-2 mb-2 mt-2">
        <ActivityIcon class="w-4 h-4 mr-2"/>
        Перезагрузить карту
      </button>
      <!-- Список прививочных пунктов-->
      <div>
        <h5 style="display: flex; width: 20rem" class="font-semibold text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-list-search" width="24"
               height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round"
               stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="15" cy="15" r="4"/>
            <path d="M18.5 18.5l2.5 2.5"/>
            <path d="M4 6h16"/>
            <path d="M4 12h4"/>
            <path d="M4 18h4"/>
          </svg>
          Список прививочных пунктов
        </h5>
        <p>
          <input @keyup="searchInHospitalList" class='form-control controls' id='search_hosp'
                 placeholder='Введите название прививочного пункта'
                 type='text'/>
        </p>
        <div class="mt-3" id="list_container" style="overflow-y:scroll; max-height: 400px">
          <ul class="hosplist" id="list_of_hosp"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import {yandexMap, ymapMarker, loadYmap} from 'vue-yandex-maps'
import logo from '@/assets/images/locationLogo.svg'
import $ from "jquery";
import {OrganisationService} from "@/services";

const datas = reactive({
  options: {checkZoomRange: true},
  markerIcon: {
    layout: 'default#imageWithContent',
    imageHref: logo,
    imageSize: [35, 43],
    imageOffset: [0, 0]
  },
  settings: {
    apiKey: 'd0c85681-d309-484a-af42-e9d3278d6b45',
    lang: 'ru_RU',
    myMap: null,
    myRouter: null,
  },
  coords: [41.33252745618957, 74.09631320906709],
  orgsForMap: []
})

onMounted(async () => {
  refreshData()
})

function refreshData() {
  OrganisationService.getOrganisations().then(response => {
    datas.orgsForMap = []
    response.data.result.forEach(item => {
      datas.orgsForMap.push({
        name: item.name,
        longitude: item.longitude,
        latitude: item.latitude
      })
    })
  })
  loadYmap(datas.settings).then(response => {
    $('#map').empty()
    let myMap = new ymaps.Map('map', {
      center: [41.33252745618957, 74.09631320906709],
      zoom: 6
    }, {
      buttonMaxWidth: 300
    });
    window.map = myMap;
    setHospitalMarkers(window.map);
    setListOfHospitals(datas.orgsForMap)
  })
}

function changeRegion(event) {
  let oblastId = event.target.value
  if (oblastId === '0') {
    this.coords = []
    this.coords = [41.33252745618957, 74.09631320906709]
    window.map.setCenter(this.coords, 7, {
      checkZoomRange: true
    });
  }
  if (oblastId === '1') {
    this.coords = []
    this.coords = [42.879760, 74.616508]
    window.map.setCenter(this.coords, 12, {
      checkZoomRange: true
    });
  }
  if (oblastId === '2') {
    this.coords = []
    this.coords = [42.603206, 74.521169]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '3') {
    this.coords = []
    this.coords = [42.446444, 72.169599]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '4') {
    this.coords = []
    this.coords = [41.319955, 75.892864]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '5') {
    this.coords = []
    this.coords = [40.171055, 73.394937]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '6') {
    this.coords = []
    this.coords = [41.748378, 72.358784]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '7') {
    this.coords = []
    this.coords = [39.723640, 70.929430]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
  if (oblastId === '8') {
    this.coords = []
    this.coords = [42.135612, 77.963822]
    window.map.setCenter(this.coords, 8, {
      checkZoomRange: true
    });
  }
}

function setHospitalMarkers(map) {
  var collection = new ymaps.GeoObjectCollection(null, {
    // Запретим появление балуна.
    hasBalloon: true,
    iconColor: '#3b5998'
  });
  for (var i = 0; i < datas.orgsForMap.length; i++) {
    var org = datas.orgsForMap[i];

    var name = (org.name == null || org.name === '' ? 'Не указано' : org.name);

    var placemark = new ymaps.Placemark([org.latitude, org.longitude], {
      balloonContent: `<div class="listItem">
                                <table class="no-spacing" cellspacing="0">
                                         <tr style="border-bottom: 1px solid black">
              <td><p style="display: flex; width: 10rem">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                   <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                   <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                   <line x1="16" y1="5" x2="19" y2="8" />
                  </svg>
                  <b>Название пункта:</b></p></td>
              <td>${name}</td>
            </tr>
									</table>
                                </div>`,
      clusterCaption: '<strong>' + org.nameRu + '</strong>'
    }, {
      iconLayout: 'default#image',
      iconImageHref: logo,
      balloonOffset: [3, -40],
      hideIconOnBalloonOpen: false
    });

    collection.add(placemark);
  }

  map.geoObjects.add(collection);

  collection.events.add('click', function (e) {
    console.log(e.get('target'))
    var target = e.get('target');
  });
}

function setListOfHospitals(list1) {
  var output = '';
  for (var i = 0; i < list1.length; i++) {
    var org = list1[i];
    var lat = org.latitude;
    var lng = org.longitude;
    output += `<li class="mt-3" style="border-bottom: 1px solid #cbc9c9"><a onclick="window.map.setCenter([${lat}, ${lng}], 17, {
        checkZoomRange: true
      });" href='#'><h5 style="display: flex"><img style="width: 25px; height: auto" src="${logo}">&nbsp; ${org.name}</h5></a></li>`;
  }
  document.getElementById("list_of_hosp").innerHTML = output;
}

function searchInHospitalList() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('search_hosp');
  filter = input.value.toUpperCase();
  ul = document.getElementById("list_of_hosp");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
</script>

<style scoped>
.ymap-container {
  height: 600px;
}
</style>
