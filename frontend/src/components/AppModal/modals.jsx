import { Modal } from 'antd';

const UnsavedChangesModal = (onOk) => {
  return Modal.confirm({
    title: 'Unsaved changes',
    content: 'Are you sure you want to leave this page? Your changes will be lost.',
    okText: 'Leave',
    cancelText: 'Stay',
    onOk: onOk,
  });
};

const ErrorResponseModal = (options = {}) => {
  return Modal.error({
    ...options,
    title: options.title || 'Error',
    content: options.message || 'An error occurred. Please try again later.',
  });
};

const SuccessResponseModal = (options = {}) => {
  return Modal.success({
    ...options,
    title: options.title || 'Success',
    content: options.message || 'Operation completed successfully.',
  });
};

export {
  UnsavedChangesModal,
  ErrorResponseModal,
  SuccessResponseModal,
  // Add other modals here if needed
};
