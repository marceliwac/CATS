import React from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './Menu.module.scss';

export default function Menu(props) {
  const { id, icon, iconPlacement, text, items } = props;
  const [anchorElement, setAnchorElement] = React.useState(null);
  const menuId = `menu-${id}`;
  const buttonId = `menu-${id}-button`;

  function handleClick(event) {
    setAnchorElement(event.target);
  }

  function handleClose() {
    setAnchorElement(null);
  }

  let component = (
    <IconButton
      id={buttonId}
      aria-controls={anchorElement ? menuId : undefined}
      aria-haspopup="true"
      aria-expanded={anchorElement ? 'true' : undefined}
      onClick={(e) => handleClick(e)}
    >
      <MoreHorizIcon />
    </IconButton>
  );

  if (text) {
    component = (
      <Button
        id={buttonId}
        aria-controls={anchorElement ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={anchorElement ? 'true' : undefined}
        onClick={(e) => handleClick(e)}
        endIcon={(iconPlacement === 'end' && icon) || undefined}
        startIcon={(iconPlacement === 'start' && icon) || undefined}
      >
        {text}
      </Button>
    );
  } else if (icon) {
    component = (
      <IconButton
        id={buttonId}
        aria-controls={anchorElement ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={anchorElement ? 'true' : undefined}
        onClick={(e) => handleClick(e)}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <div className={styles.menu}>
      {component}
      <MuiMenu
        id={menuId}
        anchorEl={anchorElement}
        open={!!anchorElement}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {items.map((item) => (
          <MenuItem
            disabled={!!item.disabled}
            key={`${item.label}`}
            onClick={() => {
              handleClose();
              item.handler();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </MuiMenu>
    </div>
  );
}
