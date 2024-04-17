import { Alert, Button, Modal } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DraftEditor = ({ comment, location, setComment, postId, draftKye }) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem(`${draftKye}_${postId}`));

    if (draftData) {
      setComment(draftData.value);
    }
  }, [postId, location]);
  // Warn user before leaving the page with unsaved changes

  return (
    <>
      <Modal show={openModal}>
        <Modal.Body>
          <p>
            The changes are unsaved & we have stored it for now , you can view
            it whenever you visit the website
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DraftEditor;
