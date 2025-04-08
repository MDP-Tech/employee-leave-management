const { name } = require("ejs");
const db = require("../config/connection");
const jwt = require('jsonwebtoken');

function countWeekdays(startDate, endDate, nationalHolidays, stateHolidays,saturdayHolidays) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let weekdays = 0;


  // Function to check if a given date is a holiday
  function isHoliday(date, holidayList) {
      return holidayList.some(holiday => {
          return (
              holiday.getTime() === date.getTime() // Check for the exact date match
          );
      });
  }

  for (let currentDate = start; currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      // Check if the current day is not a Saturday (6), Sunday (0), or a holiday
      if (currentDate.getDay() !== 0 && !isHoliday(currentDate, saturdayHolidays) &&
          !isHoliday(currentDate, nationalHolidays) &&
          !isHoliday(currentDate, stateHolidays)) {
          weekdays++;
      }
  }

  return weekdays;
}




exports.adminLoginPage = async (req, res) => {

 };

  exports.loginPage= async (req, res) => {
   
     if(req.session.employee_id && req.session.role == 'hr') {
      res.redirect("/admin/dashboard");
     }else if(req.session.employee_id && req.session.role == 'employee'){
      res.redirect("/employees/dashboard");
     }else{
      console.log("ji456")
      res.render("../views/pages/login");
     }   
  };

  exports.leaveHistoryPage= async (req, res) => {

    sql_query="SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id"
    
        db.query(sql_query,(err,result)=>{
        if (!err) {
          

            res.render("../views/pages/leavehistory",{result:result,admin_name: req.session.employee_name})
          }
          else {
           
            res.status(401).json({ status: "failed" });
          }
          
    })
    
     
    
  
};

