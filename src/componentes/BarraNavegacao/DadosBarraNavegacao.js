import React from 'react';

import * as FaIcons from 'react-icons/fa';
import * as Bootstrap from 'react-icons/bs';
import { baseRoute } from '../../uteis/rota.json';

const tamanho = 25;
export default [
  {
    texto: 'Página Inicial',
    rota: `${baseRoute}/inicio`,
    key: 'inicio',
    icone: <FaIcons.FaHome size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Associados',
    rota: `${baseRoute}/associados`,
    key: 'associados',
    icone: <FaIcons.FaUserAlt size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Eventos',
    rota: `${baseRoute}/eventos`,
    key: 'eventos',
    icone: <FaIcons.FaCalendarAlt size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Notícias',
    rota: `${baseRoute}/noticias`,
    key: 'noticias',
    icone: <FaIcons.FaNewspaper size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Atas',
    rota: `${baseRoute}/atas`,
    key: 'atas',
    icone: <FaIcons.FaFileAlt size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Classificados',
    rota: `${baseRoute}/classificados`,
    key: 'classificados',
    icone: <FaIcons.FaShoppingCart size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Fotos',
    rota: `${baseRoute}/fotos`,
    key: 'fotos',
    icone: <Bootstrap.BsFillImageFill size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Gestão de Vídeos',
    rota: `${baseRoute}/videos`,
    key: 'videos',
    icone: <Bootstrap.BsFillCameraVideoFill size={tamanho} />,
    classe: 'nav-text',
  },
  {
    texto: 'Modificar o Site',
    rota: `${baseRoute}/site`,
    key: 'site',
    icone: <FaIcons.FaGlobe size={tamanho} />,
    classe: 'nav-text',
  },
];
