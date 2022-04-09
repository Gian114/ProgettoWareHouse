# Graphical User Interface Prototype  

Authors:

Date:

Version:

\<Report here the GUI that you propose. You are free to organize it as you prefer. A suggested presentation matches the Use cases and scenarios defined in the Requirement document. The GUI can be shown as a sequence of graphical files (jpg, png)  >
<br>
<br>


![mp](GUI Prototypes/mp.png "Main Page")
<br>
Main page of the application, here an user can login or register a new account by clicking on the icons on the navbar
<br><br><br>


![sign_up](GUI Prototypes/sign_up.png "Sign UP")
<br>
Here the user can register his account, he will insert his informations and click on Sign UP button
<br>
<br>
<br>


![Login](GUI Prototypes/Login.png "Login")
<br>
After inserting email and password the user clicks Sign In to login into his account, at this point
he is redirected to his mainpage (different if its the WH Manager, a supplier, the WH Worker etc...)
<br>
<br>
<br>

\<NOTE THAT in every page after the login that is not a main page an icon is shown in the up-left corner, this icon
can be used to redirect to the main page of the user logged in (Manager, Worker, Supplier etc...)>
<br>
<br>

\<User page>
<br>
![Manage account](GUI Prototypes/modify_account.png "Manage Account")
<br>
Redirected here by clicking on the Manage Account icon the page shows in the left the data about the user
and in the right a form where the user can insert new data to modify his account by then clicking the edit
button
<br>
<br>
<br>


\<Manager's pages:>
![Manager's Page](GUI Prototypes/Manager.png "Manager")
<br>
This is the Manager's main page after he is authorized and authenticated, there is a navbar with icons that
redirect to each of his functions, like making a new order from a supplier, adding a new supplier, reading 
notifications about internal order or quality check reports and managing the account
<br>
<br>
<br>


![choose_order](GUI Prototypes/choose_order.png "Choose Supplier")
<br>
After clicking on the Order icon in the navbar the WH Manager is redirected in this page where he has to choose
the supplier from which he wants to order (see business rule in Class Diagram), there he can click on the supplier to go
to the order page
<br>
<br>
<br>


![order](GUI Prototypes/order.png "Order")
<br>
After clicking on the Supplier the Manager is redirected in this page in which he can filter the items using the 
category on the left (every item will be shown in the right window, when a filter is clicked only the items 
regarding that category remain) in the right window the manager can choose the item by inserting the number under it
and clicking the plus button, after that the items are in the cart and the order can be confirmed by clicking Request,
Another way to make an order is to click the last order button on the bottom-right corner that insert in the cart the
last order made and then by clicking Request.
<br>
<br>
<br>


![New Supplier](GUI Prototypes/manage_supplier_manager.png "New Supplier")
<br>
By clicking to the Manage Supplier button the Manager is redirected in the Manage supplier page, in this page
he can delete a supplier by clicking to the trash icon in the same row or be redirected to the page below by
clicking on the ADD New Supplier button, there he can insert the informations about the new Supplier and add it
to the DB by clicking ADD button
<br>
<br>
<br>


![notifications](GUI Prototypes/notifications-manager.png "Notifications")
<br>
The Manager is redirected in this page when clicking on the Notifications icons, in this page he can read notifications
regarding Quality Reports and internal orders, considering NEGATIVE quality reports he can request a refound clicking on
the button with the same name or request missing/broken items to the supplier, a notification is then send to the supplier
<br>
<br>
<br>




