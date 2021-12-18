import {
	CHANGE_ASSIGNESS,
	CHANGE_TASK_MODAL_API,
	CHANGE_TASK_MODAL_API_SAGA,
	CREATE_TASK_SAGA,
	DELETE_TASK_API_SAGA,
	GET_ALL_TASK_API,
	GET_ALL_TASK_API_SAGA,
	GET_PROJECT_DETAIL_API,
	GET_PROJECT_DETAIL_API_SAGA_NOLOADING,
	GET_TASK_DETAIL,
	GET_TASK_DETAIL_SAGA,
	REMAVE_USER_ASSIGN,
	UPDATE_TASK_SAGA,
	UPDATE_TASK_STATUS_SAGA,
	UPDATE_TASK_STATUS_SAGA_TEXT,
} from "../Constants/constants";
import {
	all,
	call,
	delay,
	fork,
	put,
	select,
	take,
	takeEvery,
	takeLatest,
} from "redux-saga/effects";

import FromConfirmTask from "../../Components/Froms/From/FromConfirmTask";
import { GET_ALL_COMMENT_SAGA } from "../Constants/comment";
import { GET_PROJECT_DETAIL_API_SAGA } from "../../Redux/Constants/constants";
import { Notification } from "../../Utils/Notification/Notification";
import { STATUS_CODE } from "../../Utils/constants/settingSystem";
import { TaskReducer } from "../Reducer/TaskReducer";
import { TaskService } from "../../Services/Task/TaskService";
import { UPDATE_TASK_STATUS_SAGA_DONE_TEXT } from "../Constants/taskType";

function* createTaskSaga(action) {
	try {
		const { data, status } = yield call(() =>
			TaskService.createTask(action.taskObject)
		);
		Notification("success", "Create Task is successly");

		yield put({
			type: "CLOSE_MODAL",
		});
		yield delay(1000);
		// yield put({
		//   type: GET_PROJECT_DETAIL_API_SAGA,
		//   projectId: action.taskObject.projectId
		// })
		window.location.reload();
	} catch (error) {
		Notification("error", error.response.data.content);
	}
}

export function* theoDoiCreateTaskSaga() {
	yield takeLatest(CREATE_TASK_SAGA, createTaskSaga);
}

function* getTaskDetail(action) {
	const { taskId } = action;

	try {
		const { data, status } = yield call(() =>
			TaskService.getTaskDetail(taskId)
		);
		yield put({
			type: GET_TASK_DETAIL,
			taskDetailModal: data.content,
		});
	} catch (err) {
		console.log(err);
		console.log(err.response?.data);
	}
}

export function* theoDoiGetTaskDetailSaga() {
	yield takeLatest(GET_TASK_DETAIL_SAGA, getTaskDetail);
}

function* updateTaskStatusSaga(action) {
	let { projectDetail } = yield select((state) => state.projectReducer);
	let user = JSON.parse(localStorage.getItem("userlogin"));

	if (
		projectDetail.creator.id !== user?.id &&
		action?.taskUpdateStatus?.taskDetail?.userReporter?.userId !== user?.id
	) {
		Notification("error", "You not authorized");
		return;
	}
	switch (action.actionType) {
		case CHANGE_TASK_MODAL_API:
			{
				yield put({
					type: "CHANGE_TASK_MODAL_API_TEXT",
					statusId: action.taskUpdateStatus.statusId,
					taskId: action.taskUpdateStatus.taskId,
					statusOld: action.taskUpdateStatus.statusOld,
					taskDetail: action.taskUpdateStatus.taskDetail,
				});
			}
			break;
	}
	try {
		

		if (action.taskUpdateStatus?.statusId === "4") {
			yield put({
				type: "OPEN_MODAL_LEAVE_RPOJECT",
				ComponentContentModal: (
					<FromConfirmTask task={action.taskUpdateStatus}></FromConfirmTask>
				),
				
				title: "Confirm task",
			});
			return 
		}
		const { data, status } = yield call(() =>
			TaskService.updateStatusTask(action.taskUpdateStatus)
		);
		yield put({
			type: GET_PROJECT_DETAIL_API_SAGA_NOLOADING,
			projectId: action.taskUpdateStatus.projectId,
		})
		yield put({
			type: GET_ALL_TASK_API_SAGA,
			projectId: action.taskUpdateStatus.projectId
		})
		yield put({
			type: GET_TASK_DETAIL_SAGA,
			taskId: action.taskUpdateStatus.taskId,
		});
	} catch (err) {
		console.log(err);
		console.log(err.response?.data);
	}
}
export function* theoDoiUpdateTaskStatusSaga() {
	yield takeLatest(UPDATE_TASK_STATUS_SAGA_TEXT, updateTaskStatusSaga);
}




