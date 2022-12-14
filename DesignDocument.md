# Design Document 


Authors: Pietro Gancitano, Davide Porello, Gianmarco De Paolis, Alberto Perugini

Date: 25/05/2022

Version: 1.2


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs


# High level design 

This architecture implements 2 high-level architectural patterns:
- 3-layer architecture: the basic idea is to use a layered style, to decouple the database (where data likely change often) from application logic (modify and show data of the database). The presentation layer is implemented using the GUI prototype but it's out of scope for the design. Layers are represented with packages in the package diagram.
- client/server: a single server (backend) that contains the application logic and the database, a set of clients/users (frontend) that 
collect and display data from the server using the APIs through the GUI.

## Package diagram
![High level design](Resources/HighLevelDesign.jpg "High level design")


# Low level design

## Class diagram

### New class diagram
![New low level design](Resources/LowLevelDesign.jpg "New low level design")

This is the updated version of the design developed after writing the code and the tests. Above the services we have the routes layer that are not classes so they are not reported but implement the API calls.

### Old class diagram

![Old low level design](Resources/oldlowleveldesign.jpg "New low level design")

One single class diagram is used to implement the database and the application logic. The structural facade pattern is used to make the user's experience simple and not affected from eventual future changes in the lower level. The user interacts only with the system through the GUI that interacts with the WarehouseImplementation class, this class provides several methods that are internal implementations of the APIs and manages the interaction between the other classes.


# Verification traceability matrix

| ID  | Clerk | QualityEmployee | Manager | DeliveryEmployee | InternalCustomer |  Supplier | InternalOrder | RestockOrder | Item | ReturnOrder | SKU | Position | SKUItem | TestResult | TestDescriptor |
| --- | :------: | :------: | :------: | :------: | :------: | :------: | :------: | :------: | :------: |  :------: | :------: | :------: | :------: | :------: | :------: |
| Manage users |X|X|X|X|X|X|X| | | | | | | | |
| Manage SKUs |   |   | X |   |   |   |   |   |   |   | X |   | X |   | X |
| Manage Warehouse |   |   | X |   |   |   |   |   |   |   |   | X |   | X |   |
| Manage internal customers |   |   | X |   | X |   |   |   |   |   |   |   |   |   |   |  
| Manage restock order | X | X | X |   |   | X |   | X | X | X | X | X |   |
| Manage internal order |   |   | X | X | X | X | X |   |   |   | X | X | X |   |   |
| Manage items |   |   |   |   |   | X |   |   | X |   |   |   |   |   |   |




# Verification sequence diagrams 

These sequence diagrams are referred to the old class diagram.

## Sequence diagram of Use Case 1 - Scenario 1
![Manage SKUs](Resources/ManageSKUs.png "Manage SKUs")
## Sequence diagram of Use Case 2 - Scenario 1
![Create Position](Resources/CreatePosition.png "Create Position")
## Sequence diagram of Use Case 3 - Scenario 2
![Restock Order By Supplier](Resources/RestockOrder.png "Restock Order By Supplier")
## Sequence diagram of Use Case 4 - Scenario 1
![Create User](Resources/sequence_use_case_4.png "Create User")
## Sequence diagram of Use Case 5 - Scenario 1
![Restock Order Arrival](Resources/sequence_use_case_5.png "Restock Order Arrival")
## Sequence diagram of Use Case 11 - Scenario 2
![Modify Item](Resources/modifyItem.png "Modify Item")
## Sequence diagram of Use Case 12 - Scenario 1
![Create Test Descriptor](Resources/createTestDescriptor.png "Create Test Descriptor")
