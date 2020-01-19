export default {
  items: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: 'icon-list',
      
    },
    {
      title: true,
      name: 'Components',
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
