import React from 'react';

import * as FaIcons from 'react-icons/fa';
import * as Bootstrap from "react-icons/bs";

const tamanho = 25;
export const DadosBarraNavegacao = [
  {
    texto: 'Página Inicial',
    rota: '/',
    key: 'inicio',
    icone: <FaIcons.FaHome size={ tamanho }/>,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Associados',
    rota: '/associados',
    key: 'associados',
    icone: <FaIcons.FaUserAlt size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Eventos',
    rota: '/eventos',
    key: 'eventos',
    icone: <FaIcons.FaCalendarAlt size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Notícias',
    rota: '/noticias',
    key: 'noticias',
    icone: <FaIcons.FaNewspaper size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Atas',
    rota: '/atas',
    key: 'atas',
    icone: <FaIcons.FaFileAlt size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Classificados',
    rota: '/classificados',
    key: 'classificados',
    icone: <FaIcons.FaShoppingCart size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Fotos',
    rota: '/fotos',
    key: 'fotos',
    icone: <Bootstrap.BsFillImageFill size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Gestão de Vídeos',
    rota: '/videos',
    key: 'videos',
    icone: <Bootstrap.BsFillCameraVideoFill size={ tamanho } />,
    classe: 'nav-text'
  },
  {
    texto: 'Modificar o Site',
    rota: '/site',
    key: 'site',
    icone: <FaIcons.FaGlobe size={ tamanho } />,
    classe: 'nav-text'
  }
]
    