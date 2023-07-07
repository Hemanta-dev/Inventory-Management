import React from 'react';
import { EuiTableHeader, EuiTableRow, EuiTableRowCell, EuiTableBody, EuiTable, EuiTableHeaderCell, EuiButton, EuiFlexGroup, EuiFlexItem ,EuiSpacer} from "@elastic/eui";
import ImageComponent from "../base64StringToImage";

const ItemsList = ({ itemsList, deleteItems, editItems }) => {
    if (!itemsList) {
        // Render a loading state or a message when itemsList is undefined or empty
        return <div>Loading...</div>;
      }
    
  return (
    <div>
      <EuiTable>
        <EuiTableHeader>
          <EuiTableHeaderCell>Item Name</EuiTableHeaderCell>
          <EuiTableHeaderCell>Item Units</EuiTableHeaderCell>
          <EuiTableHeaderCell>Damage Item Units</EuiTableHeaderCell>
          <EuiTableHeaderCell>Remarks</EuiTableHeaderCell>
          <EuiTableHeaderCell>Actions</EuiTableHeaderCell>
        </EuiTableHeader>
        <EuiTableBody>
          {itemsList.map((item) => (
            <EuiTableRow key={item._id}>
              <EuiTableRowCell>{item.itemName}</EuiTableRowCell>
              <EuiTableRowCell>{item.itemsUnits}</EuiTableRowCell>
              <EuiTableRowCell>{item.damageItemsUnits}</EuiTableRowCell>
              <EuiTableRowCell>{item.remarks}</EuiTableRowCell>
              <EuiTableRowCell>
                <EuiFlexGroup gutterSize="s">
                  <EuiFlexItem>
                    <EuiButton size="s" onClick={() => editItems(item._id)}>
                      Edit
                    </EuiButton>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiButton size="s" color="danger" onClick={() => deleteItems(item._id)}>
                      Delete
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiTableRowCell>
            </EuiTableRow>
          ))}
        </EuiTableBody>
      </EuiTable>
      <EuiSpacer size="l" />
      <ImageComponent />
    </div>
  );
};

export default ItemsList;
