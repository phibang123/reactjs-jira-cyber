import {
	ADD_USER_PROJECT_API_SAGA,
	DELETE_PROJECT_SAGA,
	EDIT_PROJECT,
	GET_LIST_PROJECT_SAGA,
	GET_USER_SAGA_API,
	REMOVE_USER_PROJECT_API_SAGA,
} from "../../Redux/Constants/constants";
import { AutoComplete, Avatar, Button, Popover, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, message } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import FromEditProject from "../../Components/Froms/FromEditProject/FromEditProject";
import { NavLink } from "react-router-dom";
import { OPEN_DREWER_EDIT_PROJECT } from "../../Redux/Constants/drawer";
import ReactHtmlParser from "react-html-parser";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function ProjectManagement() {
	//lấy dử liệu từ reducer về
	const { projectList } = useSelector((state) => state.projectManageReducer);
	const { userSearch } = useSelector((state) => state.userReducer);
	//sử dụng dispatch gọi action
	const [value, setValue] = useState("");
	const dispatch = useDispatch();

	const searchRef = useRef(null);

	useEffect(() => {
		dispatch({
			type: GET_LIST_PROJECT_SAGA,
		});
	}, []);

	const [state, setState] = useState({
		filteredInfo: null,
		sortedInfo: null,
	});

	const clearFilters = () => {
		setState({ filteredInfo: null });
	};

	const clearAll = () => {
		setState({
			filteredInfo: null,
			sortedInfo: null,
		});
	};
	const setAgeSort = () => {
		setState({
			sortedInfo: {
				order: "descend",
				columnKey: "age",
			},
		});
	};
	const handleChange = (pagination, filters, sorter) => {
		setState({
			filteredInfo: filters,
			sortedInfo: sorter,
		});
	};

	let { sortedInfo, filteredInfo } = state;

	sortedInfo = sortedInfo || {};
	filteredInfo = filteredInfo || {};
	const columns = [
		{
			title: "Id",
			width: 50,
			dataIndex: "id",
			key: "id",
			sorter: (item1, item2) => {
				return item1.id - item2.id;
			},
			// filters: [
			//   { text: 'Joe', value: 'Joe' },
			//   { text: 'Jim', value: 'Jim' },
			// ],
			// filteredValue: filteredInfo.name || null,
			// onFilter: (value, record) => record.name.includes(value),
			// sorter: (a, b) => a.name.length - b.name.length,
			// sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
			// ellipsis: true,
		},
		{
			title: "Project Name",
      width: 300,
			dataIndex: "projectName",
			render: (text, recond, index) => {
				return <NavLink  to={`/projectdetail/${recond.id}`}>{text}</NavLink>;
			},
			key: "projectName",
			sorter: (item1, item2) => {
				let projectName1 = item1.projectName?.trim().toLowerCase();
				let projectName2 = item2.projectName?.trim().toLowerCase();
				if (projectName1 < projectName2) {
					return -1;
				}
				return 1;
			},
			// sorter: (a, b) => a.age - b.age,
			// sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
			// ellipsis: true,
		},

		//tạm thời không lấy derestion

		// {
		//   title: 'Description',
		//   dataIndex: 'description',
		//   key: 'description',
		//   render: (text, record, index) =>
		//   {
		//     // console.log('text',text)
		//     // console.log('record',record)
		//     // console.log('index', index)
		//     let jsxContent = ReactHtmlParser(text)
		//     return <div>
		//       {jsxContent}
		//     </div>
		//   }
		// },

		{
			title: "Category",
			width: 150,
			dataIndex: "categoryName",
			key: "categoryName",
			sorter: (item1, item2) => {
				let category1 = item1.categoryName?.trim().toLowerCase();
				let category2 = item2.categoryName?.trim().toLowerCase();
				if (category1 < category2) {
					return -1;
				}
				return 1;
			},
		},
		{
			title: "Creator",
			key: "creator",
			width: 200,
			render: (text, record, index) => {
				return <Tag color="gold"> {record.creator?.name}</Tag>;
			},
			sorter: (item1, item2) => {
				let creator1 = item1.creator?.name.trim().toLowerCase();
				let creator2 = item2.creator?.name.trim().toLowerCase();
				if (creator1 < creator2) {
					return -1;
				}
				return 1;
			},
		},
		{
			title: "members",
			key: "members",
			width: 300,
			render: (text, record, index) => {
				return (
					<div>
						{record.members?.slice(0, 3).map((member, index) => {
							return (
								<Popover
									key={index}
									placement="top"
									title="members"
									content={() => {
										return (
											<table className="table">
												<thead>
													<tr>
														<th>Id</th>
														<th>Avatar</th>
														<th>name</th>
														<th></th>
													</tr>
												</thead>
												<tbody>
													{record.members?.map((item, index) => (
														<tr key={index}>
															<td>{item.userId}</td>
															<td>
																<img
																	src={item.avatar}
																	width="30"
																	height="30"
																	style={{ borderRadius: "15px" }}
																	alt=""
																></img>
															</td>
															<td>{item.name}</td>
														
														</tr>
													))}
												</tbody>
											</table>
										);
									}}
								>
									<Avatar className="m-1" key={index}  src={member.avatar} />
								</Popover>
							);
						})}
						{record.members?.length > 3 ? <Avatar>...</Avatar> : ""}
					
					</div>
				);
			},
		},
		// {
		// 	title: "Action",
		// 	width: 150,
		// 	key: "action",
		// 	render: (text, record, index) => (
		// 		<div size="middle">
		// 			<button

		
		// 				style={{ lineHeight: "50%" }}
		// 				className="btn mr-2 btn-outline-primary"
		// 				onClick={() => {
		// 					const action = {
		// 						type: OPEN_DREWER_EDIT_PROJECT,
		// 						Component: <FromEditProject></FromEditProject>,
		// 						title: "Edit Project",
		// 					};
		// 					dispatch(action);
		// 					//dispatch dử liệu dòng hiện tại lên reducer
		// 					const actionEditProject = {
		// 						type: EDIT_PROJECT,
		// 						projectEditDrawer: record,
		// 					};
		// 					dispatch(actionEditProject);
		// 				}}
		// 			>
		// 				<EditOutlined style={{ fontSize: "12px" }} />
		// 			</button>
           
		// 			<button
		// 		
		// 				style={{ lineHeight: "50%" }}
		// 				onClick={() =>
		// 				{
		// 					dispatch({
		// 						type: DELETE_PROJECT_SAGA,
		// 						idProject: record.id,
		// 					});
		// 				 }}
		// 					className="btn mr-2 btn-outline-danger"
		// 				>
		// 					<DeleteOutlined style={{ fontSize: "12px" }} />
		// 				</button>
		// 			{/* <Popconfirm
		// 				title="Are you sure to delete this project?"
						
		// 				onConfirm={() => {
		// 					dispatch({
		// 						type: DELETE_PROJECT_SAGA,
		// 						idProject: record.id,
		// 					});
		// 				}}
		// 				okText="Yes"
		// 				cancelText="No"
		// 			>
		// 				<button

		// 					style={{ lineHeight: "50%" }}
		// 					className="btn mr-2 btn-outline-danger"
		// 				>
		// 					<DeleteOutlined style={{ fontSize: "12px" }} />
		// 				</button>
		// 			</Popconfirm> */}
		// 		</div>
		// 	),
		// },
		// {
		//   title: 'Address',
		//   dataIndex: 'address',
		//   key: 'address',
		//   filters: [
		//     { text: 'London', value: 'London' },
		//     { text: 'New York', value: 'New York' },
		//   ],
		//   filteredValue: filteredInfo.address || null,
		//   onFilter: (value, record) => record.address.includes(value),
		//   sorter: (a, b) => a.address.length - b.address.length,
		//   sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
		//   ellipsis: true,
		// },
	];

	return (
		<div className="container mt-5">
			<h3>Project Management: { projectList?.length}</h3>
			<Space style={{ marginBottom: 16 }}>
				<h6
					style={{
						background: "rgb(235, 236, 240)",
						width: "600px",
						padding: "10px",
					}}
				>
					<span style={{ color: "red" }}>* </span>Note: here allows you to
					change, delete, and add members to the project you can click on the
					project name link to manage your project details more
				</h6>
			</Space>
			<Table

				columns={columns}
				rowKey={"id"}
				dataSource={projectList}
				onChange={handleChange}
			/>
		</div>
	);
}