exports.dashboard = async (req, res) => {
  if (req.session.employee_id && req.session.role == 'hr') {
    sql_query = "select concat(first_name,' ',last_name) name from employees where employee_id='" + req.session.employee_id + "'"

    db.query(sql_query, async (err, result) => {
      if (!err) {

        sql_query2 = " select COUNT(lr.request_id) as p_count from leave_requests lr,employees e where e.employee_id=lr.employee_id  and lr.status='pending' and e.role='employee' "
        db.query(sql_query2, async (err2, result2) => {
          if (!err2) {

            sql_query3 = " select COUNT(lr.request_id) as a_count from leave_requests lr,employees e where e.employee_id=lr.employee_id  and lr.status='approved' and e.role='employee' "
            db.query(sql_query3, async (err3, result3) => {
              if (!err3) {


                sql_query4 = " select COUNT(lr.request_id) as r_count from leave_requests lr,employees e where e.employee_id=lr.employee_id  and lr.status='rejected' and e.role='employee' "
                db.query(sql_query4, async (err4, result4) => {
                  if (!err4) {

                    sql_query5 = " SELECT COUNT(e.employee_id) as t_count FROM leave_requests lr, employees e where e.employee_id = lr.employee_id and lr.status = 'approved' AND (DATE(lr.start_date) <= CURDATE() OR CURDATE() >= DATE(lr.end_date))"
                    db.query(sql_query5, async (err5, result5) => {

                      if (!err5) {

                        const permission_p_count = await getpermisisoncount('pending');
                        const permission_a_count = await getpermisisoncount('approved');
                        const permission_d_count = await getpermisisoncount('rejected');
			                  const sql_query6 = "SELECT count(permission_id) as count FROM `permissions` WHERE date=CURDATE() and status='approved'";
                        const sql__query7 ="SELECT COUNT(permission_id) AS count FROM permissions WHERE MONTH(date) = MONTH(CURDATE()) AND status = 'approved'";
                        const sql_query8 =`select count(*) as count from (sELECT DISTINCT employee_id
                          FROM leave_requests lr
                          WHERE DATE(lr.start_date) <= DATE(CURDATE()) AND DATE(CURDATE()) <= DATE(lr.end_date) and lr.status='approved' GROUP by lr.employee_id) x;`
                       const sql_query9 =`SELECT COUNT(*) as count
                       FROM (
                           SELECT DISTINCT employee_id
                           FROM leave_requests lr
                           WHERE YEAR(lr.start_date) = YEAR(CURDATE())
                               AND MONTH(lr.start_date) = MONTH(CURDATE())
                               AND lr.status = 'approved'
                           GROUP BY lr.employee_id
                       ) x;`
                        const permission_count =  await getCount(sql_query6);
                        const permission_monthly= await getCount(sql__query7);
			                  const day_leave_count= await getCount(sql_query8);
                        const monthly_leave_count= await getCount(sql_query9);

                       


                        res.render("../views/pages/dashboard", {
                          admin_name: result[0].name,
                          pending_count: result2[0].p_count,
                          approved_count: result3[0].a_count,
                          rejected_count: result4[0].r_count,
                          t_count: result5[0].t_count,
                          permission_p_count: permission_p_count,
                          permission_a_count: permission_a_count,
                          permission_d_count: permission_d_count,
			                    permission_count:permission_count ,
			                    permission_monthly :permission_monthly,day_leaves_count:day_leave_count,
                          monthly_leave_count:monthly_leave_count
                        });

                      } else {
                        res.status(401).json({ status: "failed5" });
                      }

                    })

                  }
                  else {
                    res.status(401).json({ status: "failed4" });
                  }

                })

              }

              else {
                res.status(401).json({ status: "failed3" });
              }

            })

          }

          else {
            res.status(401).json({ status: "failed2" });
          }

        })

      }

      else {
        res.status(401).json({ status: "failed" });
      }

    })

  }

  else {
    res.redirect("/");
  }
}
async function getpermisisoncount(type) {
  return new Promise((resolve, reject) => {
    
    const sql_query2= "SELECT count(permission_id) pending_count from permissions where  status='"+type+"' "
    db.query(sql_query2, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result[0].pending_count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });

  
}
async function getCount(sql_query6) {
  return new Promise((resolve, reject) => {
    
    
    db.query(sql_query6, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result[0].count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

exports.pendingHistoryPage= async (req, res) => {
  if (req.session.employee_id) {
     sql_query=" SELECT lr.request_id,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and lr.status='pending'   "
     db.query(sql_query,(err,result)=>{
  if (!err) {
    if (result.length>0) {
      result=result
      
    }else{
      result="0"; 
    }
    
    res.render("../views/pages/pendinghistory",{result:result,admin_name :req.session.employee_name})
    }
    else {
     
      res.status(401).json({ status: "failed" });
    }
    
})
}else{

  res.redirect("/");
}


}



  exports.logIn = async (req, res) => {
    let data = req.body;
    db.query(
      "select employee_id,role,concat(first_name,' ',last_name) as name from employees where email=? and BINARY password=? and  user_status =1 ",
      [data.user_name, data.user_password],
      (err, result) => {
         
        if (err) {
          res.json({ status: "failed" });

        } else if (result.length == 1) {

          req.session.employee_id = result[0].employee_id;
          req.session.employee_name=result[0].name;
	        req.session.role=result[0].role;
          res.json({ status: "Successful", sessionData: req.session.employee_id,role:result[0].role });
          // res.render('../views/pages/leads_dashboard');
        } else {
       
          res.json({ status: "Invalid credentials" });
        }
      }
    );
  };
  exports.filterLeaveHistoryByStatus = async (req, res) => {
  
     status = req.query.value;
    if (req.session.employee_id) {
      
    if (status == 'today') {

       sql_query =`SELECT X.*
       FROM ( SELECT e.employee_id, lr.request_id AS request_id, lr.leave_type, lr.Description, lr.start_date, lr.end_date, lr.created_at, lr.status, CONCAT(e.first_name,' ',e.last_name) AS fullname  FROM leave_requests lr
           JOIN employees e ON e.employee_id = lr.employee_id
           WHERE DATE(lr.start_date) <= DATE(CURDATE())
               AND DATE(CURDATE()) <= DATE(lr.end_date)
               AND lr.status = 'approved'
           GROUP BY lr.employee_id ORDER BY lr.request_id DESC
       ) AS X `;
	
	
    }

	if (status == 'monthly') {

      sql_query =`SELECT *  FROM (
        SELECT e.employee_id, lr.request_id AS request_id, lr.leave_type, lr.Description, lr.start_date, lr.end_date, lr.created_at, lr.status, CONCAT(e.first_name,' ',e.last_name) AS fullname
        FROM leave_requests lr,employees e
        WHERE e.employee_id=lr.employee_id AND YEAR(lr.start_date) = YEAR(CURDATE())
            AND MONTH(lr.start_date) = MONTH(CURDATE())
            AND lr.status = 'approved'
        GROUP BY lr.employee_id ORDER BY lr.request_id DESC
    ) X; `
     
   }
if( status != 'monthly' && status != 'today'  ){

sql_query=" SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.role='employee' and lr.status='"+status+"'"
 sql_query=sql_query+"order by lr.request_id desc"
}
    //sql_query=" SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.role='employee' and lr.status='"+status+"'"
      
        //sql_query=sql_query+"order by lr.request_id desc"
        db.query(sql_query,(err,result)=>{
          if (!err) {
            
   
            res.render("../views/pages/leavesHistory",{result:result, admin_name:req.session.employee_name,value:status })
            }
            else {
              res.status(401).json({ status: "failed2" ,error:err});
            }

           
            
        })
      
   
  
    }else{
      res.redirect("/");
    }
  }
  exports.approveHistoryPage= async (req, res) => {
    if (req.session.employee_id) 
      
    {

    sql_query=" SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id  and lr.status='approved' order by lr.request_id desc "
      
    db.query(sql_query,(err,result)=>{
    if (!err) {
      if(result.length>0){

        result=result;
      }else{
        result="0"
      }
  
      res.render("../views/pages/approvedHistory",{result:result,admin_name: req.session.employee_name})
      }
      else {
        res.status(401).json({ status: "failed" });
      }
      
  })
}else{
  res.redirect("/");
}
  
  }

  exports.declinedHistory = async (req, res) => {
if (req.session.employee_id) {
  

    sql_query=" SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and lr.status='rejected' "
      
    db.query(sql_query,(err,result)=>{
    if (!err) {
      if(result.length>0){
        result=result;
      }else{
        result="0";
      }
  
      res.render("../views/pages/declinedHistory",{result:result,admin_name: req.session.employee_name})
      }
      else {
      
        res.status(401).json({ status: "failed" });
      }
      
  })
}else{
  res.redirect("/");
}
  
  
  }

  exports.leavesHistory = async (req, res) => {
    let data=req.body;
    if (req.session.employee_id && req.session.role == 'hr') {
      
    
    sql_query=" SELECT e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.role='employee' "
      if (data.leavehistory == undefined) {
        sql_query=sql_query+"order by lr.request_id desc"
        db.query(sql_query,(err,result)=>{
          if (!err) {
            
        
            res.render("../views/pages/leavesHistory",{result:result, admin_name:req.session.employee_name,value:'' })
            }
            else {
              res.status(401).json({ status: "failed2" ,error:err});
            }
            
        })
      }else{
        if (data.status == '') {
         
          sql_query= sql_query+ " order by lr.request_id desc"
        
         
        }else{
          sql_query= sql_query+ " and lr.status='"+data.status+"' order by lr.request_id desc   "
        }
        db.query(sql_query,(err,result)=>{
          if (!err) {
            
       
            res.send({status:"sucess",data:result})
            }
            else {
              console.log(err);
              res.status(401).json({ status: "failed1",error1:err });
            }
            
        })


      }
   
  
    }else{
      res.redirect("/");
    }
  }
  
  exports.department = async (req, res) => {

    sql_query="SELECT * FROM  departments "
      
    db.query(sql_query,(err,result)=>{
    if (!err) {
      
  
      res.render("../views/pages/department",{result:result})
      }
      else {
        res.status(401).json({ status: "failed" });
      }
      
  })
  
  
  }

  exports.logOut = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ status: "Error logging out" });
      } else {
        res.redirect("/");
        // res.json({ status: 'Logout successful' });
      }
    });
  };

  exports.calender = async (req, res) => {
    
    if (req.session.employee_id && req.session.role == 'employee') {
    sql_query="SELECT * FROM leave_requests where employee_id = '"+req.session.employee_id+"'"
      db.query(sql_query,(err,result)=>{
        if (!err) {
          if (result.length > 0) {
            
          }else{
            
          }
          
      
          res.render("../views/pages/employees/calender",{employee:req.session.employee_name,result:result})
          }
          else {
            res.status(401).json({ status: "failed" });
          }
         
      })
  
    }else{
      res.redirect("/");
    }
    
  };

  exports.reports = async (req, res) => {
    if (req.session.employee_id && req.session.role == 'employee') {
      res.render('../views/pages/employees/reports',{employee :req.session.employee_name})
    }else{
      res.redirect("/");
    }
    
  };

  exports.getdetails = async(req,res)=>{
    console.log("hi")
    sql_query="SELECT * FROM leave_requests where employee_id = '"+req.session.employee_id+"' "
    db.query(sql_query,(err,result)=>{
      if (!err) {
        if (result.length > 0) {
     
        }else{
          
        }

        sql_query1="SELECT * FROM permissions where employee_id = '"+req.session.employee_id+"'  "
        db.query(sql_query1,(err1,result1)=>{
          if (!err) {
            if (result1.length > 0) {
           
            }else{
              
            }
            res.send({status:"sucess",data:result,data1:result1});
        
            }
            else {
              res.status(401).json({ status: "failed1" });
            }
           
        })






        
    
      
        }
        else {
          res.status(401).json({ status: "failed" });
        }
       
    })


  }


  exports.getDetailsByAdmin = async(req,res)=>{
    console.log("hi")
    sql_query="SELECT e.*,lr.*,CONCAT(e.first_name, ' ', e.last_name) as name FROM employees e,leave_requests lr where lr.employee_id=e.employee_id"
    db.query(sql_query,(err,result)=>{
      if (!err) {
        if (result.length > 0) {
         
        }else{
          
        }

        sql_query1="SELECT e.*,p.*,CONCAT(e.first_name, ' ', e.last_name) as name FROM permissions p,employees e where p.employee_id=e.employee_id"
        db.query(sql_query1,(err1,result1)=>{
          if (!err) {
            if (result1.length > 0) {
               
            }else{
              
            }
            res.send({status:"sucess",data:result,data1:result1});
        
            }
            else {
              res.status(401).json({ status: "failed1" });
            }
           
        })






        
    
      
        }
        else {
          res.status(401).json({ status: "failed" });
        }
       
    })


  }

  exports.adminCalender = async (req, res) => {
    
    
    sql_query="SELECT * FROM leave_requests where employee_id = '"+req.session.employee_id+"'"
      db.query(sql_query,(err,result)=>{
        if (!err) {
          if (result.length > 0) {
            // console.log(result);
          }else{
            
          }
          
      
          res.render("../views/pages/adminCalendar",{admin_name :req.session.employee_name})
          }
          else {
            res.status(401).json({ status: "failed" });
          }
         
      })
  
   
    
  };

  exports.calender1=async(req,res)=>{

     res.render('../views/pages/employees/calender1',);
    //  res.render('../views/pages/employees/page-test');

  }
  exports.adminProfile=async(req,res)=>{
if (req.session.employee_id && req.session.role == 'hr') {
  sql_query2="SELECT concat(first_name,' ',last_name) name,password,email,last_name,phone_number,experience from employees where employee_id='"+ req.session.employee_id+"'"
  db.query(sql_query2, (err2, result2) => {
    if (!err2) {
      
      if (result2.length > 0) {
       
      }else{
        result2="0"
      }
      res.render("../views/pages/adminprofile",{admin_name:req.session.employee_name,employee_details:result2,employee_id:req.session.employee_id});
    }
    else {
     
      res.send({status:"failed2"})
    }
   
  
  })
}else{
  res.redirect("/");
}
    


 }

 const JWT_SECRET = 'your_secret_key';
 

 exports.createNewPassword = async (req, res) => {
   const { id, token } = req.params;
    
 
   db.query("select employee_id,password,email from employees where employee_id ='" + id + "'", (err, result) => {
     if (!err) {
       if (result.length > 0) {
         const secret = JWT_SECRET + result[0].password;
         
         try {
           const payload = jwt.verify(token, secret);
           // Do something with the payload if needed
           
           // Send response to the client only after successful verification
           res.render("../views/pages/newpassword", { email: result[0].email,id:id,token:token });
         } catch (error) {
           console.log(error.message);
           //res.send("token has expired");
		res.send(`
<html lang="en">

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0px;
      padding: 0;
      background-color: #EDEDF5;
      font-family: 'Roboto', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    .box {
      width: 100%;
      max-width: 500px;
      background-color: white;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 5px 5px 8px 1px rgba(134, 134, 134, 0.5);
      text-align: center; /* Center-align text */
      display: flex;
      flex-direction: column;
      align-items: center; /* Align items to the start (left) */
    }

    .logo {
      max-width: 100px; /* Adjust the width as needed */
      height: auto;
      display: block;
      margin-bottom: 15px; /* Bottom margin for separation */
      align-self: flex-start; /* Align the logo to the left */
    }

    .center-image {
      margin: 0 auto 20px; /* Center the image horizontally with a bottom margin */
      height: 170px;
      width: 170px;
      display: block;
    }

    h5 {
      margin: 10px 0;
      font-size: 24px;
      font-weight: 700;
    }

    p {
      margin: 10px 0;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: 0.5px;
    }

    a {
      text-decoration: none;
    }

    button {
      background-color: #3bc0c3;
      border: none;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: 700;
      color: white;
      cursor: pointer;
      display: block;
      margin: 20px auto;
    }
  </style>
</head>

<body>
  <div class="box">
    <img src="https://hr.shiftwave.com/assets/images/logo.png" alt="logo" class="logo">
    <div>
      <img src="https://hr.shiftwave.com/assets/images/timeout.jpg" alt="mail" class="center-image">
    </div>
    <div>
      <h5>Your Session has Expired</h5>
      <p>Your session has expired due to your inactivity. No worry, simply login again.</p>
    </div>
    <a href="https://hr.shiftwave.com">
      <button>Log In</button>
    </a>
  </div>
</body>

</html>
`);
         }
       } else {
         res.send({ status: 'invalid_id' });
       }
     } else {
       res.send({ status: 'failed' });
     }
   });
 };

//  exports.createNewPassword = async(req,res)=>{

//   email=req.query.value;
//    
  
//   res.render("../views/pages/newpassword",{email:email})
  
  
//    }
exports.deleteEmployee = async(req,res)=>{

    let data=req.body;
     
   
    
    const employeeId = data.id;

// Convert the array to a string of comma-separated values
   
    const sqlQuery = `UPDATE employees SET user_status = 0 WHERE employee_id = ${employeeId}`

    db.query(sqlQuery,(err,result)=>{

      if (!err) {
        if (result.affectedRows > 0) {
          res.send({ status: "success", message: "Update successful" });
        } else {
          res.send({ status: "success", message: "No rows were updated" });
        }
      } else {
        res.send({ status: "error", message: "Failed to update" });
      }

    })
    
    
    
    
     }

 exports.updateEmployee = async (req, res) => {
   
      let data = req.body;
  
      var dateString = '14/01/1970';
      var parts = (data.joiningdate).split('/');
      var formatted_Date = parts[2] + '-' + parts[1] + '-' + parts[0];
    
      sql_query = `UPDATE employees SET 
      first_name='${data.Employee_fullname}',
      last_name='${data.Employee_lastname}',
      role='${data.role}',
      email='${data.email}',
      phone_number='${data.phoneNumber}',
      balanced_leaves='${data.balanced}',
      designation='${data.designation}',
      location='${data.location}',
      experience='${data.experience}',
      joining_date='${formatted_Date}',
      id=${data.Employee_id}
    WHERE  employee_id=${data.database_id}`;  
    
      db.query(sql_query, (err, result) => {
          if (!err) {
              if (result.affectedRows) {
                  res.send({ status: "Successfully Updated",data:data });
              } else {

                  res.send({ status: "Rows Not Affected" });
              }
          } else {
              res.send({ status: "failed7" ,error:err});
          }
      });
  };

 exports.filterPermissionHistoryByStatus = async (req, res) => {
  
    const status = req.query.value;
    if (req.session.employee_id && req.session.role == 'hr') {
      if (status == 'monthly') {
       sql_query ="SELECT p.permission_id,CONCAT(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e WHERE p.employee_id=e.employee_id AND  MONTH(DATE) = MONTH(CURDATE()) AND STATUS = 'approved' ORDER BY p.permission_id DESC ";
    }
 if (status == 'today') {

       sql_query = "SELECT p.permission_id,CONCAT(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e WHERE p.employee_id=e.employee_id and date=CURDATE() and status='approved'  ORDER BY p.permission_id DESC ";
      
   }
if(status != 'monthly' && status != 'today'){

 sql_query="SELECT p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' and STATUS='"+status+"' order by p.permission_id desc"

}
    
     
      
       
        db.query(sql_query,(err,result)=>{
          if (!err) {
            if (result.length > 0) {
           
              let str = result[0].status;
              modStr = str[0].toUpperCase() + str.slice(1) +" "+"Leaves";
              
            }else{
               
              result="0";
                modStr="No Leaves"
            }
   
            res.render('../views/pages/history',{admin_name :req.session.employee_name,permission_history:result,leave_type:modStr,value:status});
          }
            else {
              res.status(401).json({ status: "failed2" ,error:err});
            }

           
            
        })
      
   
  
    }else{
      res.redirect("/");
    }
  }

  exports.permissionReports = async (req, res) => {
  
    const status = req.query.value;
    if (req.session.employee_id && req.session.role == 'hr') {

      query="SELECT first_name,last_name  from employees where role='employee' and user_status=1"
      const data= await getDetails(query)
     
      
      res.render('../views/pages/permissionReports',{admin_name :req.session.employee_name,names:data})
      
      
   
  
    }else{
      res.redirect("/");
    }
  }

  exports.permissionFilter = async (req, res) => {
  
    data=req.body;
    
    
    let parts = data.startDate.split('/');
    let start_date = parts[2] + '-' + parts[1] + '-' + parts[0];
    let parts1=data.endDate.split('/');
   
    let end_date=parts1[2] + '-' + parts1[1] + '-' + parts1[0];
     
    sql_query2="SELECT p.employee_id,p.permission_id,CONCAT(first_name,' ',last_name) NAME,p.status,p.date,p.start_time,p.end_time,p.created_at FROM permissions p,employees e WHERE p.employee_id=e.employee_id and p.date >= '"+start_date+"' AND p.date <= '"+end_date+"'"
      // sql_query2=" SELECT lr.start_date,lr.end_date,lr.leave_type,lr.no_of_days,lr.status,concat(first_name,' ',last_name) name from leave_requests lr,employees e where lr.employee_id=e.employee_id and lr.start_date >= '"+start_date+"' AND lr.end_date <= '"+end_date+"' "
    
   
     if (data.status != '') {
     
     sql_query2=sql_query2+"and status ='"+data.status+"'"
   }if (data.name != '') {
     
     sql_query2=sql_query2+"and concat(e.first_name,' ',e.last_name) ='"+data.name+"'"
   }
   sql_query2=sql_query2+"ORDER by permission_id "
   

    db.query(sql_query2, (err2, result2) => {
     
               if (!err2) {
                 
                 if (result2.length > 0) {
         
                 }else{
         
                 }
           
                   res.send({status:"success",data:result2,query:sql_query2})
                 
               }
               else {
                
                 res.send({status:"failed2"})
               }
              
           
             })
   
  
    
  }

  async function getDetails(query) {
    return new Promise((resolve, reject) => {
      
      
      db.query(query, (err, result) => {
        if (!err && result.length > 0) {
          resolve(result);
        } else {
          console.log(err);
          reject(err);
        }
      });
    });
  
    
  }


  exports.getTemplate = async (req, res) => {
    
    res.render("../views/pages/emailsent")

  };