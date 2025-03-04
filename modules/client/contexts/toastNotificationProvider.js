import { createContext, useState } from 'react';

const NOTIF_TIME = 4000;
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [notification, setNotification] = useState();
	const [isSuccess, setIsSuccesss] = useState();

	const handleNotification = (notification, isSuccess) => {
		setNotification(notification);
		setIsSuccesss(isSuccess);
		setTimeout(() => {
			setNotification(null);
		}, NOTIF_TIME);
	};

	return (
		<NotificationContext.Provider
			value={{
				isSuccess,
				notification,
				handleNotification,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContext;