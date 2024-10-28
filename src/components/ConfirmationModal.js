// ConfirmationModal.js
import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Confirm Deletion"
        >
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected users?</p>
            <button onClick={onConfirm}>Confirm Delete</button>
            <button onClick={onClose}>Cancel</button>
        </Modal>
    );
};

export default ConfirmationModal;
