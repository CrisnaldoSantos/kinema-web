export default {
  items: [
    {
      title: true,
      name: 'Menu',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    
    {
      name: 'Filmes desejados',
      url: '/pages',
      icon: 'icon-layers',
      children: [
        {
          name: 'Cadastrar novo',
          url: '/filmesdesejados/form',
          icon: 'cui-task',
        },
        {
          name: 'Listar',
          url: '/filmesdesejados/list',
          icon: 'icon-list',
        },
      ],
    },
    {
      name: 'Filmes Assistidos',
      url: '/filmesassistidos/list',
      icon: 'icon-layers',
    },
  ],
};
