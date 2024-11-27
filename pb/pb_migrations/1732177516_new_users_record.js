/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("users")

  const record = new Record(collection)
  record.setUsername(`u_${$security.randomStringWithAlphabet(5, "123456789")}`)
  record.setPassword("1234567890")
  record.set("name", "Pradeep")
  record.set("email", "pradeep@example.com")

  dao.saveRecord(record)
}, (db) => {
  const dao = new Dao(db);

  try {
    const record = dao.findAuthRecordByEmail("users", "pradeep@example.com")

    dao.deleteRecord(record)
  } catch (error) {
    console.log("Unable to delete the user: ", error)
  }
})
