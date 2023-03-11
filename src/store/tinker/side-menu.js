const state = () => {
  return {
    menu: [
      {
        icon: 'LayersIcon',
        pageName: 'side-menu-dashboard',
        title: 'Справочники',
        subMenu: [
          {
            pageName: 'OrganisationType',
            title: 'Типы организаций',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'Status',
            title: 'Статусы',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'Otrasl',
            title: 'Отрасли',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'OrgPravs',
            title: 'Организационно правовые формы',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'FormaSobst',
            title: 'Формы собственности',
            permission: ['OBLAST_READ'],
          },
          {
            pageName: 'Sostoyanies',
            title: 'Состояния',
            permission: ['OBLAST_READ'],
          }
        ]
      },
      {
        icon: 'HomeIcon',
        pageName: 'OrganisationList',
        title: 'Организации'
      },
      {
        icon: 'MapIcon',
        pageName: 'MapOrganisations',
        title: 'Карта имуществ'
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
