import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AvatarImagem from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';
import AvatarCrop from 'react-avatar-edit';
import Axios from 'axios';
import Config from '../../uteis/configuracao';

const Profile = props => {
  const [dialogs, setdialogs] = useState(false);
  const [imgCrop, setimgeCrop] = useState('');
  const [storeImage, setstoreImage] = useState([]);

  const onCrop = view => {
    setimgeCrop(view);
  };

  const onClose = () => {
    setimgeCrop('');
  };

  function base64ToFile(dataURI, fileName) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < byteString.length; i++) {
      view[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([buffer], { type: mimeString });
    const file = new File([blob], fileName, { type: mimeString });

    return file;
  }

  const saveImage = async () => {
    const file = base64ToFile(imgCrop, 'imagem.jpg');

    const formData = new FormData();
    formData.append('imagem', file);
    await Axios.post(`${Config.api}/associados/uploadImagem/${props.id}`, formData);
    setdialogs(false);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await Axios.get(
          `${Config.api}/associados/downloadImagem/${props.id}`,
          {
            responseType: 'arraybuffer',
          },
        );

        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        const imageUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
        setimgeCrop(imageUrl);
      } catch (error) {
        console.error('Erro ao buscar imagem:', error);
      }
    };

    fetchImage();
  }, [props.id]);

  return (
    <div>
      <div className="profile_img text-center p-4">
        <div className="div">
          <button
            type="button"
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
              background: 'none',
              cursor: 'pointer',
            }}
            onClick={() => setdialogs(true)}
          >
            <AvatarImagem
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #1976d2',
              }}
              src={imgCrop}
              alt=""
            />
          </button>

          <Dialog open={dialogs} onClose={() => setdialogs(false)}>
            <div className="confirmation-content flex flex-column align-itens-center">
              <div className="flex flex-column align-itens-center mt-5 w-12">
                <div className="flex flex-column justify-content-around w-12 mt-4">
                  <AvatarCrop
                    width={400}
                    height={200}
                    onClose={onClose}
                    onCrop={onCrop}
                  />
                  {/* Save button */}
                  <Button onClick={saveImage} variant="contained" color="primary">
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;
