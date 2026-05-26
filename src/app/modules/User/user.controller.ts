import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser  = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await UserServices.createUserIntoDB(
   data
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});


const getSingelUser = catchAsync(async (req, res) => {
    const id =  req.params.id;
    const result = await UserServices.getSingelUserFromDB(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrived successfully',
      data: result,
    });
})


const deleteUser = catchAsync(async (req, res) => {
  const id =  req.params.id;
  const result = await UserServices.deleteUserFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
})


const updateUser = catchAsync(async (req, res) => {
  const id =  req.params.id;
  const data = req.body;            

  const result = await UserServices.updateUserInDB(id as string, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is updated successfully',
    data: result,
  });
});



const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
    sendResponse(res, { 
        statusCode: httpStatus.OK,
        success: true,
        message: 'All users retrived successfully',
        data: result,
    });
}) ;


export const UserControllers = {
  createUser,
  getSingelUser,
  deleteUser,
  updateUser,
  getAllUsers
};

