/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const admin = new Admin()
  admin.email = "sunil@example.com"
  admin.setPassword("password@123")

  dao.saveAdmin(admin)
}, (db) => {
  const dao = new Dao(db)
  try {
    const admin = dao.findAdminByEmail("sunil@example.com")
    dao.deleteAdmin(admin)
  } catch (error) {
    console.error("Unable to delete the admin:", error)
  }
})