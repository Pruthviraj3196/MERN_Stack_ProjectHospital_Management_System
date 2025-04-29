const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const {ErrorHandler} = require("../middlewares/error");
const userModel = require("../models/userSchema");
const generateToken = require("../utils/jwtToken");
const cloudinary = require('cloudinary').v2;

const patientRegister = catchAsyncErrors(async(req, res, next) => {
  const {firstname, lastname, email, phone, nic, dob, gender, password} = req.body;

  if(!firstname || !lastname || !email || !phone || !nic || !dob || !gender || !password){
    return next(new ErrorHandler("please fill full form!", 400))
  }

  const isRegistered = await userModel.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }
 
  const user = await userModel.create({firstname, lastname, email, phone, nic, dob, gender, password, role:"Patient"});
  generateToken(user, "User Registered!", 200, res);
});


const login  = catchAsyncErrors(async(req, res, next) => {
  const {email, password, confirmPassword, role} = req.body;

  if(!email || !password || !confirmPassword || !role){
    return next(new ErrorHandler("please Provide All the Details!", 400))
  };

  if(password !== confirmPassword){
    return next(new ErrorHandler("Password and Confirm Password is not macthing", 400))
  };

  const user = await userModel.findOne({ email }).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid Email OR Password", 400))
  };

  const isPasswordMatch = await user.comparePassword(password);

  if(!isPasswordMatch){
    return next(new ErrorHandler("Invalid Email OR Password", 400))
  };

  if(role !== user.role){
    return next(new ErrorHandler("User with this role do not exits", 400))
  };

  generateToken(user, "User Login Successfully!", 200, res);
});

const addNewAdmin = catchAsyncErrors(async(req, res, next) => {
  const {firstname, lastname, email, phone, nic, dob, gender, password} = req.body;
  if(!firstname || !lastname || !email || !phone || !nic || !dob || !gender || !password){
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await userModel.findOne({ email });
  if(isRegistered){
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await userModel.create({firstname, lastname, email, phone, nic, dob, gender, password, role: "Admin", });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});


const getAllDoctors = catchAsyncErrors(async(req, res, next) => {
  const  doctors = await userModel.find({role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  })
});

const getUserDetails = catchAsyncErrors(async(req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
});

const logoutAdmin  = catchAsyncErrors(async(req, res, next) => {
  res.status(200).cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Admin Logout Successfully..!"
  })
});

const logoutPatient  = catchAsyncErrors(async(req, res, next) => {
  res.status(200).cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }).json({
    success: true,
    message: "Patient Logout Successfully..!"
  })
});

const addNewDoctor = catchAsyncErrors(async(req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0){
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  };
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)){
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {firstname, lastname, email, phone, nic, dob, gender, password, doctorDepartment} = req.body;
  if(!firstname || !lastname || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment || !docAvatar){
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  };
  const isRegistered = await userModel.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Doctor With This Email Already Exists!", 400));
  };
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error){
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return  next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await userModel.create({firstname, lastname, email, phone, nic, dob, gender, password, doctorDepartment, role:"Doctor", docAvatar:{
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.secure_url,
  },})
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

const userinfo = {
  patientRegister,
  login,
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  addNewDoctor,
};

module.exports = userinfo;