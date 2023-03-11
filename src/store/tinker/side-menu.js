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
