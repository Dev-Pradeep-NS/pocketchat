/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("chats")

  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "files_field",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 10,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("chats")

  collection.schema.removeField("files_field")

  return dao.saveCollection(collection)
})
