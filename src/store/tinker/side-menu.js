const state = () => {
  return {
    menu: [
      {
        icon: 'LayersIcon',
        pageName: 'side-menu-dashboard',
        title: 'Справочники',
        subMenu: [
          {
            pageName: 'FormaSobst',
            title: 'Формы собственности',
            permission: ['OBLAST_READ'],
          }
        ]
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
          },
          {
            pageName: 'Users',
            title: 'Пользователи',
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
