import React, { useState } from "react";
import "../../../Styles/modal.css";

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <p>{content}</p>
            </div>
        </div>
    );
};

export default Modal;
