import React from 'react';

import { Box, Button } from '@material-ui/core';
import { Photo as ImageIcon, Close as CloseIcon } from '@material-ui/icons';
import { useStyles } from './estilo';

import { toBase64 } from '../../uteis/file';

const ImageUploader = (props) => {
  const classes = useStyles();

  async function handleImageUpload({ target }) {
    const file = target.files[0];
    const src = await toBase64(file);
    const [alt] = file.name.split('.');
    
    props.onUpload({ src, alt });
  }

  const renderIcon = () => {
    return (
      <ImageIcon className={classes.imageSize} />
    );
  };

  const renderImage = () => {
    return (
      <img
        src={props.image.src}
        alt={props.image.alt}
        className={classes.imageSize}
      />
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      className={props.className}
    >
      <input
        id="raised-button-file"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <div style={{ position: 'relative' }}>
        <label htmlFor="raised-button-file">
          <Button
            variant="outlined"
            color="primary"
            component="span"
            className={classes.imageSize}
          >
            {props.image?.src ? renderImage() : renderIcon()}
          </Button>
        </label>
        {props.image?.src &&
          <CloseIcon
            className={classes.removeButton}
            onClick={() => props.onUpload({ src: '', alt: '' })}
          />
        }
      </div>
    </Box>
  );
}

export default ImageUploader;
