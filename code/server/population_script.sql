INSERT INTO POSITION (id, aisle, `row`, col, max_weight, max_volume, occupied_weight, occupied_volume)
VALUES (111, 1, 1, 1, 100, 100, 0, 0);

INSERT INTO SKU (id, description, weight, volume, price, notes, available_quantity, position_id)
VALUES (1, 'test 1', 10.3, 2.4, 16.32, 'notes', 5, 111);

-- INSERT INTO SKU (id, description, weight, volume, price, notes, available_quantity, position_id)
-- VALUES (2, 'test 2', 10.3, 2.4, 16.32, 'notes', 5, 222);

INSERT INTO SKU_ITEM (rfid, available, sku_id, date_of_stock)
VALUES ('1111', 1, 1, DATE('19/04/2022'));

INSERT INTO TEST_DESCRIPTOR (id, name, procedure_description, sku_id)
VALUES (1, 'proc 1', 'test proc', 1);