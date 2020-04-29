const express = require("express");
const { google } = require("googleapis");
const moment = require("moment");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const app = express();


app.get("/", (req, res) => res.send("online"));

const serviceAccount = {
  type: "service_account",
  project_id: "everybot-lvwcqs",
  private_key_id: "2b3b6540b6824e3ca896546a0df0909371b1044b",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDESduaJxngkdxa\nZObp4QIwrSm82FUsFpNlTQJTK1gQxY6vBVF+5ygY0/8CSPpTmDtv8NPAvZtuKPOU\nP2EdLquIiOwpBhLK/e+b6QvnAj9GGaa97pMBymNDj1CCB/4eaN6OPlI8mZDVXS1L\nqCFsJ9rwWaP5sYBsMVKqCoOVq2WkeNMVi+j8QN4AAOHaB2WrdJgHPMOWAXijTOo8\ns/gqj6RpTmnGamct66d+ZT/tYePH0zOhREBovKx6pSVl2o5kXsxC48IruFmbfmzd\nGFoiDn4355Cr8L+3nrEq0U8s4ckob5/SfBb1HT1bkanHVsSTrGfnpOQktYfSxJg3\nk4y+JvCPAgMBAAECggEANtMuTDs5phj3hCQEvzSCyRfEvaNq/rp7huLgkFxd56lW\ndho1Lg3gjDbCVmAN00WE7HpGmuIaxMUZa8HcHSuI68TauYahvyL4RwLruSVOiQTn\nJsu5MdnWqesgoIEdAF9oMjDEBXsbEg1JdoVKeIwVQea3vylN5mpMXYQ8RpSt+ibr\n1a3RSLDJk33IHj+339jJFmddGF9hD4ZX06j/1rzrjF1irhj1NIdzmLVKYMItKq+c\nD3siZ+hUCvn0r8z7mmGgr2di17w0JGZN5x3dGCAX6zhgM6AfS8fO3Zu2tEPGT0kg\nelYeI/YsggQYFx1SBP+xdUmuJ8fUyx3C5w7U0A3y6QKBgQDtvV0SpkfMLFQIKsxN\nU0v2heteL011hBqd8o9qOEO3BMKN3HUoC2xnLBHAhUn5NOeSWPaFifXmr7+LHggS\nKyg6/8tA4PcpzINssrpZRmlx9mOEonf8TiPYPhG6mu2MFI+6wCtZuOGUA0MoyXpX\n7dhS0+/EPPCGTpM9CsSRXVVVUwKBgQDTXXI/Je6+qqpaOPW5/fHS16up9efOuHDy\nbzEwrrkl6sqqignJZm2gyiOuT/00nR5p+8YL8S9MkGyw3sFyEKqsCxyc/r6A2Dfu\nHl8B4QpXqPXotdJItPFdAnksmqVsdXUifQAisnlUc6rY1IA7VNDfkdarRqG2jmFa\nb7QlZDh0VQKBgEulRlkpyYygyjgzDgDIsVIGuKamXHo5B5McXB/LOVihzhn/fNO6\nFssZTai5gJkoCUsavY4uIK0/XK4yZxUI4GstewnwyxRku6i5kevYKLMXWAEbBRyl\n7GfhEBkVNOKupDEi9mg9GKHVC+iNez1BM+TfBNqnHU1O8TCqHXO3g/B7AoGAGdLV\n7X8t7x+c1o8U/pdXH0J4V7iSjMAeFJCfOupt9oL8Jd/dmDyqcjWgLGDbd70mhR5c\nsQLTm5Adp3JfwhblM0XcRhYdolJIaxBM3UboY5NiD/9+5KEuyAVQVrHCOkETgZYy\nGQsjJb1IB1vXGuie6GHCD4T+pvY4ULtLEDJxb00CgYEAj4yIHCTDRFkrSwWA+sf4\nxKnYxUNFn1HG7Bkf1VS0osMa8zJ4KYSXd2/RhlZXUAh24GC7DSyFdgkF9vkLCH4Q\noRqYaweK6oy1lvZEb8S09JaXZOL+k51L9HCp4LVjnSstpCHnM2iJJQZAtCD0NFeR\nHbGqsCkY6xhcJ6vOog170JI=\n-----END PRIVATE KEY-----\n",
  client_email: "everybot-lvwcqs@appspot.gserviceaccount.com",
  client_id: "110956320542878135639",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/everybot-lvwcqs%40appspot.gserviceaccount.com"
};

const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: "https://www.googleapis.com/auth/calendar"
});

const calendar = google.calendar("v3");



