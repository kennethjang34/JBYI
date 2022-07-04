import * as actionTypes from "../actions/actionTypes";
const initialState = {
	friends: localStorage.friends ? JSON.parse(localStorage.friends) : [],
	friendRequests: localStorage.friendRequests ? JSON.parse(localStorage.friendRequests) : []
};
const friendAdded = (state, action) => {
	const friends = state.friends ? [...state.friends, action.friend] : [action.friend];
	return {...state, friends: friends};
};

const friendRequestReceived = (state, action) => {
	var existing = state.friendRequests ? [...state.friendRequests] : [];
	var new_list = [];
	if (existing) {
		new_list = existing.filter((request) => {return request.id !== action.friendRequest.id})
	}
	new_list.push(action.friendRequest)
	return {
		...state,
		friendRequests: new_list,
	};
};
const loadFriends = (state, action) => {
	return {
		...state,
		friends: action.friends,
	};
};
const logout = (state, action) => {
	localStorage.removeItem("friends");
	localStorage.removeItem("friendRequests")
	return {
		...state,
		friends: null,
	};
};
const loadFriendRequests = (state, action) => {
	return {
		...state,
		friendRequests: [...(action.friendRequests)],
	};
}
export default reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.FRIEND_ADDED:
			return friendAdded(state, action);
		case actionTypes.FRIEND_REQUEST_RECEIVED:
			return friendRequestReceived(state, action);
		case actionTypes.LOAD_FRIENDS:
			return loadFriends(state, action);
		case actionTypes.LOAD_FRIEND_REQUESTS:
			return loadFriendRequests(state, action)
		case actionTypes.LOGOUT:
			return logout(state, action);
		default:
			return state;
	}
};
