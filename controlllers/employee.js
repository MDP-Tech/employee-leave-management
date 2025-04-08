
const db = require("../config/connection");
const nodemailer = require('nodemailer');
const dns = require('dns')



function mailnotification(to, Heading, text, html,cc) {
  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'durga@shiftwave.com',
      pass: 'oezzplpoaaegusat'
    }
  });
  
  // Email configuration
  const mailOptions = {
    from: '"Support Shiftwave" <durga@shiftwave.com>',
    to: to,
    cc: `${cc}`,
    subject: `${Heading}`,
    text: `${text}`,
    html: html
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return "Not send mail Sucessfully";
    } else {
      return "send mail to hr";
    }
  });

}




exports.addNewEmployee = async (req, res) => {
  if (req.session.employee_id && req.session.role == 'hr') {

    query1 = "SELECT  designation  FROM `employees` GROUP by designation"
    query2 = "SELECT id,email FROM employees"
    result = await getdata(query1);
    ids = await getdata(query2);

    res.render("../views/pages/addemployee", { admin_name: req.session.employee_name, result: result, ids: ids })
  } else {
    res.redirect('/');
  }
}



exports.createEmployee = async (req, res) => {
  let data = req.body;
  let balances = data.balanced_leaves;
  var parts = (data.joiningdate).split('/');
  var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

  sql_query = "INSERT INTO employees(id,first_name, last_name,password, role, user_status, email, phone_number,balanced_leaves,designation,location,experience,joining_date ) VALUES ('" + data.employee_id + "','" + data.first_name + "','" + data.last_name + "','" + data.password + "','" + data.assign_role + "',1,'" + data.email + "','" + data.number + "','" + balances + "','" + data.designation + "','" + data.location + "','" + data.experience + "','" + formattedDate + "')"
  console.log("enter")
  console.log(req.session.role)
  console.log(req.session.employee_id)
  if (req.session.employee_id && req.session.role == 'hr') {
    db.query(sql_query, (err, result) => {
      if (!err) {
        res.status(200).json({ status: "successfully Created", data: data });
      }
      else {
        res.status(401).json({ status: "failed", query: sql_query, err: err });
      }
    })
  }else{
    res.send('Hi')
  }
}

// exports.createEmployee = async (req, res) => {
//   let data = req.body;
//   let balances = data.balanced_leaves;
//   var parts = (data.joiningdate).split('/');
//   var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
//   sql_query = "INSERT INTO employees(id,first_name, last_name,password, role, user_status, email, phone_number,balanced_leaves,designation,location,experience,joining_date ) VALUES ('" + data.employee_id + "','" + data.first_name + "','" + data.last_name + "','" + data.password + "','" + data.assign_role + "',1,'" + data.email + "','" + data.number + "','" + balances + "','" + data.designation + "','" + data.location + "','" + data.experience + "','" + formattedDate + "')"
//   db.query(sql_query, (err, result) => {
//     if (!err) {
//       res.status(200).json({ status: "successfully Created", data: data });
//     }
//     else {
//       res.status(401).json({ status: "failed", query: sql_query, err: err });
//     }
//   })
// }

