const BookingsModel = require("../models/bookings");
const BookingsTypeModel = require("../models/bookingsTypes");
const userModel = require("../models/user");
const nodemailer = require("nodemailer");
var convertTime = require("convert-time");
const addTime = require("add-time");
const moment = require("moment");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com", // client id
  "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" // client secret
);

oAuth2Client.setCredentials({
  refresh_token:
    "1//04vCEUwK4uyoGCgYIARAAGAQSNwF-L9Irg0bJDDDEEKeHJYwAEeDYZBi3__Xd2b1The3RNIHxHwt212ywvYQIUPH_O10tKrXZWUI", // need to refresh every week from google oAuthPlayGround
});

const getBookings = async (req, res) => {
  BookingsModel.find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const addBookings = async (req, res) => {
  userModel
    .findById(req.body.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User Not found!",
        });
      } else {
        BookingsTypeModel.findById(req.body.bookingsTypeId).then(
          (bookingType) => {
            if (!bookingType) {
              res.status(404).json({
                message: "Booking type Not found!",
              });
            } else {
              var id =
                Math.random().toString(30).substring(2, 15) +
                Math.random().toString(30).substring(2, 15) +
                Math.random().toString(30).substring(2, 15);
              let bookings = new BookingsModel({
                userId: req.body.userId,
                bookingsTypeId: req.body.bookingsTypeId,
                eventId: id,
                addAttendees: req.body.addAttendees,
                duration: req.body.duration,
                location: req.body.location,
                days_ahead: req.body.days_ahead,
                currentTime: req.body.currentTime,
                with: req.body.with,
                status: req.body.status,
                time: req.body.time,
              });
              bookings.save().then((data) => {
                let eventLink;
                let email = [];
                email = data.addAttendees.map((data) => ({
                  email: data.email,
                }));

                let attendeesEmails = [{ email: user.email, Organizer: true }];

                email.forEach(function (to, i, array) {
                  attendeesEmails.push({
                    email: email[i].email,
                  });
                });

                const createEvent = async () => {
                  // Create a new calender instance.
                  const calendar = google.calendar({
                    version: "v3",
                    auth: oAuth2Client,
                  });

                  // Create a new event start date instance for uses in our calendar.

                  const eventStartTime =
                    moment(data.currentTime).format("YYYY-MM-D") +
                    "T" +
                    convertTime(data.time) +
                    ":00.00Z";

                  let minutes = bookingType?.duration - 1;

                  const addMinutes = addTime(eventStartTime, {
                    minutes: minutes,
                  });
                  const eventEndTime = addMinutes;

                  // Create a event for temp uses in our calendar
                  const event = {
                    id: data.eventId,
                    summary: `Meeting with ${user.name}`,
                    location: bookingType.location,
                    description: bookingType.description,
                    colorId: 1,
                    start: {
                      dateTime: eventStartTime,
                      timeZone: data.location,
                    },
                    end: {
                      dateTime: eventEndTime,
                      timeZone: data.location,
                    },
                    attendees: attendeesEmails,
                    conferenceData: {
                      createRequest: {
                        conferenceSolutionKey: {
                          type: "hangoutsMeet",
                        },
                        requestId: "xxxx",
                      },
                    },
                  };

                  // Check if we a busy and have an event on our calendar for the same time.
                  // calendar.freebusy.query(
                  //   {
                  //     resource: {
                  //       timeMin: eventStartTime,
                  //       timeMax: eventEndTime,
                  //       timeZone: data.location, //data.location
                  //       items: [{ id: "primary" }],
                  //     },
                  //   },
                  //   (err, res) => {
                  //     // Check for errors in our query and log them if they exist.
                  //     if (err)
                  //       return console.error("Free Busy Query Error: ", err);

                  //     // Create an array of all events on our calendar during that time.
                  //     const eventArr = res.data.calendars.primary.busy;

                  //     // Check if event array is empty which means we are not busy
                  //     if (eventArr.length === 0)
                  //       // If we are not busy create a new calendar event.
                  //       return calendar.events.insert(
                  //         {
                  //           calendarId: "primary",
                  //           resource: event,
                  //           conferenceDataVersion: 1,
                  //         },
                  //         (err) => {
                  //           // Check for errors and log them if they exist.
                  //           if (err)
                  //             return console.error(
                  //               "Error Creating Calender Event:",
                  //               err
                  //             );

                  //           try {
                  //             var transporter = nodemailer.createTransport({
                  //               // service: "gmail",
                  //               // host: "smtppro.zoho.in",
                  //               // host: "smtp.mail.kallendly.com",
                  //               // host: "mail.kallendly.com",

                  //               // port: 465,
                  //               // secure: true,
                  //               // host: "103.216.146.165",

                  //               service: "gmail",
                  //               host: "smtp.kallendly.com",
                  //               port: "587",
                  //               tls: {
                  //                 ciphers: "SSLv3",
                  //                 rejectUnauthorized: false,
                  //               },

                  //               auth: {
                  //                 user: "hmughal0123@gmail.com",
                  //                 pass: "cxiswypaujnticyo",

                  //                 // pass: "urkabyalerqelgdt",
                  //               },
                  //               // auth: {
                  //               //   user: "hmughal0123@gmail.com",
                  //               //   pass: "zzeqhyrxpocmtedj",
                  //               // },
                  //               // auth: {
                  //               //   user: "mydevelopmenttest7@gmail.com",
                  //               //   pass: "niytpvhrbmkcxzut",
                  //               // },
                  //               tls: {
                  //                 rejectUnauthorized: false,
                  //               },
                  //             });

                  //             var mailOptions = {
                  //               // from: "connect@kallendly.com",

                  //               from: "connect@kallendly.com",
                  //               to: data.email,
                  //               replyTo: user.email,
                  //               subject: `Meeting with ${user.name}`,
                  //               html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                  //             };

                  //             email.forEach(function (to, i, array) {
                  //               mailOptions.to = to.email;
                  //               transporter.sendMail(
                  //                 mailOptions,
                  //                 function (error, info) {
                  //                   if (error) {
                  //                     console.log(error);
                  //                   } else {
                  //                     console.log(
                  //                       "Email sent: " + info.response
                  //                     );
                  //                   }
                  //                 }
                  //               );
                  //               if (i === email.length - 1) {
                  //                 return transporter.close();
                  //               }
                  //             });
                  //             var mailO = {
                  //               from: user.email,
                  //               to: user.email,
                  //               subject: `Meeting with ${user.name}`,
                  //               html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                  //             };
                  //             transporter.sendMail(
                  //               mailO,
                  //               function (error, info) {
                  //                 if (error) {
                  //                   console.log(error);
                  //                 } else {
                  //                   console.log("Email sent: " + info.response);
                  //                 }
                  //               }
                  //             );
                  //           } catch (error) {
                  //             console.log(error);
                  //           }
                  //           // Else log that the event was created.

                  //           return console.log(
                  //             "Calendar event successfully created."
                  //           );
                  //         }
                  //       );

                  //     // If event array is not empty log that we are busy.
                  //     return console.log(`Sorry I'm busy...`);
                  //   }
                  // );
                  calendar.events.insert(
                    {
                      auth: oAuth2Client,
                      calendarId: "primary",
                      resource: event,
                      conferenceDataVersion: 1,
                    },
                    function (err, event) {
                      if (err) {
                        console.log(
                          "There was an error contacting the Calendar service: " +
                            err
                        );
                        return res.send({
                          message: "Error creating event",
                        });
                      }
                      console.log("Event created: %s", event.data.htmlLink);
                      eventLink = event.data.htmlLink;
                      try {
                        var transporter = nodemailer.createTransport({
                          service: "gmail",
                          auth: {
                            user: "hmughal0123@gmail.com",
                            pass: "cxiswypaujnticyo",
                          },
                        });

                        var mailOptions = {
                          from: "connect@kallendly.com",
                          to: data.email,
                          replyTo: user.email,
                          subject: `Meeting with ${user.name}`,
                          html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                        };

                        email.forEach(function (to, i, array) {
                          mailOptions.to = to.email;
                          transporter.sendMail(
                            mailOptions,
                            function (error, info) {
                              if (error) {
                                console.log(error);
                              } else {
                                console.log("Email sent: " + info.response);
                              }
                            }
                          );
                          if (i === email.length - 1) {
                            return transporter.close();
                          }
                        });

                        var mailO = {
                          from: "connect@kallendly.com",
                          to: user.email,
                          replyTo: user.email,
                          subject: `Meeting with ${user.name}`,
                          html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                        };
                        transporter.sendMail(mailO, function (error, info) {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Email sent: " + info.response);
                          }
                        });

                        res.status(200).send({
                          // event: eventLink,
                          data: data,
                          message: "booking successfully added",
                        });
                      } catch (error) {
                        console.log(error, "======error from here");
                      }
                    }
                  );
                };

                createEvent();
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while sending Booking.",
      });
    });
};

