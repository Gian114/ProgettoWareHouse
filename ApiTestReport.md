# Integration and API Test Report

Date: 25/05/2022

Version: 1.1

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     ![Dependency Graph](Resources/dependency.png "Dependency Graph")
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>

  
     To test all the classes we used a bottom-up approach, we started by testing the DAOs after that we tested the Services and in the end the APIs
     for each class

      step 1: testing DAOs using the database 
      step 2: we tested the Services(B) with all the required DAO classes for each service 
      step 3: we tested the APIs (that use Services) taking care of all the references 

      for example, if we consider the SKUItem class the steps are:
      step 1: testing SKUItem(A2)
      step 2: testing SKUItemServices(B2) that use not only SKUItem(A2) DAO but SKU DAO(A1) too 
      step 3: testing the SKUItem apis(C2) implies using SKUItemServices (C2 + B2 + A2 + A1)



#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |

| Classes        | mock up used    | Jest test cases                              |
| -------------- | --------------- | -------------------------------------------- |
| SKUService.test.js | // | sku_service_dbmock.test.js > get all skus    |

## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||


## Step n 

   
| Classes  | mock up used |Jest test cases |
|--|--|--|
||||




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UC1-4

| Scenario |  delete SKU |
| ------------- |:-------------:| 
|  Precondition     | SKU exist in the Database |
|  Post condition     |  SKU is deleted from the Database |
| Step#        | Description  |
|  1     |  Manager searches with ID  |  
|  2     |  Manager selects the SKU's record to delete it |
|  3    | The System deletes the SKU from the DB  |

## Scenario UC1-5

| Scenario |  get SKU |
| ------------- |:-------------:| 
|  Precondition     | SKU exist in the Database |
|  Post condition     |  SKU's informations are provided |
| Step#        | Description  |
|  1     |  Customer searches SKU by ID  |  
|  2     |  System shows the SKU's data  |

## Scenario UC1-6
| Scenario |  get SKU that does not exist |
| ------------- |:-------------:| 
|  Precondition     | SKU does not exist in the Database |
|  Post condition     |  error is shown |
| Step#        | Description  |
|  1     |  Customer searches SKU by ID  |  
|  2     |  System shows an error  |




# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test


| Scenario ID     | Functional Requirements covered | Mocha Test(s)    |
| --------------- | ------------------------------- | ---------------- |
| 1-1  |   2.1   | testSKURouter.js |
| 1-4(defined above) |  2.2  | testSKURouter.js |
| 1-3  |  2.1  | testSKURouter.js |
| 1-5(defined above) |  2.4   | testSKURouter.js |
          



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name                 |
| -------------------------- | ------------------------- |
| response time < 0.5s     | included in Mocha* and Jest* | 
| The data of a customer or a supplier should not be disclosed outside the application   |       testUserRouter.js                |
| Position ID is the unique identifier of a position, 12 digits, and is derived from aisle (4digits) row (4 digits) col (4 digits), 4 first digits for aisle, middle 4 for row, last 4 for col |       testPositionRouter.js            |

*If a test is too slow it gives Timeout error


