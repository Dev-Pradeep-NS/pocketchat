/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users")

  collection.listRule = "@request.auth.id != ''"
  collection.viewRule = ""
  collection.createRule = "@request.auth.id != ''"
  collection.updateRule = ""
  collection.deleteRule = "@request.auth.id != ''"

  return dao.saveCollection(collection)
})