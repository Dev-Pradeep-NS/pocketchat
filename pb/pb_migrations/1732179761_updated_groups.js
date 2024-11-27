/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tw0y17qqne3qg5x")

  // remove
  collection.schema.removeField("e80704id")

  // remove
  collection.schema.removeField("8vqe1lkn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gdjrixyc",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iattycbl",
    "name": "description",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tw0y17qqne3qg5x")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e80704id",
    "name": "name",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8vqe1lkn",
    "name": "description",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  // remove
  collection.schema.removeField("gdjrixyc")

  // remove
  collection.schema.removeField("iattycbl")

  return dao.saveCollection(collection)
})
