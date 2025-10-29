import API_URL from '../config';

// Helper for fetch requests
async function request(endpoint, options = {}) {
	const res = await fetch(`${API_URL}${endpoint}`, {
		headers: {
			'Content-Type': 'application/json',
			...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
		},
		...options,
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

// AUTH
export const login = (body) => request('/auth/login', { method: 'POST', body });
export const register = (body) => request('/auth/register', { method: 'POST', body });
export const forgotPassword = (body) => request('/auth/forgot-password', { method: 'POST', body });
export const resetPassword = (token, body) => request(`/auth/reset-password/${token}`, { method: 'POST', body });
export const getCurrentUser = (token) => request('/auth/user/me', { method: 'GET', token });

// CALENDAR
export const getAllEvents = (token) => request('/calendar/events', { method: 'GET', token });
export const getEventsByPeriod = (token, params) => request(`/calendar/events/period?${new URLSearchParams(params)}`, { method: 'GET', token });
export const getEventsByDate = (token, date) => request(`/calendar/events/${date}`, { method: 'GET', token });
export const getCalendarStats = (token) => request('/calendar/stats', { method: 'GET', token });
export const getAvailableProjects = (token) => request('/calendar/projects', { method: 'GET', token });
export const getEventById = (token, id) => request(`/calendar/events/${id}`, { method: 'GET', token });
export const createEvent = (token, body) => request('/calendar/events', { method: 'POST', body, token });
export const updateEvent = (token, id, body) => request(`/calendar/events/${id}`, { method: 'PUT', body, token });
export const deleteEvent = (token, id) => request(`/calendar/events/${id}`, { method: 'DELETE', token });

// TASKS
export const createTask = (token, body) => request('/tasks', { method: 'POST', body, token });
export const getTasks = (token) => request('/tasks', { method: 'GET', token });
export const getTaskById = (token, id) => request(`/tasks/${id}`, { method: 'GET', token });
export const updateTask = (token, id, body) => request(`/tasks/${id}`, { method: 'PUT', body, token });
export const deleteTask = (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token });

// PROJECTS
export const createProject = (token, body) => request('/projects', { method: 'POST', body, token });
export const getProjects = (token) => request('/projects', { method: 'GET', token });
export const getProjectById = (token, id) => request(`/projects/${id}`, { method: 'GET', token });
export const updateProject = (token, id, body) => request(`/projects/${id}`, { method: 'PUT', body, token });
export const deleteProject = (token, id) => request(`/projects/${id}`, { method: 'DELETE', token });

// TEAMS
export const getTeams = (token) => request('/teams', { method: 'GET', token });
export const getTeamById = (token, id) => request(`/teams/${id}`, { method: 'GET', token });
export const createTeam = (token, body) => request('/teams', { method: 'POST', body, token });
export const updateTeam = (token, id, body) => request(`/teams/${id}`, { method: 'PUT', body, token });
export const deleteTeam = (token, id) => request(`/teams/${id}`, { method: 'DELETE', token });

// DASHBOARD
export const getDashboard = (token) => request('/dashboard', { method: 'GET', token });