exports.permission = async (req, res) => {
  let data = req.body;
  if (req.session.employee_id && req.session.role == 'employee') {
    sql_query = "select concat(first_name,' ',last_name) as name from employees WHERE employee_id='" + req.session.employee_id + "'";

    db.query(sql_query, (err, result) => {
      if (!err) {

        let employeename = result[0].name;
        res.render('../views/pages/employees/permission', { employee: employeename })

      } else {
        res.send({ status: "failed" })
      }
    }
    )

  } else {
    res.redirect('/');
  }





}
exports.createPermission = async (req, res) => {
  let data = req.body;
  const dateformat = data.date;
  let parts = dateformat.split('/'); // Split the date string
  let dateformated = `${parts[1]}/${parts[0]}/${parts[2]}`;
  const date = new Date(dateformated);
  const month = date.getMonth() + 1;
  const formattedStartTime = data.start_time.slice(0, 5); // Get first 5 characters (hh:mm)
  const formattedEndTime = data.end_time.slice(0, 5); // Get first 5 characters (hh:mm)
  // Fetch permissions of current month
  sql_query_month = "SELECT COUNT(p.permission_id) AS count FROM permissions p,employees e WHERE e.employee_id=p.employee_id and e.employee_id='" + req.session.employee_id + "' AND MONTH(p.date) ='" + month + "'";
  db.query(sql_query_month, (err1, result1) => {
    if (!err1) {
      const permission_count = result1[0].count;
      if (permission_count > 2) {
        res.send({ status: "Employees can apply for a maximum of 2 permissions per month.Your Maximum permissions reached for this month." });
      } else {
        // Proceed with weekly permission
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Get start of the week
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Get end of the week
        sql_query_week = `SELECT COUNT(p.permission_id) AS count FROM permissions p,employees e WHERE p.date >= '${startOfWeek.toISOString()}' AND p.date <= '${endOfWeek.toISOString()}' and e.employee_id='${req.session.employee_id}' and e.employee_id=p.employee_id `;

        db.query(sql_query_week, (err2, result2) => {
          if (!err2) {
            const permissionsThisWeek = result2[0].count;
            if (permissionsThisWeek >= 1) {
              res.send({ status: "Employees can only apply for 1 permission per week.Your Maximum permissions reached for this week." });
            } else {
              sql_query = "insert into permissions( employee_id,start_time,end_time,reason,date,created_at,updated_at ) values('" + req.session.employee_id + "','" + formattedStartTime + "','" + formattedEndTime + "','" + data.description + "',STR_TO_DATE('" + data.date + "','%d/%m/%Y'),now(),now())"

              db.query(sql_query, (err4, result) => {

                if (!err4) {

                  sql_query3 = "select email from employees  WHERE  employee_id ='" + req.session.employee_id + "'"
                  db.query(sql_query3, (err3, result3) => {

                    if (!err3) {
                      if (result3.length > 0) {


                      } else {
                        console.log("No details Found");
                      }

                      let description = data.description;
                      let to='durga@shiftwave.com';
                      let cc=''
                     
                     
                      // email=result3[0].email,
                      Heading = `Requesting for One Hour Permission-${req.session.employee_name}`

                      //     mailnotification(to,Heading,text,html)

                      // let mail_status= mailnotification(req,description,email,Heading);


                      let text = `Shiftwave HR`;

                      let html = `<body style="font-family: 'Roboto';">
          <div style="font-family: Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif; background: #f2f2f2; padding: 10px;">
                  <div style="max-width: 480px; margin: auto; background: #ffffff; padding:15px;">
                  <div align="center"><img src="https://hr.shiftwave.com/assets/images/logo.png" style="height: 30px;"></div>
                  <div style="margin-bottom: 0px;"><h6 style="font-size: 24px; text-align: center; color: #333333; padding: 8px;border-top: 1px solid #f2f2f2; margin-top: 15px;margin-bottom: 10px;font-family: 'Roboto';">Applied Permission Details</h6>				
                    <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                    Name
                      <div style="color: #333333;">${req.session.employee_name}</div>
                      </div>
                    <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                      Permission Date
                        <div style="color: #333333;">${data.date}</div>
                      </div>
                  
                  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                  Email
                  <div style="color: #333333; word-break: break-all;">${result3[0].email}</div>
                  </div>	
                      <div style="display: inline-block; width: 49%;">
                        <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                          Start Time
                          <div style="color: #333333; word-break: break-all;">${formattedStartTime}</div>
                        </div>
                      </div>
                      
                      <div style="display: inline-block; width: 50%;">
                        <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                          End Time
                          <div style="color: #333333; word-break: break-all;">${formattedEndTime}</div>
                        </div>
                      </div>
                        <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                          Reason For Permission
                          <div style="color: #333333; word-break: break-all;">${description} </div>
                          </div>
                      <button style="background-color: #3bc0c3;border: none;font-size: 14px;padding: 10px 20px;border-radius: 20px;font-weight: 700;  cursor: pointer;display: block;margin: 20px auto;text-decoration: none;"> <a href="https://hr.shiftwave.com/admin/employeeLeave-details?emp_id=${req.session.employee_id}&req_id=${result.insertId}" style="text-decoration: none; color: white;">Click here</a></button>
                </div>
                <div style="font-size: 14px; text-align: center; color: #6d6d6d; padding-top: 15px;">© 2024 Shiftwave. All rights reserved</div>
                  </div>
                  </body>`
                      let mail_status = mailnotification(to, Heading, text, html,cc);

                      res.status(200).json({ status: "suceesfully Created", message: mail_status });

                    } else {
                      res.status(401).json({ status: "failed3" });
                    }


                  })




                } else {



                  res.status(401).json({ status: "Not Created Sucessfully " });
                }


              })


            }
          } else {

            res.send({ status: "failed2" });
          }
        });
      }
    } else {

      res.send({ status: "failed1" });
    }
  });




}