app.post("/dialogflow", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  const timeZoneOffset = "-06:00";

  function makeAppointment(agent) {
    const {
      calendarID,
      first_name,
      last_name,
      email,
      paquete,
      telefono
    } = agent.contexts[0].parameters;

    // console.log(agent.contexts[0].parameters)
    const { date, time } = agent.parameters;
    console.log(date);
    console.log(time);
  
    const dateTimeStart = new Date(
      Date.parse(
        date.split("T")[0] +
          "T" +
          time.split("T")[1].split("-")[0] +
          timeZoneOffset
      )
    );
    
   
    const dateTimeEnd = new Date(
      new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1)
    );

    const attendees = [{ displayName: `${first_name} ${last_name}`, email }];

    const description = `Paquete: ${paquete}\nTeléfono:${telefono}`;

    return createCalendarEvent(
      dateTimeStart,
      dateTimeEnd,
      calendarID,
      attendees,
      description
    )
      .then(() => {
        const payload = {
          redirect_to_blocks: ["Horario Disponible"],
          set_attributes: {
            stringDate: dateToString(dateTimeStart,date)
          }
        };
        agent.add(
          new Payload(agent.FACEBOOK, payload, {
            // rawPayload: false,
            // sendAsMessage: false
          })
        );
      })
      .catch(() => {
        const payload = {
          redirect_to_blocks: ["Horario No Disponible"],
          set_attributes: {
            stringDate: dateToString(dateTimeStart,date)
          }
        };
        agent.add(
          new Payload(agent.FACEBOOK, payload, {
            // rawPayload: false,
            // sendAsMessage: false
          })
        );
      });
  }

  function callmeNow(agent) {
    const {
      calendarID,
      first_name,
      last_name,
      email,
      paquete,
      telefono
    } = agent.contexts[0].parameters;
    
    const dateTimeStart = new Date();
    dateTimeStart.setMinutes(dateTimeStart.getMinutes() + 30);
    const dateTimeEnd = new Date(
      new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1)
    );

    const attendees = [{ displayName: `${first_name} ${last_name}`, email }];

    const description = `Paquete: ${paquete}\nTeléfono:${telefono}`;
    return createCalendarEvent(
      dateTimeStart,
      dateTimeEnd,
      calendarID,
      attendees,
      description
    )
      .then(() => {
        const payload = {
          redirect_to_blocks: ["Llamar Ahora"],
          set_attributes: {
            stringDate: dateToString(dateTimeStart)
          }
        };
        agent.add(
          new Payload(agent.FACEBOOK, payload, {
            // rawPayload: false,
            // sendAsMessage: false
          })
        );
      })
      .catch(() => {
        const payload = {
          redirect_to_blocks: ["Horario No Disponible"],
          set_attributes: {
            stringDate: dateToString(dateTimeStart)
          }
        };
        agent.add(
          new Payload(agent.FACEBOOK, payload, {
            // rawPayload: false,
            // sendAsMessage: false
          })
        );
      });
  }

  let intentMap = new Map();
  intentMap.set("Schedule Call Appointment | Daniel C", makeAppointment);
  intentMap.set("Call me now | Daniel C", callmeNow);
  agent.handleRequest(intentMap);
});

function createCalendarEvent(
  dateTimeStart,
  dateTimeEnd,
  calendarID,
  attendees,
  description
) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarID,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      },
      (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        // if (err || calendarResponse.data.items.length > 0) {
        //   reject(
        //     err ||
        //       new Error("Requested time conflicts with another appointment")
        //   );
        // } else {
          // Create event for the requested time period
          calendar.events.insert(
            {
              auth: serviceAccountAuth,
              calendarId: calendarID,
              resource: {
                summary: `IMPORTANTE llamar a cliente: ${attendees[0].displayName}`,
                description,
                start: { dateTime: dateTimeStart },
                end: { dateTime: dateTimeEnd }
                // attendees:[{email:"ericardez@quebuencodigo.com"}]
              }
            },
            (err, event) => {
              console.log(err);
              return err ? reject(err) : resolve(event);
            }
          );
        }
      // }
    );
  });
}

function dateToString(date,date2) {
  console.log(date);
  const timeZone = "America/Guatemala";
  var monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  var dayOfWeekNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
  ];
  const date3 = new Date(Date.parse(date2));
  const monthIndex = date3.getMonth();
  const dayOfWeekIndex = date3.getDay();
  const appointmentTimeString = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timeZone
  });
  const dateString = `${dayOfWeekNames[dayOfWeekIndex]}, ${date3.getDate()} de ${
    monthNames[monthIndex]
  } a las ${appointmentTimeString}`
  console.log(dateString)
  return dateString;
}

module.exports = app;
