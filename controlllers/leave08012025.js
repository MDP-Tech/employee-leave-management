const db = require("../config/connection");
const nodemailer=require('nodemailer');
const formidable = require('formidable');
const path = require('path');
const express = require("express");
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { getDate, getMonth, getYear } = require("date-fns");

function mailnotification(to,Heading,text,html,carboncopy) {

 // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreply@shiftwave.com',
     pass: 'jwicjugkxafwwtrp'
   
    }
  });

  // Email configuration
  const mailOptions = {
    from: '"Support Shiftwave" <noreply@shiftwave.com>',
    to: to,
    cc: `${carboncopy}`,
    subject: `${Heading}`,
    text: `${text}`,
    html:html
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return "Not send mail Sucessfully";
      // res.json({ success: false, status: "Not send mail Sucessfully " });
    } else {
      return "send mail to hr";
      // res.json({ success: true, status: "suceesfully Created" });
    }
  });

}

exports.uploadFile = function(req, res, next) {
  let data = req.body;
  
  let fileLength = data.filelength;
  var intValue = parseInt(fileLength, 10);
 
  let Count = 0;
  let documents = [];
  var filenames = data.filenames.split(',');  

  let query1 = '';
  if (data.leaveDetails === 'formDetails' || data.leaveDetails == 'leaveDetails') {
    query1 = `SELECT count(*) as total
              FROM leave_requests
              WHERE employee_id =${req.session.employee_id}
              AND (
                (STR_TO_DATE('${data.start_date}', '%d/%m/%Y') BETWEEN start_date AND end_date)
                OR
                (STR_TO_DATE('${data.end_date}', '%d/%m/%Y') BETWEEN start_date AND end_date)
                OR
                (STR_TO_DATE('${data.start_date}', '%d/%m/%Y') <= start_date AND STR_TO_DATE('${data.end_date}', '%d/%m/%Y') >= end_date)
              );`;

    db.query(query1, (err5, result5) => {
      if (!err5) {
        if (result5[0].total > 0) {
          
          return res.status(200).json({ status: "Already leave applied in this date range" });
        }else{
            if (data.leaveDetails === 'leaveDetails') {     
    const sql_query = `UPDATE leave_requests SET medical_document_required = 1 WHERE request_id = '${req.body.req_id.trim()}'`;
     db.query(sql_query, (err5, result5) => {
      if (!err5) {
        for (let i = 0; i < intValue; i++) {
        const firstFilename = filenames[i];
        const url_d = `${firstFilename}`;
        documents.push(url_d);
        const sql_query6 = `INSERT INTO medical_documents (request_id, document_url) VALUES ('${req.body.req_id.trim()}', '${url_d}')`;
        db.query(sql_query6, (err6, result6) => {
          if (!err6) {
            Count++;
            if (Count === filenames.length) {
              res.status(200).json({ status: 'Successfully created', documentURL: documents });
            }
          } else {
            res.status(500).json({ status: 'Failed to update medical_document_required' });
          }
        });
      }

      } else {
        res.status(500).json({ status: 'Failed to update medical_document_required' });
      }
    });
  }else { 
    
    if (data.calculatedDays.includes('.')) {
      let halfday = data.calculatedDays.split('+');
      let halfDayPart = halfday[1]; // Take the part after '+'
               sql_query = `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, Description, medical_document_required, no_of_days,half_day_leave,refresh_date) VALUES ('${req.session.employee_id}', '${data.leave_type}', STR_TO_DATE('${data.start_date}', '%d/%m/%Y'), STR_TO_DATE('${data.end_date}', '%d/%m/%Y'), '${data.description}', 1, '${halfday[0]}','${halfday[1]}',now())`


    
    }else{
             sql_query = `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, Description, medical_document_required, no_of_days,refresh_date) VALUES ('${req.session.employee_id}', '${data.leave_type}', STR_TO_DATE('${data.start_date}', '%d/%m/%Y'), STR_TO_DATE('${data.end_date}', '%d/%m/%Y'), '${data.description}', 1, '${data.calculatedDays}',now())`

    }	
db.query(sql_query, (err, result) => {
      if (!err) {

        for (let i = 0; i < intValue; i++) {
        const sql_query2 = `SELECT request_id FROM leave_requests WHERE employee_id='${req.session.employee_id}' ORDER BY request_id DESC LIMIT 1;`;
        db.query(sql_query2, (err2, result2) => {
          if (!err2 && result2.length > 0) {
            const firstFilename = filenames[i];               
            const url = `${firstFilename}`;
            const insertQuery = `INSERT INTO medical_documents (request_id, document_url) VALUES (${result2[0].request_id}, '${url}');`;
            db.query(insertQuery, (err3, result3) => {
              if (!err3) {
                db.query("SELECT email, CONCAT(first_name, ' ', last_name) AS name FROM `employees` WHERE employee_id = '" + req.session.employee_id + "' ", (err1, result1) => {
                  if (!err1) {
                    if (result1.length > 0) {
                      let email = result1[0].email;
                      let days = 0;
                      let mail_status = mailnotification(req, "description", email, days);
                     Count++;
                     if (Count === filenames.length) {
                      res.status(200).json({ status: 'Successfully created', mail_status: mail_status, documentURL: url });
                    }
                    } else {
                      res.status(401).json({ status: 'No Mail found' });
                    }
                  } else {
                    
                    res.status(401).json({ status: 'Failed3',error:err1 });
                  }
                });
              } else {
                res.status(401).json({ status: 'Failed2' ,err:err3});
              }
            });
          } else {
            res.status(401).json({ status: 'No request_ids' });
          }
        });
      }
      } else {
       
        console.log("ji")
		console.log(err)
        res.status(401).json({ status: 'Failed1',err:err });
      }
    });
  }
        }
      } else {
        return res.status(500).json({ status: "Error in query1" });
      }

      
    });
  }

};


