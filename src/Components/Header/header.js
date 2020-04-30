import React from 'react';
import classes from './header.scss'
import logo from '../../assets/icons/logo.svg'
import { Icon } from '@webjump/colmeia'; 
const Header = () => {

  return (
    <div className={classes.root}>
      <img src={logo} alt="Logo" />
      <div className={classes.links}>
        <h2>Peças</h2><Icon icon="arrow_down" size="x-small"></Icon>
        <h1>|</h1>
        <h2>Serviços</h2><Icon icon="arrow_down" size="x-small"></Icon>
        <h1>|</h1>
        <h2>Manutenção</h2><Icon icon="arrow_down" size="x-small"></Icon>
        <h1>|</h1>
        <h2>Sistema de Trocas</h2><Icon icon="arrow_down" size="x-small"></Icon>
      </div>
      <div className={classes.icons}>
        <Icon icon="search" size="small" />
        <Icon icon="avatar" size="small" />
        <Icon icon="cart" size="small" />
      </div>
    </div>
  )
}

export default Header;

