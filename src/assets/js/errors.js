import router from '@/router';

export const logError = (message) => {
    console.log(message);
};

export const serverErrorRedirect = () => {
    router.push({ name: 'errorDisplay', params: { which: 'serverError' } });
};

export const noPermissionRedirect = () => {
    router.push({ name: 'errorDisplay', params: { which: 'noPermissionToEdit' } });
};
