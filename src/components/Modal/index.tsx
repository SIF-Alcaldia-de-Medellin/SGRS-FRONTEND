import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import './Modal.css';

interface ModalProps {
    onClose?: () => void;
    children: React.ReactNode;
    isCloseButton?: boolean | null
}

const Modal = ({ children, onClose = ()=>{}, isCloseButton = true }: ModalProps)=>{
    const handleModalClick = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement)?.className === 'modal') {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleModalClick}>
            <div className="modal-content">
                {isCloseButton && (
                    <div className="close-button" onClick={()=>onClose()}>
                        <FontAwesomeIcon icon={faX} className="icon-close-button"/>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

export default Modal