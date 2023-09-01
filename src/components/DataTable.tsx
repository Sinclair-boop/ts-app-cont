import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import "../___mock___";
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { Contact } from "../models/Contact";
import axios from "axios";

interface Props {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  modif: boolean;
  setModif: React.Dispatch<React.SetStateAction<boolean>>;
  idModif: GridRowId;
  setIdModif: React.Dispatch<React.SetStateAction<GridRowId>>;
}
export default function FullFeaturedCrudGrid({
  contacts,
  setContacts,
  openModal,
  setOpenModal,
  modif,
  setModif,
  idModif,
  setIdModif,
}: Props) {
  console.log("===> Les contact", contacts);

  // ===> SUPRIMER UN CONTACT
  const onDeleteContact = async (id: GridRowId) => {
    try {
      const { data } = await axios.delete("/contactdel", {
        params: { id: id, data: contacts },
      });

      setContacts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    console.log("===> le type GridRowId se presente comme", id);
    setModif(true);
    setIdModif(id);
    setOpenModal(true);
    // onPatchContact(id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    window.confirm("Voulez vous vraiment supprimer");
    onDeleteContact(id);
  };

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "Nom", width: 180, editable: true },
    { field: "lastName", headerName: "Prenom", width: 180, editable: true },
    { field: "email", headerName: "Email", width: 180, editable: true },

    {
      align: "right",
      headerAlign: "right",
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={contacts}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop}
        slotProps={{
          toolbar: { setContacts, setRowModesModel },
        }}
      />
    </Box>
  );
}
