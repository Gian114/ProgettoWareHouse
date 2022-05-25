# Unit Testing Report

Date: 25/05/2022

Version: 1.1

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >


###  Number.isInteger

**Criteria for Number.isInteger

- Check if the value in input is a isInteger

**Predicates for method Number.isInteger

| Criteria     | Predicate        |
|--------------|------------------|
|   Input value |   integer  |
|   Input value |   not integer  |

**Combination of predicates**:

| Value        | True / False | Description of the test case      | Jest test case   |
|--------------|--------------|-----------------------------------|------------------|
| 1  | true  | Number.isInteger(1) | |              
| a  | false | Number.isInteger(a) | |
| uwtc4 | false | Number.isInteger(hie23) | |
| 6.6 | false | Number.isInteger(6.6) | |


### Object.keys().length

**Criteria for Object.keys().length

- Check if the value in input has a length > 0

**Predicates for method Object.keys().length

| Criteria     | Predicate        |
|--------------|------------------|
|   Input value |   undefined  |
|    |           not undefined  |

**Combination of predicates**:

| Value        | True / False | Description of the test case      | Jest test case   |
|--------------|--------------|-----------------------------------|------------------|
| {x:"1"}  | true  | Object.keys({x:"1"}).length>0 | |              
| a  | true | Object.keys(a).length>0 | |
| undefined | false | Object.keys(undefined).length>0 | |


### not undefined

**Criteria for not undefined
	- Check if the value in input is undefined or not

**Predicates for not undefined


| Criteria     | Predicate        |
|--------------|------------------|
|   Input value |   undefined  |
|    |           not undefined  |

| Value        | True / False | Description of the test case      | Jest test case   |
|--------------|--------------|-----------------------------------|------------------|
| {x:"1"}  | true  | Object.keys({x:"1"}).length>0 | |              
| a  | true | Object.keys(a).length>0 | |
| undefined | false | Object.keys(undefined).length>0 | |

### Position - validPosition

**Criteria for validPosition
	- Check if the position_id inserted is valid (12 digits) being the concatenation
      of aisle, row and col

**Predicates for validPosition


| Criteria     | Predicate        |
|--------------|------------------|
|   String position |   aisle+row+col  |
|   String position |   not aisle+row+col  |

| Value        | True / False | Description of the test case      | Jest test case   |
|--------------|--------------|-----------------------------------|------------------|
| {"position":"111122223333", "aisle":1111, "row":2222, "col":3333}  | true  | validPosition(value) | |              
| {"position":"111122223333", "aisle":1119, "row":2222, "col":3333}  | false | validPosition(value) | |
| {"position":"111122223333", "aisle":1112}  | false | validPosition(value) | |
| {"position":"111122223333"} | false | validPosition(value) | |
| undefined | false | Object.keys(undefined).length>0 | |

### User - password.length < 8

**Criteria for password.length < 8
	- Check if the password in input has a length > 8, if not it is unvalid

**Predicates for not undefined


| Criteria     | Predicate        |
|--------------|------------------|
|   Input value |   String  |
|    |           undefined |

| Value        | True / False | Description of the test case      | Jest test case   |
|--------------|--------------|-----------------------------------|------------------|
| "aaaaab1bb"  | false  | "aaaaab1bb".length < 8 | |              
| "aaad23"  | true | "aaad23".length < 8| |
| undefined | true | undefined.length < 8 | |


# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>



#### SKU tests (SKU.test.js)

| Unit name | Jest test case     |
|-----------|--------------------|
| SKU    | testNewSKU |
| SKU    | testWrongNewSKU |
| SKU    | testModifySKU   |
| SKU    | testWrongModifySKU   |
| SKU    | testModifyPosition   |
| SKU    | testdeleteSKU  |

#### SKUItem tests (SKUItem.test.js)

| Unit name  | Jest test case         |
|------------|------------------------|
| SKUItem |  testNewSKUItem     |
| SKUItem |  testModifySKUItem |
| SKUItem | testGetSKUITEMByRFID  |
| SKUItem | testGetSKUITEMBySKUID |
| SKUItem | testGetAll    |
| SKUItem |  setOrderID    |
| SKUItem | setRestockOrder    |
| SKUItem | testdeleteSKUItem   |

#### Position tests (Position.test.js)

| Unit name       | Jest test case          |
|-----------------|-------------------------|
| testPositionDao |  testNewPosition |
| testPositionDao |  testModifyPositionID     |
| testPositionDao | testdeletePosition    |



#### InternalOrder tests (InternalOrder.test.js)

| Unit name        | Jest test case                  |
|------------------|---------------------------------|
| InternalOrder |  testCreateInternalOrder           |
| InternalOrder |testGetInternalOrdersNotCompleted    |
| InternalOrder | testModifyInternalOrderState |

#### RestockOrder tests (RestockOrder.test.js)

| Unit name    | Jest test case                 |
|--------------|--------------------------------|
| RestockOrder | testNewRo  |
| RestockOrder | delete restock order    |

#### ReturnOrder tests (ReturnOrder.test.js)

| Unit name    | Jest test case                 |
|--------------|--------------------------------|
| ReturnOrder |  testNewRo   |
| ReturnOrder |  delete return order   |


#### Item test (Item.test.js)

| Unit name   | Jest test case      |
|-------------|---------------------|
| testItemDAO | testNewIt |
| testItemDAO | testModIt       |



#### TestDescriptor tests (TestDescriptor.test.js)

| Unit name         | Jest test case                 |
|-------------------|--------------------------------|
| TestDescriptor | testNewTd     |
| TestDescriptor | testModTd    |
| TestDescriptor | delete test descriptor    |


#### TestResult tests (TestResult.test.js)

| Unit name     | Jest test case            |
|---------------|---------------------------|
| TestResult | testCreateTestResult |
| TestResult |  testGetTestResultsByRFID    |
| TestResult | testGetTestResultsByRFIDEmpty |
| TestResult |  testGetTestResultsByRFIDAndId    |
| TestResult | testModifyTestResult |
| TestResult |  testRemoveTestResult    |

#### User tests (User.test.js)

| Unit name    | Jest test case      |
|--------------|---------------------|
| User | testNewUser |
| User | testLogin |
| User | testModifyType |
| User | testGetSuppliers |
| User | testDeleteUser |

#### Products tests (Products.test.js)

| Unit name    | Jest test case      |
|--------------|---------------------|
| Products | testInsertAndGetProductRO |


### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >


| Unit name                  | Loop rows | Number of iterations | Jest test case | 
|----------------------------|-----------|----------------------|----------------|
| InternalOrderServices.test.js (createInternalOrder -> create products) |   2  |  #products in input | testCreateInternalOrder |
| ReturnOrderServices.test.js (create Return Order -> create products)|   2  |  #products in input | addRestockOrder |
| RestockOrderServices.test.js (create Restock Order -> create products)|   2  |  #products in input | createNewReturnOrder |