const getBookingsByUserId = async (req, res) => {
  BookingsModel.find({ userId: req.body.userId })
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getBookingsByIdAndDate = async (req, res) => {
  BookingsModel.find({
    userId: req.body.userId,
    currentTime: req.body.currentTime,
  })
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getBookingsById = async (req, res) => {
  BookingsModel.findById(req.params.id)
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const updateBookings = async (req, res) => {
  if (
    !req.body.addAttendees &&
    !req.body.duration &&
    !req.body.location &&
    !req.body.days_ahead &&
    !req.body.currentTime &&
    !req.body.with &&
    !req.body.status &&
    !req.body.time
  ) {
    return res.status(400).send({
      success: false,
      message: "Please enter bookings data",
    });
  }
  BookingsModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "booking not found with id " + req.params.id,
        });
      } else {
        userModel.findById(data.userId).then((user) => {
          BookingsTypeModel.findOne({ id: req.body.bookingsTypeId }).then(
            (bookingType) => {
              let email = [];
              email = data.addAttendees.map((data) => ({
                email: data.email,
              }));

              let attendeesEmails = [{ email: user.email, organizer: true }];

              email.forEach(function (to, i, array) {
                attendeesEmails.push({
                  email: email[i].email,
                });
              });

              const createEvent = async () => {
                // Create a new calender instance.
                const calendar = google.calendar({
                  version: "v3",
                  auth: oAuth2Client,
                });

                // Create a new event start date instance for uses in our calendar.

                const eventStartTime =
                  moment(data.currentTime).format("YYYY-MM-D") +
                  "T" +
                  convertTime(data.time) +
                  ":00.00Z";

                let minutes = bookingType?.duration - 1;

                const addMinutes = addTime(eventStartTime, {
                  minutes: minutes,
                });
                const eventEndTime = addMinutes;
                var id =
                  Math.random().toString(30).substring(2, 15) +
                  Math.random().toString(30).substring(2, 15) +
                  Math.random().toString(30).substring(2, 15);

                // Create a event for temp uses in our calendar
                const event = {
                  id: id,
                  summary: `Meeting with ${user.name}`,
                  location: bookingType.location,
                  description: bookingType.description,
                  colorId: 1,
                  start: {
                    dateTime: eventStartTime,
                    timeZone: data.location,
                  },
                  end: {
                    dateTime: eventEndTime,
                    timeZone: data.location,
                  },
                  attendees: attendeesEmails,
                  conferenceData: {
                    createRequest: {
                      conferenceSolutionKey: {
                        type: "hangoutsMeet",
                      },
                      requestId: "xxxx",
                    },
                  },
                };

                calendar.events.insert(
                  {
                    auth: oAuth2Client,
                    calendarId: "primary",
                    resource: event,
                    conferenceDataVersion: 1,
                  },
                  function (err, event) {
                    if (err) {
                      console.log(
                        "There was an error contacting the Calendar service: " +
                          err
                      );
                      return;
                    }
                    console.log("Event created: %s", event.data.htmlLink);
                    eventLink = event.data.htmlLink;
                  }
                );
              };

              try {
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "hmughal0123@gmail.com",
                    pass: "cxiswypaujnticyo",
                  },
                });

                var mailOptions = {
                  from: "connect@kallendly.com",
                  to: data.email,
                  replyTo: user.email,
                  subject: `Meeting with ${user.name}`,
                  html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                };

                email.forEach(function (to, i, array) {
                  mailOptions.to = to.email;
                  console.log("mailOPTIONS-->", mailOptions.to);
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                  if (i === email.length - 1) {
                    return transporter.close();
                  }
                });

                var mailO = {
                  from: "connect@kallendly.com",
                  to: user.email,
                  replyTo: user.email,
                  subject: `Meeting with ${user.name}`,
                  html: `<div>Meeting with <strong>${user.name}</strong></div>description: ${bookingType.description}<div></div><p>Confirm the event by clicking on this <a href="https://calendar.google.com/calendar/u/0/r/month">See Event</a></p>`,
                };
                transporter.sendMail(mailO, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
                  }
                });
              } catch (error) {
                console.log(error, "======error from here");
              }
              createEvent();
            }
          );
        });
      }
      res.status(200).send({
        message: "bookings updated successfully",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        console.log("not found");
        return res.status(404).send({
          success: false,
          message: "booking not found with id " + req.params.id,
        });
      }
      console.log("error");
      return res.status(500).send({
        success: false,
        message: "Error updating booking with id " + req.params.id,
      });
    });
};

