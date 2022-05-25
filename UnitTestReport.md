# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *class_name* - method *name***



**Criteria for method *name*:**
	

 - 
 - 





**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|          |           |
|          |           |
|          |           |
|          |           |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| Criteria 1 | Criteria 2 | ... | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
|||||||
|||||||
|||||||
|||||||
|||||||




# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>



#### SKU tests (SKU.test.js)

| Unit name | Jest test case     |
|-----------|--------------------|
| SKU    | testNewSKU |
| SKU    | testModifySKU   |
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
| Products | |


### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