exports.permissionHistory = async (req, res) => {
  let data = req.body;
  if (req.session.employee_id && req.session.role == 'employee') {
    sql_query = "SELECT admin_remark_permission,created_at,permission_id,date,start_time,end_time,reason,status from permissions where employee_id='" + req.session.employee_id + "'"
    if (data.permission_history == undefined) {
      sql_query = sql_query + "order by permissions.permission_id desc"
      db.query(sql_query, (err, result) => {
        if (!err) {
          if (result.length > 0) {

          } else {

            result = "0";
          }

          res.render('../views/pages/employees/permissionHistory', { employee: req.session.employee_name, permission_history: result, value: '' });

        } else {
          res.send({ status: "failed" })
        }
      }
      )

    } else {
      if (data.status == '') {
        sql_query = sql_query + " order by permissions.permission_id desc"
      } else {
        sql_query = sql_query + "and permissions.status='" + data.status + "' order by permissions.permission_id desc"
      }


      db.query(sql_query, (err, result) => {
        if (!err) {
          if (result.length > 0) {

          } else {
            // console.log("No Permissions Found");
          }


          res.send({ status: "sucess", data: result })
        } else {
          res.send({ status: "failed" })
        }
      }
      )

    }



  }
  else {

    res.redirect('/');
  }


}

exports.history = async (req, res) => {
  let data = req.body;
  let history = req.query.history;

  if (req.session.employee_id && req.session.role == 'hr') {

    if (data.status == undefined) {



      if (history == 'total') {


        sql_query = "SELECT p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' and STATUS='" + history + "' order by p.permission_id desc"
        // sql_query="SELECT p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' order by p.permission_id desc"

      } else {

        // sql_query="SELECT p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' and STATUS='"+history+"' order by p.permission_id desc"
        sql_query = "SELECT p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status,p.date FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' order by p.permission_id desc"
      }

      db.query(sql_query, (err, result) => {
        if (!err) {
          if (result.length > 0) {



            let str = result[0].status;
            modStr = str[0].toUpperCase() + str.slice(1) + " " + "Leaves";


          } else {

            result = "0";
            modStr = "No Leaves"
          }

          res.render('../views/pages/history', { admin_name: req.session.employee_name, permission_history: result, leave_type: modStr, value: '' });


        } else {
          res.send({ status: "failed1" })
        }
      }
      )
    } else {
      if (data.status == '') {

        sql_query = "SELECT p.date,p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' order by p.permission_id desc "

      } else {
        sql_query = "SELECT p.date,p.permission_id,concat(e.first_name,' ',e.last_name) as name,e.employee_id,p.created_at,p.status FROM permissions p,employees e where p.employee_id=e.employee_id and e.role='employee' and STATUS='" + data.status + "'  order by p.permission_id desc"
      }

      db.query(sql_query, (err, result) => {
        if (!err) {
          if (result.length > 0) {



            let str = result[0].status;
            modStr = str[0].toUpperCase() + str.slice(1) + " " + "Leaves";


          } else {

            result = "0";
            modStr = "No Leaves"
          }

          res.send({ status: 'sucess', data: result })

        } else {
          res.send({ status: "failed1" })
        }
      }
      )




    }






  } else {
    res.redirect('/');

  }
}


