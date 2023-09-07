import { Navigate, Outlet } from 'react-router-dom';
import authorization,{Role,UserData} from '../auth/Authorization'
import {useState, useEffect} from 'react'


interface GuardedRouteProps {
	requiredRole ?: Role;
	redirectRoute: string;
}

/**
 * Component for guarding restricted routes
 *
 * @example Default usage
 * ```ts
 * <GuardedRoute
 *	 condition={true}
 * />
 * ```
 *
 * @example Usage with custom redirected route
 * ```ts
 * <GuardedRoute
 *	 condition={false}
 *	 redirectRoute={'/login'}
 * />
 * ```
 */
const GuardedRoute = ({requiredRole = Role.Any, redirectRoute}: GuardedRouteProps): JSX.Element => {

	const [userData,setUserData] = useState<UserData>()

	useEffect(()=>{
		const retrieve = async () => {
			const data = await authorization()
			setUserData(data)
		}
		retrieve()
	},[])

	if(userData === undefined) return <p>Attendo...</p>

	let success: boolean = false
	const actualRole = userData.role
	
	if(requiredRole === Role.Any)
		success = actualRole > Role.None
	else
		success = actualRole === requiredRole

	return success ? <Outlet context={userData}/> : <Navigate to={redirectRoute} replace />;
}

export default GuardedRoute;