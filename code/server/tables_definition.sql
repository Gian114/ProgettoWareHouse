/*
SQLITE container data types

NULL. The value is a NULL value.

INTEGER. The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.

REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.

TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).

BLOB. The value is a blob of data, stored exactly as it was input.

For DATE there is no specific container but we use DATE and let sqlite use the tipe he wants
*/

CREATE TABLE IF NOT EXISTS SKU (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    weight REAL NOT NULL,
    volume REAL NOT NULL,
    price REAL NOT NULL,
    notes TEXT NOT NULL,
    available_quantity INTEGER NOT NULL,
    position_id TEXT DEFAULT NULL,
    FOREIGN KEY(position_id) REFERENCES POSITION(id)
);

CREATE TABLE IF NOT EXISTS SKU_ITEM (
    rfid TEXT PRIMARY KEY,
    available INTEGER NOT NULL, /* boolean */
    sku_id INTEGER NOT NULL,
    date_of_stock DATE NOT NULL,
    return_order_id INTEGER DEFAULT NULL,
    restock_order_id INTEGER DEFAULT NULL,
    internal_order_id INTEGER DEFAULT NULL,
    FOREIGN KEY(sku_id) REFERENCES SKU(id),
    FOREIGN KEY(return_order_id) REFERENCES RETURN_ORDER(id),
    FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id),
    FOREIGN KEY(internal_order_id) REFERENCES INTERNAL_ORDER(id)
);

CREATE TABLE IF NOT EXISTS POSITION (
    id TEXT PRIMARY KEY,
   	aisle TEXT NOT NULL,
	row TEXT NOT NULL,
    col TEXT NOT NULL,
    max_weight REAL NOT NULL,
	max_volume REAL NOT NULL,
	occupied_weight REAL NOT NULL,
	occupied_volume REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    procedure_description TEXT NOT NULL,
    sku_id INTEGER NOT NULL,
    FOREIGN KEY(sku_id) REFERENCES SKU(id)
);

CREATE TABLE IF NOT EXISTS TEST_RESULT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    result INTEGER NOT NULL, /* boolean */
    sku_item_rfid TEXT NOT NULL,
    test_descriptor_id INTEGER NOT NULL,
    FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(rfid),
    FOREIGN KEY(test_descriptor_id) REFERENCES TEST_DESCRIPTOR(id)
);

CREATE TABLE IF NOT EXISTS USER (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT NOT NULL, 
    name TEXT NOT NULL, 
    surname TEXT NOT NULL, 
    type TEXT NOT NULL, 
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS RESTOCK_ORDER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_date TEXT NOT NULL,
    state TEXT NOT NULL,
    supplier_id INTEGER NOT NULL,
    TNdelivery_date TEXT DEFAULT NULL,
    FOREIGN KEY(supplier_id) REFERENCES USER(id)
);

CREATE TABLE IF NOT EXISTS RETURN_ORDER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_date TEXT NOT NULL,
    restock_order_id INTEGER NOT NULL,
    FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id)
);

CREATE TABLE IF NOT EXISTS INTERNAL_ORDER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_date TEXT NOT NULL,
    state TEXT NOT NULL,
    customer_id INTEGER NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES USER(id)
);

CREATE TABLE IF NOT EXISTS ITEM (
    id INTEGER PRIMARY KEY,
    sku_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    supplier_id INTEGER NOT NULL,
    FOREIGN KEY(sku_id) REFERENCES SKU(id),
    FOREIGN KEY(supplier_id) REFERENCES USER(id)
);

CREATE TABLE IF NOT EXISTS PRODUCT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    restock_order_id INTEGER DEFAULT NULL,
    internal_order_id INTEGER DEFAULT NULL,
    return_order_id INTEGER DEFAULT NULL,
    FOREIGN KEY(sku_id) REFERENCES SKU(id),
    FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id),
    FOREIGN KEY(internal_order_id) REFERENCES INTERNAL_ORDER(id),
    FOREIGN KEY(return_order_id) REFERENCES RETURN_ORDER(id)
);