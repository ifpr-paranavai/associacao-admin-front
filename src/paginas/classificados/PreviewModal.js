import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

const PreviewModal = ({ files, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % files.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? files.length - 1 : prevIndex - 1));
  };

  const currentFile = files[currentIndex];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
      <DialogTitle>Preview</DialogTitle>
      <DialogContent>
        {currentFile && currentFile.type === 'image' && (
          <img
            src={`data:image/jpeg;base64,${currentFile.data}`}
            alt="modal"
            className="modal-content"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )}
        {currentFile && currentFile.type === 'video' && (
          <video controls className="modal-content" style={{ maxWidth: '100%' }}>
            <source src={`data:video/mp4;base64,${currentFile.data}`} type="video/mp4" />
            Your browser does not support the video tag.
            <track kind="captions" srcLang="en" label="English captions" />
          </video>
        )}
      </DialogContent>
      <DialogActions>
        {files.length > 0 && (
          <>
            <Button onClick={handlePrev} color="primary">
              Prev
            </Button>
            <Button onClick={handleNext} color="primary">
              Next
            </Button>
          </>
        )}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewModal;
