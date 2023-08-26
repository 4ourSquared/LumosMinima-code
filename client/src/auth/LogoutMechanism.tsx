export default function useLogoutMechanism() {
    return () => {
        localStorage.removeItem('token');
    }
}