import React from "react";
export const CustomMessage = (message, type, enqueueSnackbar) => {
  enqueueSnackbar(message, {
    variant: type,
  });
};