const updateBookingsStatus = async (req, res) => {
  if (
    !req.body.addAttendees &&
    !req.body.duration &&
    !req.body.location &&
    !req.body.days_ahead &&
    !req.body.currentTime &&
    !req.body.with &&
    !req.body.status &&
    !req.body.time
  ) {
    return res.status(400).send({
      success: false,
      message: "Please enter bookings data",
    });
  }
  BookingsModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          success: false,
          message: "booking not found with id " + req.params.id,
        });
      } else {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "hmughal0123@gmail.com",
            pass: "cxiswypaujnticyo",
          },
        });
        let email = data.addAttendees.map((data) => ({
          email: data.email,
        }));

        let time = data.time;

        console.log(email);

        var mailOptions = {
          from: "connect@kallendly.com",
          to: email,
          subject: "Meeting cancelled",
          html:
            "<h3>Hello!</h3>" +
            "<span>Your kallendly meeting  at </span>" +
            time +
            "<span> has been cancelled.</span>" +
            "<p>Regards,</p>" +
            "<p>Kalendly</p>",
          text: "That was easy!",
        };

        email.forEach(function (to, i, array) {
          mailOptions.to = to.email;
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.status(400).json({ message: "Email not Sent" });
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).json({ message: "Email Sent", data: data });
            }
            if (i === email.length - 1) {
              return transporter.close();
            }
          });
        });
      }
      // res.send({
      //   success: true,
      //   data: data,
      // });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "booking not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating booking with id " + req.params.id,
      });
    });
};

