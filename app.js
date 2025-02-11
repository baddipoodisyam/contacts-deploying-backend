const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "contact.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/contacts/", async (request, response) => {
    const getContactsQuery = `
      SELECT
        *
      FROM
        contacts
      ORDER BY
        contact_id;`;
    const contactArray = await db.all(getContactsQuery);
    response.send(contactArray);
  });

  app.post("/contacts/", async (request, response) => {
    const contactDetails = request.body;
    const {
      name,
      email,
      phoneNumber
    } = contactDetails;
    const addContactQuery = `
      INSERT INTO
        contacts(name,email,phoneNumber)
      VALUES
        (
          '${name}',
           ${email},
           ${phoneNumber},
           
        );`;
  
    const dbResponse = await db.run(addcontactQuery);
    const contactId = dbResponse.lastID;
    response.send({ 
        contactId: contactId });
  });
  app.put("/contacts/:contactId/", async (request, response) => {
    const { contactId } = request.params;
    const contactDetails = request.body;
    const {
      Name,
      email,
      phoneNumber,
      } = contactDetails;
    const updateContactQuery = `
      UPDATE
        contacts
      SET
        Name='${Name}',
        email=${email},
        phoneNumber=${phoneNumber},
        
      WHERE
        contact_id = ${ContactId};`;
    await db.run(updateContactQuery);
    response.send("Contact Updated Successfully");
  });

  app.delete("/contacts/:contactId/", async (request, response) => {
    const { contactId } = request.params;
    const deleteContactQuery = `
      DELETE FROM
        contacts
      WHERE
        contact_id = ${contactId};`;
    await db.run(deleteContactQuery);
    response.send("Contact Deleted Successfully");
  });

  app.get("/contacts/:contactId/", async (request, response) => {
    const { authorId } = request.params;
    const getcontactQuery = `
      SELECT
       *
      FROM
       contacts
      WHERE
        contact_id = ${contactId};`;
    const contactsArray = await db.all(getcontactQuery);
    response.send(contactssArray);
  });