exports.dashboard = async (req, res) => {
  let yearly_leaves = 12;
  let month = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  if (req.session.employee_id && req.session.role == 'employee') {
    const sql_query = "SELECT COUNT(c1) AS c FROM ( SELECT COUNT(lr.start_date) c1  FROM leave_requests lr WHERE lr.employee_id = '" + req.session.employee_id + "'   AND MONTH(lr.start_date) <= MONTH(NOW()) AND YEAR(lr.start_date) <= YEAR(NOW())  and status='approved' GROUP BY MONTH(lr.start_date)) AS inner_query_alias";

    db.query(sql_query, async (err, result) => {
      if (!err) {
        if (result[0].c >= 0) {


          yearly_leaves = yearly_leaves;

          carry_forward_leaves = month - result[0].c;


        }

        query = "SELECT balanced_leaves FROM employees where employee_id='" + req.session.employee_id + "' "
        const leaves = await getDetails(query)
        const balanced_leaves = leaves[0].balanced_leaves;

        const p_count = await getCount('pending', req);
        const a_count = await getCount('approved', req);
        const d_count = await getCount('rejected', req);
        const permission_p_count = await getpermisisoncount('pending', req);
        const permission_a_count = await getpermisisoncount('approved', req);
        const permission_d_count = await getpermisisoncount('rejected', req);


        res.render('../views/pages/employees/dashboard', {
          employee: req.session.employee_name,
          yearly_leaves: yearly_leaves,
          pending_count: p_count,
          approved_count: a_count,
          declined_count: d_count,
          carry_forward_leaves: carry_forward_leaves,
          permission_p_count: permission_p_count,
          permission_a_count: permission_a_count,
          permission_d_count: permission_d_count, balanced_leaves: balanced_leaves


        });
      } else {

        res.send({ status: "failed1" });
      }
    });
  } else {
    res.redirect('/');
  }
};

async function getCount(type, req) {
  return new Promise((resolve, reject) => {
    const sql_query2 = "SELECT count(lr.request_id) pending_count FROM leave_requests lr where lr.employee_id='" + req.session.employee_id + "' and status='" + type + "'";
    db.query(sql_query2, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result[0].pending_count);
      } else {

        reject(err);
      }
    });
  });


}
async function getpermisisoncount(type, req) {
  return new Promise((resolve, reject) => {

    const sql_query2 = "SELECT count(permission_id) pending_count from permissions where employee_id='" + req.session.employee_id + "' and status='" + type + "' "
    db.query(sql_query2, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result[0].pending_count);
      } else {

        reject(err);
      }
    });
  });


}

async function getDetails(query) {
  return new Promise((resolve, reject) => {


    db.query(query, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result);
      } else {

        reject(err);
      }
    });
  });


}

exports.leaveDetails = async (req, res) => {

  let req_id = req.query.req_id;




  if (req.session.employee_id && req.session.role == 'employee') {


    if (typeof req_id != 'undefined') {
      sql_query = "SELECT e.*,lr.*,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and  lr.request_id='" + req_id + "';"


    }




    db.query(sql_query, (err, result) => {
      if (!err) {
        if (result.length > 0) {
          if (result[0].medical_document_required == 1) {
            sql_query2 = "SELECT md.* FROM leave_requests lr,medical_documents md where lr.request_id=md.request_id and lr.request_id='" + req_id + "' "

            db.query(sql_query2, (err2, result2) => {
              if (!err2) {

              }
              else {

                res.status(401).json({ status: "failed" });
              }
              res.render("../views/pages/employees/leaveDetails", { result: result, employee: req.session.employee_name, medical_document: result2, count: 3 })


            })

          } else if (result[0].leave_type == "Emergency/Medical" && result[0].medical_document_required == 0) {


            res.render("../views/pages/employees/leaveDetails", { result: result, employee: req.session.employee_name, count: 2 });
          } else {

            res.render("../views/pages/employees/leaveDetails", { result: result, employee: req.session.employee_name, count: 1 });
          }





        } else {
          res.send({ status: "no leaves found" })
        }



      }
      else {

        res.status(401).json({ status: "failed" });
      }

    })
  } else {
    res.redirect("/");
  }

};

