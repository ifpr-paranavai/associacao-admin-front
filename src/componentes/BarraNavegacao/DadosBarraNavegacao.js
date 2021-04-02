import React from 'react';

import * as FaIcons from 'react-icons/fa';
import * as Bootstrap from "react-icons/bs";

const tamanho = 25;
export const DadosBarraNavegacao = [
    {
        texto: 'Página Inicial',
        rota: '/',
        icone: <FaIcons.FaHome size={ tamanho }/>,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Associados',
        rota: '/associados',
        icone: <FaIcons.FaUserAlt size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Eventos',
        rota: '/eventos',
        icone: <FaIcons.FaCalendarAlt size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Notícias',
        rota: '/noticias',
        icone: <FaIcons.FaNewspaper size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Atas',
        rota: '/atas',
        icone: <FaIcons.FaFileAlt size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Classificados',
        rota: '/classificados',
        icone: <FaIcons.FaShoppingCart size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Fotos',
        rota: '/fotos',
        icone: <Bootstrap.BsFillImageFill size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Gestão de Vídeos',
        rota: '/videos',
        icone: <Bootstrap.BsFillCameraVideoFill size={ tamanho } />,
        classe: 'nav-text'
    },
    {
        texto: 'Modificar o Site',
        rota: '/site',
        icone: <FaIcons.FaGlobe size={ tamanho } />,
        classe: 'nav-text'
    }
]
    