exports.createLeave = async (req, res) => {
 

  let data = req.body;
  const no_of_objects = Object.keys(data).length;
  let query1 = "";
  if (data.leave_type == "Half-Day") {
     
      query1 = `
  SELECT COUNT(*) AS total 
  FROM leave_requests
  WHERE employee_id = ${req.session.employee_id}
  AND (
    (STR_TO_DATE('${data.start_date}', '%d/%m/%Y') BETWEEN start_date AND end_date)
    OR
    (half_day_leave = '${data.session}' AND STR_TO_DATE('${data.start_date}', '%d/%m/%Y') = start_date)
  );`;
  } else {
     
      query1 = `SELECT count(*) as total
      FROM leave_requests
      WHERE employee_id =${req.session.employee_id}
          AND (
          (STR_TO_DATE('${data.start_date}', '%d/%m/%Y') BETWEEN start_date AND end_date)
          OR
          (STR_TO_DATE('${data.end_date}', '%d/%m/%Y') BETWEEN start_date AND end_date)
          OR
          (STR_TO_DATE('${data.start_date}', '%d/%m/%Y') <= start_date AND STR_TO_DATE('${data.end_date}', '%d/%m/%Y') >= end_date)
      );`;
  }

  db.query(query1, (err5, result5) => {
      if (!err5) {
          if (result5[0].total > 0) {
             

              res.status(200).json({ status: "Already leave applied in this date range" });
          } else {
            
              // Escape single quotes in description
              let description = data.description.replace(/'/g, "''");

              if (no_of_objects == 6) {
                  
                sql_query =
                    "INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, Description,half_day_leave,no_of_days,refresh_date,created_at,updated_at) VALUES ('" +
                    req.session.employee_id +
                    "', '" +
                    data.leave_type +
                    "', STR_TO_DATE('" +
                    data.start_date +
                    "', '%d/%m/%Y'), STR_TO_DATE('" +
                    data.end_date +
                    "','%d/%m/%Y'),'" +
                    description +
                    "','" +
                    data.session +
                    "',0.5,now(),now(),now())";
                   
            } else {
               
                if (data.calculatedDays.includes(".")) {
                    let halfday = data.calculatedDays.split("+");
                    let halfDayPart = halfday[1];
                    sql_query =
                        "INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, Description, no_of_days, half_day_leave,refresh_date,created_at,updated_at) VALUES ('" +
                        req.session.employee_id +
                        "', '" +
                        data.leave_type +
                        "', STR_TO_DATE('" +
                        data.start_date +
                        "', '%d/%m/%Y'), STR_TO_DATE('" +
                        data.end_date +
                        "','%d/%m/%Y'),'" +
                        description +
                        "','" +
                        halfday[0] +
                        "','" +
                        halfDayPart +
                        "',now(),now(),now())";
                       
                } else {
                    
                    sql_query =
                        "INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, Description,no_of_days,refresh_date,created_at,updated_at) VALUES ('" +
                        req.session.employee_id +
                        "', '" +
                        data.leave_type +
                        "', STR_TO_DATE('" +
                        data.start_date +
                        "', '%d/%m/%Y'), STR_TO_DATE('" +
                        data.end_date +
                        "','%d/%m/%Y'),'" +
                        description +
                        "','" +
                        data.calculatedDays +
                        "',now(),now(),now())";
                       
                }
            }
              
              db.query(sql_query, (err, result) => {
                  if (!err) {
                     
                      db.query("SELECT email,concat(first_name,' ',last_name) as name FROM `employees` where employee_id='" + req.session.employee_id + "'  ", (err1, result1) => {
                          if (!err1) {
                            
                              if (result1.length > 0) {
                                  //  let to=result1[0].email;
                                  let to = "ops@shiftwave.com";

                                  let carboncopy = "";

                                  if (data.leave_type == "Half-Day") {
                                      days = "0.5";
                                  } else {
                                      if (data.calculatedDays.includes("+")) {
                                          var parts = data.calculatedDays.split("+");
                                          var days = parts[0];
                                      } else {
                                          var days = data.calculatedDays;
                                      }
                                  }

                                  let description = data.description;
                                  if (data.session) {
                                      session = "/ " + data.session;
                                  } else {
                                      session = "";
                                  }
                                  // let days = data.calculatedDays;
                                  let text = `Shiftwave HR`;
                                  let Heading = `Request For Leave From ${req.session.employee_name} -(${days}) Days`;
                                  let html = `<body style="font-family: Arial,sans-serif;">
                                    <div style="font-family: Arial,sans-serif; background: #f2f2f2; padding: 10px;">
                                      <div style="max-width: 480px; margin: auto; background: #ffffff; padding:15px;">
                                        <div align="center"><img src="https://hr.shiftwave.com/assets/images/logo.png" style="height: 30px;"></div>
                                        <div style="margin-bottom: 0px;"><h6 style="font-size: 24px; text-align: center; color: #333333; padding: 8px;border-top: 1px solid #f2f2f2; margin-top: 15px;margin-bottom: 10px;font-family: 'Roboto';">Applied Leave Details</h6>				
                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          Name
                                          <div style="color: #333333;">${req.session.employee_name}</div>
                                          </div>

                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          Email
                                          <div style="color: #333333; word-break: break-all;">${result1[0].email}</div>
                                          </div>

                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          Start Date
                                          <div style="color: #333333; word-break: break-all;">${data.start_date}</div>
                                          </div>

                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          End Date
                                          <div style="color: #333333; word-break: break-all;">${data.end_date}</div>
                                          </div>
                                          
                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          Leave Type
                                          <div style="color: #333333; word-break: break-all;">${data.leave_type}  ${session}</div>
                                          </div>
                                          
                                          <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                                          Reason For Leave
                                          <div style="color: #333333; word-break: break-all;">${description} </div>
                                          </div>  
                                          
                                          <button style="background-color: #3bc0c3;border: none;font-size: 14px;padding: 10px 20px;border-radius: 20px;font-weight: 700;color: white; display: block;margin: 20px auto;text-decoration: none;"><a href="https://hr.shiftwave.com/admin/employeeLeave-details?emp_id=${req.session.employee_id}&req_id=${result.insertId}" style="text-decoration: none;color: white;">Click here</a></button>
                                          
                                        </div>
                                        <div style="font-size: 14px; text-align: center; color: #6d6d6d; padding-top: 15px;">© 2024 Shiftwave. All rights reserved</div>
                                      </div>
                                    </div>
                                  </body>`;
                                  let mail_status = mailnotification(to, Heading, text, html, carboncopy);
                                  res.status(200).json({ status: "suceesfully Created", mail_status: mail_status });
                              } else {
                                  res.status(401).json({ status: "No Mail found" });
                              }
                          } else {
                            
                              res.status(401).json({ status: "failed" });
                          }
                      });
                  } else {
                      res.status(401).json({ status: "Leave creation failed" });
                  }
              });
          }
      } else {
          res.status(401).json({ status: "SQL error" });
      }
  });
};


exports.employees = async (req, res) => {

  sql_query = "SELECT e.user_status,e.Date_Of_Joining	,e.Department,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,lr.employee_id,concat(e.first_name,' ',e.last_name) as fullname,leave_purpose FROM leave_requests lr,employees e where e.employee_id=lr.employee_id"


  db.query(sql_query, (err, result) => {
    if (!err) {


      res.render("../views/pages/employees", { result: result });
    }
    else {
      res.status(401).json({ status: "failed" });
    }
  })


};
exports.employeeLeavedetails = async (req, res) => {

  let req_id = req.query.req_id;

  let permission_id = req.query.permission_id;
 
if (req.session.employee_id && req.session.role == 'hr') {
  
if (typeof req_id != 'undefined') {
  // sql_query = " SELECT e.*,lr.*,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and lr.request_id='"+req_id+"'"
  sql_query="SELECT e.*,lr.*,concat(e.first_name,' ',e.last_name) as fullname,GROUP_CONCAT(md.document_url SEPARATOR ', ') AS document_urls FROM leave_requests lr,employees e,medical_documents md where e.employee_id=lr.employee_id  and lr.request_id=md.request_id and lr.request_id='"+req_id+"' group by e.employee_id "
  id=1;
  db.query(sql_query, (err, result) => {
    if (!err) {
      if (result.length > 0) {

        
        res.render("../views/pages/employeeLeaveDetails", { result: result,admin_name:req.session.employee_name,id:id,url:1 })
      }else{


        sql_query2 = " SELECT e.*,lr.*,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and lr.request_id='"+req_id+"'"
        db.query(sql_query2, (err2, result2) => {
                if (!err2) {
      
                  res.render("../views/pages/employeeLeaveDetails", { result: result2,admin_name:req.session.employee_name,id:id,url:0 })
                }
                else {
                 
                  res.status(401).json({ status: "failed4" });
                }
            
              })

      }
        
      
 

      
    }
    else {
     
      res.status(401).json({ status: "failed5" });
    }

  })
}else{

  sql_query =" SELECT concat(e.first_name,' ',e.last_name) as fullname,e.*,p.* FROM permissions p,employees e where e.employee_id=p.employee_id and p.permission_id='"+permission_id+"'"
   id=2;

   db.query(sql_query, (err, result) => {
    if (!err) {    
      res.render("../views/pages/employeeLeaveDetails", { result: result,admin_name:req.session.employee_name,id:id })
    }
    else {
     
      res.status(401).json({ status: "failed" });
    }

  })
}

 


}else{
  res.redirect("/");
}

};

exports.updateLeaveStatus = async (req, res) => {
  let data = req.body;
  let req_id = (data.request_id).trim();
  let id = parseInt(req_id, 10);
  let description = data.description.replace(/'/g, "''"); 
 
  if ( req_id != '') {
    sql_query="UPDATE leave_requests  SET status = '" + data.status + "',admin_remark='" + description + "',admin_remark_date=now() WHERE request_id = '" + id + "' "
 
    if (data.mail_status == 'Approved') {
      Heading = `Leave Approved to ${data.employee_name}-(${data.days}) Days`;
      carboncopy = 'saai@shiftwave.com,shiva@shiftwave.com'
  }else{
      Heading = `Leave Declined to ${data.employee_name}-(${data.days}) Days`;
      carboncopy = ''
  }
  permission_html= ''
  }else{
    let permission_id = (data.permission_id).trim();
   
  let per_id = parseInt(permission_id, 10)
  
    sql_query="UPDATE permissions  SET status = '" + data.status + "',admin_remark_permission='" + description + "',admin_remark_date_permission=now() WHERE permission_id = '" + per_id + "' "
    Heading=`Permission approved to ${data.employee_name}`
    carboncopy = 'saai@shiftwave.com,shiva@shiftwave.com'
    permission_html = `
    <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
        Permission Date
        <div style="color: #333333;">${data.permission_date}</div>
    </div>`;
  }
  db.query(sql_query, (err, result) => {
    if (!err) {
		     let to=data.email;
         
          let text = `Shiftwave HR`;
          let html = `<body style="font-family: Arial,sans-serif;">
          <div style="font-family: Arial,sans-serif; background: #f2f2f2; padding: 10px;">
                  <div style="max-width: 480px; margin: auto; background: #ffffff; padding:15px;">
                  <div align="center"><img src="https://hr.shiftwave.com/assets/images/logo.png" style="height: 30px;"></div>
                  <div style="margin-bottom: 0px;"><h6 style="font-size: 24px; text-align: center; color: #333333; padding: 8px;border-top: 1px solid #f2f2f2; margin-top: 15px;margin-bottom: 10px;font-family: 'Roboto';">Approval Request</h6>				
                    <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                    Status
                      <div style="color: #333333;">${data.mail_status}</div> </div>
                       ${permission_html} <!-- Append permission HTML here -->
                      <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                      From
                      <div style="color: #333333;">${data.from_date}</div> </div>
                       <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                      To
                      <div style="color: #333333;">${data.to_date}</div> </div>
                      <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                          Reason For Leave/Permission:
                          <div style="color: #333333; word-break: break-all;">${data.leave_description} </div>
                          </div>

                        <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
                          Comments
                          <div style="color: #333333; word-break: break-all;">${data.description} </div>
                          </div>
                </div>
                <div style="font-size: 14px; text-align: center; color: #6d6d6d; padding-top: 15px;">© 2024 Shiftwave. All rights reserved</div>
                  </div>
                  </body>`;
          mailnotification(to,Heading,text,html,carboncopy);          
          res.status(200).json({
            status: "success",
            message: " upadate successfully",
          });
    
    } else {
      res.status(401).json({ status: "failed" });
    }


  })

}

exports.leave = async (req, res) => {
  if (req.session.employee_id && req.session.role == 'employee') {

    db.query("SELECT employee_id,concat(first_name,' ',last_name) as name FROM `employees` WHERE employee_id='" + req.session.employee_id + "' ", (err2, result2) => {


      if (!err2) {
        if (result2.length >= 0) {

          result2 = result2[0].name;
  

        } else {
          result2 = "No employees Found";
        }

        res.render("../views/pages/leave", {  employee: result2 })

      }
      else {
        res.status(401).json({ status: "failed2" });
      }

    })
  }
  else {

    res.redirect("/");
  }


}

exports.leaveHistory = async (req, res) => {

  let data=req.body;


  if (req.session.employee_id && req.session.role == 'employee') {
  

    sql_query = "select concat(first_name,' ',last_name) as name from employees WHERE employee_id='" + req.session.employee_id + "'";
  
    db.query(sql_query, (err, result) => {
      if (!err) {

        let employeename = result[0].name;
        if (data.leavehistory == undefined) {
         
          sql_query1= "SELECT lr.admin_remark,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.employee_id='" + req.session.employee_id + "' order by lr.request_id desc "
          db.query(sql_query1, (err1, result1) => {

            if (!err1) {
              if (result1.length > 0) {
  
              } else {
                result1 = "0";           
              }
  
              res.render("../views/pages/employees/leavehistory", { employee: employeename, leaves_history: result1,value:'' })
            } else {
  
            
              res.status(401).json({ status: "failed1" });
              
            }
  
          })
        }
        else{

          if (data.status == '') {
            sql_query1= "SELECT lr.admin_remark,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.employee_id='" + req.session.employee_id + "'  order by lr.request_id desc "

          }else{
            sql_query1= "SELECT lr.admin_remark,e.employee_id,lr.request_id,lr.leave_type,lr.Description,lr.start_date,lr.end_date,lr.created_at,lr.status,concat(e.first_name,' ',e.last_name) as fullname FROM leave_requests lr,employees e where e.employee_id=lr.employee_id and e.employee_id='" + req.session.employee_id + "' and lr.status='"+data.status+"' order by lr.request_id desc "

          }
          
         
           db.query(sql_query1, (err1, result1) => {

            if (!err1) {
              if (result1.length > 0) {        
              } else {
              }

              res.send({status:"sucess",data:result1})
  
            } else {
  
            
              res.status(401).json({ status: "failed2" });
              
            }
  
          })
       
          }
        




      }
      else {
        res.status(401).json({ status: "failed" });
      }

    })
  } else {
    res.redirect("/");
  }

}


exports.getEmployeesList = async (req, res) => {

  if (req.session.employee_id) {

  query= "SELECT email,employee_id from employees"
  result= await getDetails(query)
   res.render('../views/pages/employeeList',{admin_name:res.session.employee_id,result:result})
  }
  else {
    res.redirect("/");
  }


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

const JWT_SECRET = 'your_secret_key';
exports.passwordMail= async(req,res)=>{
  let data = req.body;
  let to = data.email;
  let currentTime = new Date();
  let currentMonth = currentTime.getMonth() + 1;
  let currentDate = getDate(new Date ()) + `-` + currentMonth  + `-` +getYear(new Date ());
  Heading=`Shiftwave HR Notifcation ${currentDate} `
  text= 'Shiftwave';  
  const directoryPath = __dirname;
  const fileName = 'forgotPassword.html';
  const filePath = path.join(directoryPath, fileName);
  if (fs.existsSync(filePath)) {
    console.log(`File exists at ${filePath}`);
  } else {
    console.log(`File does not exist at ${filePath}`);
  }
   const html = fs.readFileSync(filePath, 'utf8');
      interval = 2* 60 * 1000
      db.query("select email,employee_id,password from employees where email='"+data.email+"' AND user_status=1",(err,result)=>{
                if (!err) {               
                if (result.length == 1) { 
                  const secret=JWT_SECRET + result[0].password;
                  const payload={
                    email:result[0].email,
                    id:result[0].employee_id
                  }
                  const token= jwt.sign(payload,secret,{expiresIn:'20m'})
                  let link =`https://hr.shiftwave.com/create-new-password/${result[0].employee_id}/${token}`
                  const renderedHtml = html.replace('{{link}}', link);
                  mailnotification(to,Heading,text,renderedHtml,interval);
                  res.send({status:"Success"})
                }else{
                res.send({status:"Email not found"});
                }  
              }else{
                res.send({status:"failed"});
              }
      })
}

exports.employeeDetails = async (req, res) => {
  let emp_id = req.query.emp_id;
  if (req.session.employee_id) {

  query= `SELECT * from employees where employee_id=${emp_id}`
  query1=`SELECT COUNT(request_id) AS count
         FROM leave_requests lr
        WHERE lr.employee_id = ${emp_id}
        AND lr.start_date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                        AND DATE_FORMAT(CURDATE(), '%Y-%m-07')
        AND lr.end_date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                      AND DATE_FORMAT(CURDATE(), '%Y-%m-07') `
                      
  query2=query1+` and lr.status='approved'`
  // query3="SELECT COUNT(request_id) AS count FROM leave_requests lr WHERE  lr.employee_id=10 and lr.status='pending'"
  query3=query1+` and lr.status='pending'`
  // query4="SELECT COUNT(request_id) AS count FROM leave_requests lr WHERE  lr.employee_id=10 and lr.status='rejected'"
  query4=query1+` and lr.status='rejected'`
  query5=query1+` and lr.status= 'approved' and lr.leave_type='Emergency/Medical'`
  query6 = `SELECT lr.employee_id,lr.request_id,CONCAT(e.first_name,' ',e.last_name) fullname,lr.leave_type,DATE_FORMAT(lr.start_date, '%d/%m/%y') AS start_date,DATE_FORMAT(lr.end_date, '%d/%m/%y') AS end_date,DATE_FORMAT(lr.created_at, '%d/%m/%y') AS created_at,lr.status
              FROM leave_requests lr,employees e
            WHERE e.employee_id=lr.employee_id AND  lr.employee_id = ${emp_id}
            AND lr.start_date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                            AND DATE_FORMAT(CURDATE(), '%Y-%m-07')
            AND lr.end_date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                          AND DATE_FORMAT(CURDATE(), '%Y-%m-07')`
  query7= `SELECT COUNT(permission_id) AS count
                      FROM  permissions p
                      WHERE p.employee_id = ${emp_id}
                      AND p.date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                      AND DATE_FORMAT(CURDATE(), '%Y-%m-07')`
  query8= query7 + ` and p.status='approved' `
  query9= query7 + `  and p.status= 'pending' `
  query10 =query7+ `  and p.status = 'rejected'`
  query11 = `SELECT p.date,p.employee_id,p.permission_id,CONCAT(e.first_name,' ',e.last_name) fullname,DATE_FORMAT(p.date, '%d/%m/%y') AS DATE,p.start_time,p.end_time,DATE_FORMAT(p.created_at, '%d/%m/%y') AS created_at,p.status
  FROM permissions p,employees e    WHERE e.employee_id=p.employee_id AND  p.employee_id = ${emp_id}  
   AND p.date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-07')
                AND DATE_FORMAT(CURDATE(), '%Y-%m-07')`
  result= await Details(query);
  total_leaves=await getCount(query1);
  approved_leaves= await getCount(query2);
  pending_leaves = await getCount(query3);
  declined_leaves = await getCount(query4);
  emergency_leaves =await getCount(query5);
  leave_details= await Details(query6);
  permission_details = await Details(query11)
  total_permissions = await getCount(query7)
  approved_permissions = await getCount(query8);
  pending_permissions =await getCount(query9);
  declined_permissions= await getCount(query10);
  
 

  query12= "SELECT email,employee_id from employees"
  result12= await Details(query12);
 query13="select email,id from employees"
  ids=await Details(query13);


 
   
   res.render('../views/pages/employeeDetails',{admin_name:req.session.employee_name,
                                                result:result,
                                                result1:total_leaves,
                                                result2:approved_leaves,
                                                result3:pending_leaves,
                                                result4:declined_leaves,
                                                result5:emergency_leaves,
                                                result6:leave_details,
                                                result11:permission_details,
                                                result7:total_permissions,
                                                result8:approved_permissions,
                                                result9:pending_permissions,
                                                result10:declined_permissions,
                                                result12:result12,ids:ids

                                              })
  }
  else {
    res.redirect("/");
  }


}

async function Details(query) {
  return new Promise((resolve, reject) => {
    
    
    db.query(query, (err, result) => {
      if (!err ) {
        if (result.length > 0) {
          
          resolve(result)
        }
        resolve(result)
        
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

async function getCount(query) {
  return new Promise((resolve, reject) => {
     db.query(query, (err, result) => {
      if (!err && result.length > 0) {
        resolve(result[0].count);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });

  
}

exports.filterDetailsByStatus = async(req,res)=>{

data=req.body;
if (data.leavehistory == 1) {
  startDate = (data.startDate).split('/');
  endDate =  (data.endDate).split('/');
  formatedstartDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
  formatedendDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
  query1=" SELECT lr.employee_id,lr.request_id,CONCAT(e.first_name, ' ', e.last_name) AS fullname,lr.leave_type,DATE_FORMAT(lr.start_date, '%m/%d/%Y') AS start_date,DATE_FORMAT(lr.end_date, '%m/%d/%Y') AS end_date,lr.created_at AS created_at,lr.status FROM leave_requests lr INNER JOIN employees e ON e.employee_id = lr.employee_id WHERE lr.employee_id = '"+data.emp_id+"' AND DATE_FORMAT(lr.start_date, '%m/%d/%Y') BETWEEN '"+formatedstartDate+"' AND '"+formatedendDate+"' AND DATE_FORMAT(lr.end_date, '%m/%d/%Y') BETWEEN '"+formatedstartDate+"' AND '"+formatedendDate+"'  "
  if (data.status != '') {
              query1 = query1+" and status='"+data.status+"'"
  }
  result=await Details(query1);
  res.send({status:"success",data:result})
  
}else{
  startDate = (data.startDate).split('/');
  endDate =  (data.endDate).split('/');
  formatedstartDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
  formatedendDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
  query1=" SELECT p.employee_id,p.permission_id,CONCAT(e.first_name, ' ', e.last_name) AS fullname,DATE_FORMAT(p.date, '%m/%d/%Y') AS DATE,p.start_time,p.end_time,p.created_at AS created_at,p.status FROM permissions p INNER JOIN employees e ON e.employee_id = p.employee_id  WHERE  p.employee_id = '"+data.emp_id+"' AND DATE_FORMAT(p.date,'%m/%d/%Y') BETWEEN '"+formatedstartDate+"' AND '"+formatedendDate+"'  "
  
  if (data.status != '') {
              query1 = query1+" and status='"+data.status+"'"
  }
  result=await Details(query1);

  res.send({status:"success",data:result})
}
}

exports.remainder = async(req,res)=>{

  data=req.body;
  
  query = " SELECT lr.no_of_days,concat(e.first_name,' ',e.last_name) fullname,e.email,DATE_FORMAT(lr.start_date, '%d/%m/%Y') start_date,DATE_FORMAT(lr.end_date, '%d/%m/%Y') end_date,lr.leave_type,lr.description FROM employees e,leave_requests lr where e.employee_id=lr.employee_id and lr.request_id='"+data.req_id+"' AND lr.status='pending'  " 
  result =await Details(query);
  if (result.length > 0) {
    let to='ops@shiftwave.com';

    let carboncopy = 'durga@shiftwave.com';
    let days = result[0].no_of_days;
    let text = `Shiftwave HR`;
    let Heading=`Remainder For Leave Request From ${req.session.employee_name} -(${days}) Days`
    let html= `<body style="font-family: Arial,sans-serif;">
<div style="font-family: Arial,sans-serif; background: #f2f2f2; padding: 10px;">
<div style="max-width: 480px; margin: auto; background: #ffffff; padding:15px;">
<div align="center"><img src="https://hr.shiftwave.com/assets/images/logo.png" style="height: 30px;"></div>
<div style="margin-bottom: 0px;"><h6 style="font-size: 24px; text-align: center; color: #333333; padding: 8px;border-top: 1px solid #f2f2f2; margin-top: 15px;margin-bottom: 10px;font-family: 'Roboto';">Applied Leave Details</h6>				
  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  Name
  <div style="color: #333333;">${req.session.employee_name}</div>
  </div>

  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  Email
  <div style="color: #333333; word-break: break-all;">${result[0].email}</div>
  </div>

  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  Start Date
  <div style="color: #333333; word-break: break-all;">${result[0].start_date}</div>
  </div>

  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  End Date
  <div style="color: #333333; word-break: break-all;">${result[0].end_date}</div>
  </div>
  
  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  Leave Type
  <div style="color: #333333; word-break: break-all;">${result[0].leave_type}</div>
  </div>
  
  <div style="background: #f9f9f9; border-radius: 6px; padding: 12px; color: #888888; margin-bottom: 2px;">
  Reason For Leave
  <div style="color: #333333; word-break: break-all;">${result[0].description} </div>
  </div>  
  
  <button style="background-color: #3bc0c3;border: none;font-size: 14px;padding: 10px 20px;border-radius: 20px;font-weight: 700;color: white; display: block;margin: 20px auto;text-decoration: none;"><a href="https://hr.shiftwave.com/admin/employeeLeave-details?emp_id=${req.session.employee_id}&req_id=${result.insertId}" style="text-decoration: none;color: white;">Click here</a></button>
  
</div>
<div style="font-size: 14px; text-align: center; color: #6d6d6d; padding-top: 15px;">© 2024 Shiftwave. All rights reserved</div>
</div>
</div>
</body>`
    let mail_status= mailnotification(to,Heading,text,html,carboncopy);

    db.query("UPDATE leave_requests SET refresh_date = NOW() WHERE  request_id='"+data.req_id+"'", (err, result) => {
      if (err) {
          console.error("Error updating refresh date:", err);
        
      } else {
          if (result.affectedRows > 0) {
              
		res.send({status:"success"})
              
          } else {
             
		res.send({status:"Not created"})
            
          }
      }
  });
  }
  }


  exports.deleteLeave = (req, res) => {
    const { request_id, permission_id } = req.body; 

    if (!request_id && !permission_id) {
        res.status(400).json({ message: "Either request_id or permission_id is required." });
        return;
    }

    let query;
    let id;

    if (request_id) {
        query = 'DELETE FROM leave_requests WHERE request_id = ?';
        id = request_id;
    } else if (permission_id) {
        query = 'DELETE FROM permissions WHERE permission_id = ?';
        id = permission_id;
    }

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ message: "Failed to delete the record." });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Record not found." });
            return;
        }

        res.status(200).json({ message: "Record deleted successfully." });
    });
};