// const sql = require("./db.js");

// // constructor
// const sysUser = function (sysUser) {
//     this.idsysuser = sysUser.idsysuser;
//     this.userName = sysUser.userName;
//     this.userLastName=sysUser.userLastName;
//     this.email = sysUser.email;
//     this.password = sysUser.password;
//     this.tempPassword = sysUser.tempPassword;
//     this.tempPasswordExpDate = sysUser.tempPasswordExpDate;
//     this.creationDate = sysUser.creationDate;
//     this.userRole_iduserRole = sysUser.userRole_iduserRole;
//     this.userStatus_iduserStatus = sysUser.userStatus_iduserStatus;
 
// };
// sysUser.updateUser = (usuario, result) => {
//     //console.log(usuario);


//     const    consulta = `update  sysUser SET userName='${usuario.userName}',userLastName='${usuario.userLastName}',email='${usuario.email}',userRole_iduserRole='${usuario.userRole_iduserRole}' where idsysuser ='${usuario.idsysuser}'`

//     console.log(consulta);
//     sql.query(consulta, (err, res) => {
//         //console.log(res);
//         if (err) {
//             //console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if (res == "") {
//             result(null, res[0]);
//             return;
//         }

//         result(null, res[0]);
//     });
// };
// sysUser.updateStatusByIdUser = (usuario, result) => {
//     //console.log(usuario);


//     const    consulta = `update  sysUser SET userStatus_iduserStatus='${usuario.userStatus_iduserStatus}' where idsysuser ='${usuario.idsysuser}'`

//     console.log(consulta);
//     sql.query(consulta, (err, res) => {
//         //console.log(res);
//         if (err) {
//             //console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if (res == "") {
//             result(null, res[0]);
//             return;
//         }

//         result(null, res[0]);
//     });
// };

// sysUser.createUser = (newUser, result) => {

//     console.log(newUser);
//     sql.query("INSERT INTO sysUser SET ?", newUser, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         delete newUser.password;
//         result(null, { newUser });
//     });
// };

// sysUser.findOneLoginid = (usuario, result) => {
//     sql.query("select * from sysUser where email =? ",
//         [usuario.email], (err, res) => {

//             if (err) {
//                 //console.log("error: ", err);
//                 result(err, null);
//                 return;
//             }

//             if (res == "") {
//                 result(null, res);
//                 return;
//             }

//             // //console.log(res);
//             result(null, res);
//         });
// };

// sysUser.getUserById = (usuario, result) => {
//     //console.log(usuario);
//     sql.query("SELECT * FROM user WHERE iduser =?",
//         usuario.iduser, (err, res) => {
//             //console.log(res);
//             if (err) {
//                 //console.log("error: ", err);
//                 result(err, null);
//                 return;
//             }

//             if (res == "") {
//                 result(null, res[0]);
//                 return;
//             }

//             //console.log(res);
//             delete res[0].password;


//             result(null, res[0]);
//         });
// };

// sysUser.updateInfoById = (usuario, result) => {
//     //console.log(usuario);
// consulta='';
// console.log(usuario);
//     if (usuario.password) {
//         console.log("update password");
//         consulta = `update  user SET name='${usuario.name}',lastName='${usuario.lastName}',email='${usuario.email}',rol_idrol='${usuario.rol_idrol}',company_idcompany='${usuario.company_idcompany}',phone='${usuario.phone}',companyRole='${usuario.companyRole}',password='${usuario.password}' where iduser ='${usuario.iduser}'`
//     }else{
//         consulta = `update  user SET name='${usuario.name}',lastName='${usuario.lastName}',email='${usuario.email}',rol_idrol='${usuario.rol_idrol}',company_idcompany='${usuario.company_idcompany}',phone='${usuario.phone}',companyRole='${usuario.companyRole}' where iduser ='${usuario.iduser}'`
//     }
//  console.log(consulta);
//     sql.query(consulta, (err, res) => {
//         //console.log(res);
//         if (err) {
//             //console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if (res == "") {
//             result(null, res[0]);
//             return;
//         }

//         result(null, res[0]);
//     });
// };



// sysUser.changePassword = (newUser, result) => {

