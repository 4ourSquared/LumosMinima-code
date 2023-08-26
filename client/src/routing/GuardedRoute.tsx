import { Navigate, Outlet } from 'react-router-dom';
import {isLogged} from '../auth/LoginState'
import {useState, useEffect} from 'react'

interface GuardedRouteProps {
	/**
	 * Permission check for route
	 * @default false
	 */
     conditionCallback?: (() => Promise<boolean>)
	/**
	 * Route to be redirected to
	 * @default '/'
	 */
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
const GuardedRoute = ({conditionCallback = isLogged, redirectRoute}: GuardedRouteProps): JSX.Element => {

	const [condition,setCondition] = useState<boolean>(false)

	useEffect(()=>{
		const retrieve = async () => {
			const condition = await conditionCallback()
			setCondition(condition)
		retrieve()
		}
	},[])

	return condition ? <Outlet /> : <Navigate to={redirectRoute} replace />;
}

export default GuardedRoute;