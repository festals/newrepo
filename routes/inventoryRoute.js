// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build details by inventory view
router.get("/detail/:inventoryId",
    utilities.checkLogin, 
    utilities.handleErrors(invController.getInventoryDetail)
)
router.post(
    "/detail/:inventoryId",
    utilities.checkLogin,
    utilities.handleErrors(invController.addComment)
)


// Route to build management form by inventory view
router.get(
    "/management", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildManagementView)
)

router.get("/getInventory/:classification_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build add classification form by inventory view
router.get(
    "/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildAddClassification)
)

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory form by inventory view
router.get("/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventoryView)
)

router.post(
    "/add-inventory",
    validate.invRules(),
    validate.checkInvData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addInventory)
)

// Route to edit inventory 
router.get("/edit/:inventory_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventoryView)
)

router.post(
    "/update",
    validate.invRules(),
    validate.checkUpdateData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.updateInventory)
)

// Route to delete inventory 
router.get("/delete/:inventory_id",  
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventoryView)
)

router. post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)


module.exports = router;