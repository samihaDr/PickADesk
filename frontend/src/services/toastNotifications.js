import { toast } from 'react-toastify';

const toastConfig = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: 'toast-custom-width' // Appliquez vos styles personnalisés ici
};

const notify = {
    success: (message) => {
        toast.success(message, toastConfig);
    },
    error: (message) => {
        toast.error(message, toastConfig);
    },
    info: (message) => {
        toast.info(message, toastConfig);
    },
    warning: (message) => {
        toast.warning(message, toastConfig);
    }
};

export default notify;