exports.settings = async (req, res) => {

  let req_id = req.query.req_id;




  if (req.session.employee_id && req.session.role == 'employee') {

    sql_query2 = "SELECT concat(first_name,' ',last_name) name,password,email,last_name,phone_number,experience,designation from employees where employee_id='" + req.session.employee_id + "'"
    db.query(sql_query2, (err2, result2) => {
      if (!err2) {

        if (result2.length > 0) {

        } else {
          result2 = "0"
        }
        res.render("../views/pages/employees/employee-profile", { employee: req.session.employee_name, employee_details: result2, employee_id: req.session.employee_id });
      }
      else {

        res.send({ status: "failed2" })
      }


    })

  } else {
    res.redirect("/");
  }
}


exports.UpdatePassword = async (req, res) => {
  let data = req.body;
  email = data.email;
  const no_of_objects = Object.keys(data).length;


  sql_query2 = "UPDATE employees SET password='" + data.re_password + "' WHERE "

  if (no_of_objects == 3) {

    sql_query2 = sql_query2 + "email='" + data.email + "'"

  } else {
    sql_query2 = sql_query2 + "employee_id='" + req.session.employee_id + "'"
  }

  db.query(sql_query2, (err2, result2) => {
    if (!err2) {
      if (result2.affectedRows > 0) {

        res.send({ status: "Sucessfully Updated" });
      } else {

        res.send({ status: "Invalid email" });
      }


    }
    else {


      res.send({ status: "Password Not Updated Sucessfully", err2: err2 })
    }


  })


}

exports.permissionDetails = async (req, res) => {
  let permission_id = req.query.permission_id;
  if (req.session.employee_id) {
    sql_query2 = `SELECT 
    p.*,
    CONCAT(e.first_name, ' ', e.last_name) AS name,
    e.*,
    DATE_FORMAT(p.created_at, '%d/%m/%Y') AS formatted_created_at
FROM  
    permissions p,
    employees e 
WHERE 
    e.employee_id = p.employee_id 
    AND p.permission_id =  ${permission_id} `;

    // sql_query2="SELECT p.*,concat(e.first_name,' ',e.last_name) AS name,e.* FROM  permissions p,employees e WHERE e.employee_id = p.employee_id and  p.permission_id  = '"+ permission_id +"'"
    db.query(sql_query2, (err2, result2) => {
      if (!err2) {
        if (result2.length > 0) {
        } else {
          result2 = "0"
        }
        res.render("../views/pages/employees/permissionDetails", { employee: req.session.employee_name, permissionDetails: result2 });
      }
      else {
        res.send({ status: "failed2" })
      }
    })

  } else {
    res.redirect("/");
  }

}

exports.reportsFilter = async (req, res) => {

  data = req.body;

  let parts = data.startDate.split('/');
  let start_date = parts[2] + '-' + parts[1] + '-' + parts[0];
  let parts1 = data.endDate.split('/');

  let end_date = parts1[2] + '-' + parts1[1] + '-' + parts1[0];

  sql_query2 = "  SELECT start_date,end_date,leave_type,no_of_days,status FROM `leave_requests` WHERE employee_id='" + req.session.employee_id + "' and  start_date >= '" + start_date + "' AND end_date <= '" + end_date + "' "


  if (data.status != '') {

    sql_query2 = sql_query2 + "and status ='" + data.status + "'"
  }

  sql_query2 = sql_query2 + "ORDER by request_id "

  db.query(sql_query2, (err2, result2) => {

    if (!err2) {

      if (result2.length > 0) {


      } else {

      }

      res.send({ status: "success", data: result2 })

    }
    else {

      res.send({ status: "failed2" })
    }


  })


}



exports.getReportsPage = async (req, res) => {

  if (req.session.employee_id && req.session.role == 'hr') {

    sql_query2 = "SELECT first_name,last_name  from employees where role='employee' and user_status=1"
    db.query(sql_query2, (err2, result2) => {

      if (!err2) {

        if (result2.length > 0) {


        } else {

        }
        res.render("../views/pages/adminReports", { admin_name: req.session.employee_name, names: result2 });


      }
      else {

        res.send({ status: "failed2" })
      }


    })






  } else {
    res.redirect("/");
  }

}