//     sql.query("update  sysUser SET password= ?,  tempPassword=NULL, tempPasswordExpDate=NULL where email =?", [newUser.password, newUser.email], (err, res) => {
//         if (err) {
//             //console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if (res.affectedRows == 0) {
//             result({ kind: "not_found" }, null);
//             return;
//         }
//         //console.log("updated user: ", { newUser });
//         delete newUser.password;

//         result(null, newUser);
//         return;


//     });
// };

// sysUser.recoverPassword = (tmpUser, result) => {

//     sql.query("update sysUser SET tempPassword= ? ,tempPasswordExpDate= ? where email =? ", [tmpUser.tempPassword, tmpUser.tempPasswordExpDate, tmpUser.email], (err, res) => {
//         if (err) {
//             // //console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//         if (res.affectedRows == 0) {
//             result({ kind: "not_found" }, null);
//             return;
//         }

//         sql.query("update sysUser SET password= ?  where email =? ", ['*******************', tmpUser.email], (err, res) => {
//             if (err) {
//                 // //console.log("error: ", err);
//                 // result(err);
//                 return err;
//             }
//             if (res.affectedRows == 0) {
//                 result({ kind: "not_found" }, null);
//                 return;
//             }
//         });

//         result(null, { result });
//         return;


//     });
// };



// sysUser.getAllUsers = (result) => {

//     sql.query("SELECT idsysuser,userName,userLastName,email,userRole_iduserRole,userStatus_iduserStatus,creationDate FROM sysUser;", (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         } else {

//             result(null, res);
//         }

//     });


// };



// // sysUser.inactiveUserById = (usuario, result) => {
// //     //console.log(usuario);
// //     sql.query("update user set userStatus_iduserStatus=2  where iduser =?",  [usuario.iduser], (err, res) => {
// //         //console.log(res);
// //         if (err) {
// //             //console.log("error: ", err);
// //             result(err, null);
// //             return;
// //         }
// //         if (res == "") {
// //             result(null, res[0]);
// //             return;
// //         }

// //         result(null, res[0]);
// //     });
// // };

// // sysUser.activeUserById = (usuario, result) => {
// //     //console.log(usuario);
// //     sql.query("update user set userStatus_iduserStatus=1  where iduser =?",  [usuario.iduser], (err, res) => {
// //         //console.log(res);
// //         if (err) {
// //             //console.log("error: ", err);
// //             result(err, null);
// //             return;
// //         }
// //         if (res == "") {
// //             result(null, res[0]);
// //             return;
// //         }

// //         result(null, res[0]);
// //     });
// // };


// // sysUser.getUserByCompanyId = (usuario, result) => {

// //     sql.query("SELECT user.iduser,user.phone,user.name,user.lastName,user.email,user.rol_idrol, user.userStatus_iduserStatus,company.nameCompany FROM user INNER JOIN company ON company.idcompany=user.company_idcompany where company_idcompany=?",  usuario.idcompany, (err, res) => {
// //         console.log(res);
// //         if (err) {
// //             //console.log("error: ", err);
// //             result(err, null);
// //             return;
// //         }
// //         if (res == "") {
// //             result(null, res[0]);
// //             return;
// //         }

// //         result(null, res);
// //     });
// // };


// // sysUser.filterUsers = (filtros, result) => {
// //     consulta = "SELECT user.iduser,user.phone,user.name,user.lastName,user.email,user.rol_idrol,rol.nameRol, user.userStatus_iduserStatus,company.nameCompany FROM user INNER JOIN company ON company.idcompany=user.company_idcompany INNER JOIN rol ON rol.idrol=user.rol_idrol"

// //     if (filtros.idcompany != "" || filtros.idrol != "") {
// //         consulta=   consulta + " where ";
// //         if (filtros.idcompany) {


// //             consulta = `${consulta}  company_idcompany=${filtros.idcompany} `


// //         }

// //         if (filtros.idrol != "") {
// //             if (filtros.idcompany != "") {
// //                 consulta = ` ${consulta} and  rol_idrol=${filtros.idrol} `

// //             } else {
// //                 consulta = ` ${consulta}   rol_idrol=${filtros.idrol} `

// //             }

// //         }
// //     }

// //     sql.query(consulta, (err, res) => {
// //         if (err) {
// //             result(err, null);
// //             return;
// //         }


// //         result(null, res);
// //     });
// // };


// module.exports = sysUser;