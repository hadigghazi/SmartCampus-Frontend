import Swal from 'sweetalert2';

const ConfirmationDialog = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    color: '#123962',
    confirmButtonColor: '#ff0000',
    cancelButtonColor: '#123962',
    confirmButtonText: 'Yes, delete it!',
  });

  return result.isConfirmed;
};

export default ConfirmationDialog;
