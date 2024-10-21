import React, { ReactNode } from 'react';
import './styles/GenericModalComponent.css';

interface GenericModalProps {
    title?: string;
    contentText?: string;
    cancelBtnText?: string;
    confirmBtnText?: string;
    onClose: () => void;
    isVisible?: boolean;
    onConfirm: () => void;
    customStyles?: {
        overlay?: React.CSSProperties,
        body?: React.CSSProperties,
        title?: React.CSSProperties,
        closeButton?: React.CSSProperties,
        content?: React.CSSProperties,
        cancelButton?: React.CSSProperties,
        confirmButton?: React.CSSProperties
    };
    children?: ReactNode | ReactNode[]
}

/**
 * Component that renders a generic modal with customizable text for title, content and action buttons.
 * Used to either display important information or prompt user for confirmation.
 * If text for confirmation button is not defined, only cancel button will be displayed (and centered).
 *
 * @returns HTML Element
 */
const GenericModalComponent: React.FC<GenericModalProps> = ({
    // Destructuring of props and initialization of default values
    title = "Default Title",
    contentText = "Default content text",
    confirmBtnText = "",          // If empty, no confirmation button will be displayed
    cancelBtnText = "Cancelar",   // Renameable to e.g. "Fechar" (close) when invoking the component
    onClose,
    isVisible = false,
    onConfirm,
    children
}) => {

    if (!isVisible)
        return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                {/* Title */}
                <div className="modal-title">
                    <h2>{title}</h2>

                    {/* Window close button (X) */}
                    <button onClick={onClose} className="close-button">
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    <p>{contentText}</p>
                    {children}
                </div>

                {/* Action buttons */}
                {/* Only the cancel button is rendered (and centered), if text for confirmation button isn't defined */}
                <div className={`action-buttons ${confirmBtnText === "" ? "justify-center" : "justify-between"}`}>

                    {/* Cancel */}
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                    >
                        {cancelBtnText}
                    </button>

                    {/* Confirmation */}
                    {/* Button not rendered if confirmBtnText is not defined when component is invoked */}
                    {(confirmBtnText !== "") && (
                        <button
                            type="submit"
                            className="confirm-button"
                            onClick={onConfirm}
                        >
                            {confirmBtnText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenericModalComponent;