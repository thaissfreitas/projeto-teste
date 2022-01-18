import { useCallback } from 'react';
import { useEffect } from 'react';
import { FC } from 'react';
import { useContext } from 'react';
import { createContext, useState } from 'react';
import { ICreateUserDTO } from '../domain/modules/users/dtos/ICreateUserDTO';
import { ICreateUserSessionDTO } from '../domain/modules/users/dtos/ICreateUserSessionDTO';
import { IUser } from '../domain/modules/users/entities/IUser';
import { api } from "../services/api";

interface IAuthenticationContext {
	user: IUser | null;
	signed: boolean;
	token: string | null;
	signIn: (data: ICreateUserSessionDTO) => Promise<void>;
	signUp: (data: ICreateUserDTO) => Promise<void>;
	logout: () => Promise<void>;
}

const authenticationContext = createContext({} as IAuthenticationContext);

export const AuthenticationContextProvider: FC = ({ children }) => {
	const [user, setUser] = useState<undefined | null | IUser>(undefined);
	const [token, setToken] = useState<string | null>(null);

	const signIn: IAuthenticationContext['signIn'] = useCallback(async ({ email, password }) => {
		const { data } = await api.post<{ user: IUser, token: string }>("/users/signIn", {
			email,
			password
		});
		localStorage.setItem('@@m_blog@@_session', JSON.stringify(data));
		setUser(data.user);
		setToken(data.token);
	}, []);

	const signUp: IAuthenticationContext['signUp'] = useCallback(async ({ email, password, name, avatar }) => {
		await api.post<IUser>("/users", {
			email,
			name,
			password
		});
		if (avatar) {
			const { data: { token } } = await api.post<{ token: string }>("/users/signIn", {
				email,
				password
			});
			const formData = new FormData();
			formData.append('avatar', avatar);
			await api.patch("/users/updateAvatar", formData, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		}
	}, []);

	const logout: IAuthenticationContext['logout'] = useCallback(async () => {
		localStorage.clear();
		setUser(null);
	}, []);

	useEffect(() => {
		if (user === undefined) {
			const cachedData = localStorage.getItem('@@m_blog@@_session');
			const parsedUser = cachedData ? JSON.parse(cachedData) : null;
			if (parsedUser) {
				setUser(parsedUser.user);
				setToken(parsedUser.token);
			} else {
				setUser(null);
			}
		}
	}, [user]);

	if (user === undefined) {
		return null;
	}

	return <authenticationContext.Provider value={{
		user,
		signed: !!user,
		token,
		signIn,
		signUp,
		logout
	}}>
		{children}
	</authenticationContext.Provider>;
};

export const useAuthentication = (): IAuthenticationContext => {
	return useContext(authenticationContext);
};