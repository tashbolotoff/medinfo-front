const state = () => {
  return {
    menu: [
      {
        icon: 'GlobeIcon',
        pageName: 'side-menu-dashboard',
        title: 'COATE',
        subMenu: [
          {
            pageName: 'Region',
            title: 'Области',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'Area',
            title: 'Районы',
            permission: ['RAYON_READ'],
          }
        ]
      },
      {
        icon: 'DatabaseIcon',
        pageName: 'side-menu-dashboard',
        title: 'Справочники',
      },
      {
        icon: 'SettingsIcon',
        pageName: 'side-menu-dashboard',
        title: 'Администрирование',
        subMenu: [
          {
            pageName: 'AccessControl',
            title: 'Контроль доступов',
            permission: ['SUPER_ADMIN']
          },
          {
            pageName: 'UserRole',
            title: 'Роли',
            permission: ['SUPER_ADMIN']
          }
        ]
      }
    ]
  }
}

// getters
const getters = {
  menu: state => state.menu
}

// actions
const actions = {}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
