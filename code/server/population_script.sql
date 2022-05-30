
INSERT INTO POSITION (id, aisle, `row`, col, max_weight, max_volume, occupied_weight, occupied_volume)
VALUES (800011111111, 8000, 1111, 1111, 2000, 2000, 125, 1100);

INSERT INTO POSITION (id, aisle, `row`, col, max_weight, max_volume, occupied_weight, occupied_volume)
VALUES (800022222222, 8000, 2222, 2222, 500, 500, 0, 0);

INSERT INTO POSITION (id, aisle, `row`, col, max_weight, max_volume, occupied_weight, occupied_volume)
VALUES (800033333333, 8000, 3333, 3333, 800, 800, 0, 0);


INSERT INTO SKU (id, description, weight, volume, price, notes, available_quantity, position_id)
VALUES (1, 'pen', 0.2, 1.5, 1.39, 'notes', 500, 800011111111);

INSERT INTO SKU (id, description, weight, volume, price, notes, available_quantity, position_id)
VALUES (2, 'pencil', 0.1, 1.4, 1.29, 'notes', 250, 800011111111);


INSERT INTO SKU_ITEM (rfid, available, sku_id, date_of_stock)
VALUES ('1111', 1, 1,'19/04/2022');

INSERT INTO SKU_ITEM (rfid, available, sku_id, date_of_stock)
VALUES ('1112', 0, 1, '20/04/2022');

INSERT INTO SKU_ITEM (rfid, available, sku_id, date_of_stock)
VALUES ('1113', 1, 2, '22/04/2022');


INSERT INTO TEST_DESCRIPTOR (id, name, procedure_description, sku_id)
VALUES (1, 'proc 1', 'test proc', 1);

INSERT INTO TEST_DESCRIPTOR (id, name, procedure_description, sku_id)
VALUES (2, 'proc 2', 'test proc', 1);

INSERT INTO TEST_DESCRIPTOR (id, name, procedure_description, sku_id)
VALUES (3, 'proc 3', 'test proc', 2);


INSERT INTO ITEM(id, sku_id, description, price, supplier_id)
VALUES(1, 1, "pen", 1.39, 2);

INSERT INTO ITEM(id, sku_id, description, price, supplier_id)
VALUES(2, 2, "pencil", 1.29, 2);
