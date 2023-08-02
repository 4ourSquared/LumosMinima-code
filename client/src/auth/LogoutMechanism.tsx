export default function useLogoutMechanism() {
    return () => {
        document.cookie = 'user-type=; Max-Age=0'
    }
}