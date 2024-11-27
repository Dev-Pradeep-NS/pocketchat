/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = new Collection({
    name: "chats",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    schema: [
      {
        name: "message",
        type: "text",
        required: true,
        options: {
          max: 160
        }
      },
      {
        name: "sender",
        type: "relation",
        required: true,
        options: {
          maxSelect: 1,
          collectionId: "users",
          cascadeDelete: true
        }
      },
      {
        name: "receiver",
        type: "relation",
        required: true,
        unique: false,
        options: {
          maxSelect: null,
          collectionId: "users",
          cascadeDelete: true,
        }
      },
      {
        name: "group",
        type: "relation",
        required: false,
        options: {
          maxSelect: 1,
          collectionId: "groups",
          cascadeDelete: true
        }
      }
    ],
    indexes: [],
    options: {}
  })

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("chats")
  return dao.deleteCollection(collection)
})