/*
SQLITE container data types

NULL. The value is a NULL value.

INTEGER. The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.

REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.

TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).

BLOB. The value is a blob of data, stored exactly as it was input.

For DATE there is no specific container but we use DATE and let sqlite use the tipe he wants
*/

CREATE TABLE IF NOT EXISTS POSITION (
    id INTEGER PRIMARY KEY,
   	aisle INTEGER,
	row INTEGER,
    col INTEGER,
    max_weight REAL,
	max_volume REAL,
	occupied_weight REAL,
	occupied_volume REAL
);

CREATE TABLE IF NOT EXISTS SKU (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    weight REAL,
    volume REAL,
    price REAL,
    notes TEXT,
    available_quantity INTEGER,
    position_id INTEGER,
    CONSTRAINT fk_position
        FOREIGN KEY (position_id)
        REFERENCES POSITION(id)
);

CREATE TABLE IF NOT EXISTS SKU_ITEM (
    rfid TEXT PRIMARY KEY,
    available INTEGER, /* boolean */
    sku_id INTEGER,
    date_of_stock DATE,
    CONSTRAINT fk_sku
        FOREIGN KEY (sku_id)
        REFERENCES SKU(id)
);

CREATE TABLE IF NOT EXISTS TEST_RESULT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    result INTEGER, /* boolean */
    sku_item_rfid TEXT,
    test_descriptor_id INTEGER,
    CONSTRAINT fk_sku_item
        FOREIGN KEY (sku_item_rfid)
        REFERENCES SKU_ITEM(rfid)
    CONSTRAINT fk_test_descriptor
        FOREIGN KEY (test_descriptor_id)
        REFERENCES TEST_DESCRIPTOR(id)
);

CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    procedureDescription TEXT,
    sku_id INTEGER,
    CONSTRAINT fk_sku
        FOREIGN KEY (sku_id)
        REFERENCES SKU(id)
);