exports.adminReportsFilter = async (req, res) => {

  data = req.body;



  let parts = data.startDate.split('/');
  let start_date = parts[2] + '-' + parts[1] + '-' + parts[0];
  let parts1 = data.endDate.split('/');

  let end_date = parts1[2] + '-' + parts1[1] + '-' + parts1[0];

  sql_query2 = " SELECT lr.created_at,e.employee_id,lr.request_id,lr.start_date,lr.end_date,lr.leave_type,lr.no_of_days,lr.status,concat(first_name,' ',last_name) name from leave_requests lr,employees e where lr.employee_id=e.employee_id and lr.start_date >= '" + start_date + "' AND lr.end_date <= '" + end_date + "' "


  if (data.status != '') {

    sql_query2 = sql_query2 + "and status ='" + data.status + "'"
  } if (data.name != '') {

    sql_query2 = sql_query2 + "and concat(e.first_name,' ',e.last_name) ='" + data.name + "'"
  }
  sql_query2 = sql_query2 + "ORDER by request_id "



  db.query(sql_query2, (err2, result2) => {

    if (!err2) {

      if (result2.length > 0) {


      } else {

      }

      res.send({ status: "success", data: result2 })

    }
    else {

      res.send({ status: "failed2" })
    }


  })


}

exports.getEmployess = async (req, res) => {
  if (req.session.employee_id && req.session.role == 'hr') {
    sql_query2 = "SELECT * FROM employees where user_status=1 ORDER BY created_at DESC";

    db.query(sql_query2, async (err2, result2) => {
      if (!err2) {
        if (result2.length > 0) {
          // Do something with result2 if needed
        } else {
          // Handle case when result2 is empty
        }

        query1 = "SELECT designation FROM `employees` GROUP by designation";

        try {
          result3 = await getdata(query1);

          res.render("../views/pages/employeeList", { admin_name: req.session.employee_name, employee_data: result2, result: result2, designations: result3 });
        } catch (error) {
          res.send({ status: error.message });
        }
      } else {
        res.send({ status: err2 });
      }
    });
  } else {
    res.redirect("/");
  }
};

exports.filterLeavesHistoryByStatus = async (req, res) => {

  const status = req.query.value;

  if (req.session.employee_id) {
    sql_query = "SELECT lr.admin_remark,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.employee_id='" + req.session.employee_id + "' and lr.status='" + status + "' order by lr.request_id desc "


    db.query(sql_query, (err, result) => {
      if (!err) {


        res.render("../views/pages/employees/leavehistory", { leaves_history: result, employee: req.session.employee_name, value: status })
      }
      else {
        res.status(401).json({ status: "failed2", error: err });
      }



    })



  } else {
    res.redirect("/");
  }
}

exports.filterPermissionsHistoryByStatus = async (req, res) => {
  const status = req.query.value;
  if (req.session.employee_id && req.session.role == 'employee') {
    sql_query = "SELECT admin_remark_permission,created_at,permission_id,date,start_time,end_time,reason,status from permissions where employee_id='" + req.session.employee_id + "' and status='" + status + "'order by permissions.permission_id desc"
    db.query(sql_query, (err, result) => {
      if (!err) {
        if (result.length > 0) {

        } else {
          result = "0";
        }
        res.render('../views/pages/employees/permissionHistory', { employee: req.session.employee_name, permission_history: result, value: status });
      } else {
        res.status(401).json({ status: "failed2", error: err });
      }
    })
  } else {
    res.redirect('/');
  }
}

exports.employeesDeletedList = async (req, res) => {
  if (req.session.employee_id && req.session.role == 'hr') {
    sql_query2 = "SELECT * FROM employees where user_status=0 ORDER BY created_at DESC";
    db.query(sql_query2, async (err2, result2) => {
      if (!err2) {
        if (result2.length > 0) {

        } else {

        }

        query1 = "SELECT designation FROM `employees` GROUP by designation";

        try {
          result3 = await getdata(query1);

          res.render("../views/pages/deletedEmployeeList", { admin_name: req.session.employee_name, employee_data: result2, result: result2, designations: result3 });
        } catch (error) {
          res.send({ status: error.message });
        }
      } else {
        res.send({ status: err2 });
      }
    });
  } else {
    res.redirect("/");
  }
};

async function getdata(query1) {
  return new Promise((resolve, reject) => {



    db.query(query1, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result);
      } else {


        reject(err);
      }
    });
  });


}