export function* UpdateTaskStatusDoneSaga(action)
{
	try {
		const { data, status } = yield call(() =>
			TaskService.updateStatusTask(action.taskUpdateStatus)
		);
		yield put({
			type: GET_PROJECT_DETAIL_API_SAGA_NOLOADING,
			projectId: action.taskUpdateStatus.projectId,
		});
		yield put({
			type: GET_ALL_TASK_API_SAGA,
			projectId: action.taskUpdateStatus.projectId
		})
		yield put({
			type: GET_TASK_DETAIL_SAGA,
			taskId: action.taskUpdateStatus.taskId,
		});
		Notification("success","Congratulations on completing the task")
	} catch (error) {
		console.log(error);
		console.log(error.response?.data);
	}

}

export function* theoDoiUpdateTaskStatusDoneSaga() {
	yield takeLatest(UPDATE_TASK_STATUS_SAGA_DONE_TEXT, UpdateTaskStatusDoneSaga);
}



//thay đổi task dưa lên api
function* updateTaskSaga(action) {}

export function* theoDoiUpdateTaskSaga() {
	yield takeLatest(UPDATE_TASK_SAGA, updateTaskSaga);
}




//thay đổi task dưa lên reducer
function* handleChangPostApi(action) {
	console.log(action);
	let { projectDetail } = yield select((state) => state.projectReducer);

	let user = JSON.parse(localStorage.getItem("userlogin"));

	if (projectDetail.creator.id !== user?.id && action?.auth !== user?.id) {
		console.log(123);
		Notification("error", "You not authorized ");
		return;
	}
	// else if ()
	// {
	// 	console.log(1234);
	// 	Notification("error", "You not authorized ");
	// 	return
	// }
	switch (action.actionType) {
		case CHANGE_TASK_MODAL_API:
			{
				const { value, name } = action;
				yield put({
					type: CHANGE_TASK_MODAL_API,
					name,
					value,
				});
			}
			break;
		case CHANGE_ASSIGNESS:
			{
				const { userSelected } = action;
				yield put({
					type: CHANGE_ASSIGNESS,
					userSelected,
				});
			}
			break;
		case REMAVE_USER_ASSIGN:
			{
				const { userId } = action;
				yield put({
					type: REMAVE_USER_ASSIGN,
					userId,
				});
			}
			break;
	}
	try {
		//gọi action làm thay đổi detail modal
		if (action.name === "timeTrackingRemaining") {
			if (action.value === "") {
				return { ...action, value: 0 };
			}
		} else if (action.name === "timeTrackingSpent") {
			if (action.value === "") {
				return { ...action, value: 0 };
			}
		}

		//Save lại rồi chạy qua UPDATE_TASK_SAGA
		//lấy dử liệu từ taskDetailModal
		let { taskDetailModal } = yield select((state) => state.TaskReducer);

		//biến đổi dử liệu state.taskDetailModal thành dử liệu api cần
		const listUserAsign = taskDetailModal.assigness?.map((user, index) => {
			return user.id;
		});
		const taskUpdateApi = { ...taskDetailModal, listUserAsign };
		//èo
		//tại vì bình thường không có lstUserAsign nên phải thêm chuối như vầy
		const { data, status } = yield call(() =>
			TaskService.updateTask(taskUpdateApi)
		);
		console.log(action)
		if (status === STATUS_CODE.SUCCESS) {
			yield put({
				type: GET_PROJECT_DETAIL_API_SAGA_NOLOADING,
				projectId: taskUpdateApi.projectId,
			});
			yield put({
				type: GET_ALL_TASK_API_SAGA,
				projectId: taskUpdateApi.projectId
			})
			yield put({
				type: GET_TASK_DETAIL_SAGA,
				taskId: taskUpdateApi.taskId,
			});
		}
	} catch (err) {
		console.log(err.response?.data.statusCode);
		console.log(err)
		if (err.response?.data.statusCode == STATUS_CODE.AUTHORIZATION) {
			Notification("error", "You not authorized ");
		} else {
			Notification("error", err.response?.data.content);
		}
	}
}
export function* theoDoiHandleChangPostApi() {
	yield takeLatest(CHANGE_TASK_MODAL_API_SAGA, handleChangPostApi);
}

function* deleteTaskSaga(action) {
	try {
		console.log(123);
		yield call(() =>
			TaskService.deleteTask(action.taskId)
		);

		yield put({
			type: GET_PROJECT_DETAIL_API_SAGA,
			projectId: action.projectId,
		});
		yield put({
			type: GET_ALL_TASK_API_SAGA,
			projectId: action.projectId
		})
		yield delay(1000)
		Notification("success", "Delete Task successly");
	} catch (err) {
		if (err.response?.data) {
			Notification("error", err.response?.data.message);
		} else Notification("error", err.response?.data.content);
	}
}

export function* theoDoiDeleteTaskSaga() {
	yield takeLatest(DELETE_TASK_API_SAGA, deleteTaskSaga);
}




function* getAllTaskSaga(action) {
	try {
	
	  const { data, status } =	yield call(() =>
			TaskService.getAllTask(action.projectId)
		);
		yield put({
			type: GET_ALL_TASK_API,
			TaskAllProject: data.content,
		});
	
	} catch (err) {
     console.log(err)
	}
}

export function* theoDoiGetAllTaskSaga() {
	yield takeLatest(GET_ALL_TASK_API_SAGA, getAllTaskSaga);
}
