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
    description TEXT,
    weight REAL,
    volume REAL,
    price REAL,
    notes TEXT,
    available_quantity INTEGER,
    position_id INTEGER NOT NULL,
    FOREIGN KEY(position_id) REFERENCES POSITION(id)
);

CREATE TABLE IF NOT EXISTS SKU_ITEM (
    rfid TEXT PRIMARY KEY,
    available INTEGER, /* boolean */
    sku_id INTEGER NOT NULL,
    date_of_stock DATE,
    FOREIGN KEY(sku_id) REFERENCES SKU(id)
);

CREATE TABLE IF NOT EXISTS POSITION (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
   	aisle TEXT NOT NULL,
	row TEXT,
    col TEXT,
    max_weight REAL,
	max_volume REAL,
	occupied_weight REAL,
	occupied_volume REAL
);

CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    procedure_description TEXT,
    sku_id INTEGER NOT NULL,
    FOREIGN KEY(sku_id) REFERENCES SKU(id)
);

CREATE TABLE IF NOT EXISTS TEST_RESULT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    result INTEGER, /* boolean */
    sku_item_rfid TEXT NOT NULL,
    test_descriptor_id INTEGER NOT NULL,
    FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(rfid),
    FOREIGN KEY(test_descriptor_id) REFERENCES TEST_DESCRIPTOR(id)
);

CREATE TABLE IF NOT EXISTS RESTOCK_ORDER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_date TEXT NOT NULL,
    state TEXT NOT NULL, 
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    delivery_date TEXT,
    sku_item_rfid TEXT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES PRODUCT(id),
    FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(id)
    
);

CREATE TABLE IF NOT EXISTS RETURN_ORDER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    returnDate TEXT,
    sku_item_rfid TEXT NOT NULL, 
    restock_order_id INTEGER NOT NULL,
    FOREIGN KEY(sku_item_rfid) REFERENCES SKU_ITEM(rfid),
    FOREIGN KEY(restock_order_id) REFERENCES RESTOCK_ORDER(id)
);

CREATE TABLE IF NOT EXISTS PRODUCT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL FOREIGN KEY REFERENCES SKU(id),
    description TEXT,
    price REAL,
    quantity INTEGER
);