const deleteBooking = async (req, res) => {
  BookingsModel.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Booking not found with id " + req.params.id,
        });
      }
      res.json({
        success: true,
        message: "Booking successfully deleted!",
        data: data,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "Booking not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not delete booking with id " + req.params.id,
      });
    });
};

const deleteEvent = async (req) => {
  const calendar = google.calendar({
    version: "v3",
    auth: oAuth2Client,
  });
  try {
    const response = await calendar.events.delete({
      auth: oAuth2Client,
      calendarId: "primary",
      eventId: req,
    });
    if (response.data === "") {
      console.log("No response found");
    } else {
      console.log("Error in deleting event");
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteSingleEvent = async (req, res) => {
  const eventId = req.body.eventId;
  try {
    const response = await deleteEvent(eventId);
    if (!response) {
      res.status(400).send({
        response,
        message: "Event not found with id",
      });
    } else {
      res.status(200).send({
        response,
        message: "Event successfully removed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Could not able to find event",
    });
  }
};

const test = (req, res) => {
  const oAuth2ClientServices = new OAuth2(
    "116806022314728200296",
    "0a938dda1ee12ac4b8331498df67955ccf50acc6"
  );
  const calendar2 = google.calendar({
    version: "v3",
    auth: oAuth2ClientServices,
  });
  var id =
    Math.random().toString(30).substring(2, 15) +
    Math.random().toString(30).substring(2, 15) +
    Math.random().toString(30).substring(2, 15);

  console.log(id, "==================id");

  const event = {
    id: id,
    summary: "Google I/O 2015",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2022-10-18T14:49:31.919Z",
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: "2022-10-18T14:49:31.919Z",
      timeZone: "America/Los_Angeles",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
    organizer: {
      email: "mydevelopmenttest7@gmail.com",
      self: true,
    },
    attendees: [
      { email: "mydevelopmenttest7@gmail.com", organizer: true },
      { email: "hmughal0123@gmail.com" },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  calendar2.events.insert(
    {
      auth: oAuth2Client,
      calendarId: "primary",
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        res.status(400).send({
          error: err,
          message: "=====error=====",
        });
        return;
      }
      console.log("Event created: %s", event.data.htmlLink);
      res.status(200).send({
        event: event,
        message: "success",
      });
    }
  );
};

module.exports = {
  getBookings,
  getBookingsByUserId,
  getBookingsById,
  getBookingsByIdAndDate,
  deleteSingleEvent,
  addBookings,
  updateBookings,
  deleteBooking,
  updateBookingsStatus,
  test,
};
